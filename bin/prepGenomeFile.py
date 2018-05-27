#
# prepGenomeFile.py
#
# Processes a GFF3 file, generating a simplified file of features and a file of chromosomes.
# 
# -------------------------------------------------------
# The feature output is a TSV file with these columns:
#    chromosome, start, end, strand, contig, lane, type, biotype, id, mgiid, symbol
#
# ID, chromosome, start, end, strand.
# Basic information for each feature.
#
# Associations to canonical genes.
# For MGP files (strain genomes other than B6), top level features may have an MGI id embedded in a description 
# attribute in col 9. This ID is taken as the asserted association to an MGI canonical gene. 
# These IDs are "scrubbed" - invalid IDs are screened, and secondary (old) IDs are converted to
# current preferred MGI id. 
#
# Type and biotype.
# The MGP GFF3 features have a type (col3) and may have a biotype (attribute in col 9)
# For the MGI.gff3 (C57BL/6J) file, features have a type (col 3), mgitype (col 9 attribute), 
# and so_term_name (col 9 attribute).
#
# Contigs. 
# Each group of overlapping features (each contig) is identified and given an id (integer counter).
# Features in a contig are tagged with the contig id.
#
# Swim lanes. 
# All features are assigned to swim lanes, where features within a lane do not overlap.
# A lane is a signed non-zero integer (... -2, -1, 1, 2, ...) where the sign indicates strand.
#
# -------------------------------------------------------
# The chromosome output is a TSV file with these columns:
#    chromosome, length
#    
# The MGP files include chromosome features. These are used to generate the simplified output.
# The MGI.gff3 file does not include chromosome features. The chromosomes and lengths are accumulated as 
# the features are processed.
#

import sys
import types
import gff3
import re
import argparse


class Prep:
    def __init__(self):
        self.args = None
        self.gffIn = None
	self.mapping = None
        self.tsvOut = None
        self.chrOut = None
        self.mgi_re = re.compile(r'(MGI:[0-9]+)')
	# init contig state
	self.contig = 0		# curr contig id
	self.contigChr = None	# curr contig chromosome
	self.contigHwm = None	# curr contig high water mark
	# init swim lanes
	#   - one set of lanes (a pool) per chromosome
	#   - each pool is a list of lanes
	#   - each lane has a high water mark and a list of features
	self.pools = {}
	#
	self.chr2length = {}
	#
        self.initArgParser()

    def initArgParser (self):
        """
        Sets up the parser for the command line args.
        """
        self.parser = argparse.ArgumentParser()
        self.parser.add_argument(
            '-f',
            dest="gffFile",
            metavar='GFF file', 
            help='Genome GFF3 input file. (Default=reads from stdin)')

        self.parser.add_argument(
            '--isMgi',
            dest='isMgi',
	    action='store_true',
	    default=False,
            help='Input is the MGI gff3 file. (default=Not MGI file).')

        self.parser.add_argument(
            '--isNotMgi',
            dest='isMgi',
	    action='store_false',
            help='Input is not the MGI gff3 file. (the default).')

        self.parser.add_argument(
            '-m',
            dest="mappingfile",
            metavar='FILE', 
            help='File of MGI primary and secondary ids. 2 columns, tab delimited. Columns=primaryId, secondaryId')

        self.parser.add_argument(
            '-o',
            dest="ofile",
            metavar='FILE', 
            help='Output file name. (default=writes to stdout)')

        self.parser.add_argument(
            '-c',
            dest="chrFile",
            metavar='FILE', 
            help='Output file for chromosomes (default=writes to OUTFILE.chromosomes.tsv')

    def parseArgs (self) :
        """
        """
        self.args = self.parser.parse_args()
	if self.args.isMgi:
	    self.processFeature = self.processMgiFeature
	    self.finalize = self.finalizeMgi
	else:
	    self.processFeature = self.processMgpFeature
	    self.finalize = self.finalizeMgp

    def openFiles(self):
        self.gffIn = sys.stdin
        if self.args.gffFile:
            self.gffIn = open(self.args.gffFile, "r")
	#
	if self.args.mappingfile:
	    # read the mapping file, build a dict
	    self.mapping = {}
	    for line in open( self.args.mappingfile, "r"):
	        toks = line[:-1].split("\t")
		if len(toks) != 3: continue
		if not toks[0].startswith("MGI:") or not toks[1].startswith("MGI:"): continue
		self.mapping[toks[0]] = (toks[1],toks[2])
	#
        self.tsvOut = sys.stdout
        if self.args.ofile:
           self.tsvOut  = open(self.args.ofile, "w")
        if self.args.chrFile is None:
            if self.args.ofile:
                self.args.chrFile = "chromosomes." + self.args.ofile 
            else:
                self.args.chrFile = "chromosomes.tsv"
        self.chrOut = open(self.args.chrFile, "w")


    def assignContig (self, f) :
	# assign f to a contig
	if self.contigChr is None or self.contigChr != f.seqid:
	    # start new contig at beginning and when chromosome changes
	    self.contig += 1
	    self.contigChr = f.seqid
	    self.contigHwm = f.end
	elif f.start > self.contigHwm:
	    # new contig
	    self.contig += 1
	    self.contigHwm = f.end
	else:
	    # curr feat is part of curr contig
	    self.contigHwm = max(self.contigHwm, f.end)
	f.attributes['contig'] = self.contig
	    
    def assignSwimLane (self, f) :
	# Assign f to a swim lane.
	# pools is a map from chromosome to 2 sets of lanes: one for pos strand and one for neg.
	# Each lane has a hight water mark and a list of features
	sign = 1 if f.strand == "+" else -1
	pool0 = self.pools.setdefault(f.seqid, [[],[]])
	pool = pool0[0] if sign == 1 else pool0[1]
	fLane = None    # the lane assigned to f
	for i,lane in enumerate(pool):
	    if f.start > lane[0]:
		fLane = (i+1)*sign
		lane[0] = f.end
		lane[1].append(f)
		break
	else:
	    pool.append( [f.end, [f]] ) # lane = [hwm, [list o' features]]
	    fLane = len(pool) * sign
	f.attributes['lane'] = fLane
	return fLane

    #
    def processMgiFeature(self, f):
	f.attributes['biotype'] = f.attributes.get('mgi_type','.')
	f.attributes['symbol'] = f.attributes.get('Name','.')
	f.attributes['mgiid'] = f.attributes.get('curie','.')
	self.chr2length[f[0]] = max(self.chr2length.get(f[0],0), f.end)
        return f

    #
    def finalizeMgi (self):
	def compare(a,b):
	    a = a[0]
	    b = b[0]
	    if len(a) == 1 and a.isdigit():
	        a = '0'+a
	    if len(b) == 1 and b.isdigit():
	        b = '0'+b
	    return cmp(a,b)
	chrs = self.chr2length.items()
	chrs.sort(compare)
	for c, l in chrs:
	    self.chrOut.write('%s\t%d\n' % (c,l))

    #
    def processMgpFeature(self, f):
	# exclude features on contigs.
	if len(f.seqid) > 2:
	    return None
	# write chromosome feature to chr file and continue
	if f.type == "chromosome":
	    r = [
		f.seqid,
		str(f.end - f.start + 1),
	    ]
	    self.chrOut.write('\t'.join(r) + '\n')
	    return None
	# regular old feature. get the MGI id, if any
	match = self.mgi_re.search(f.attributes.get('description',''))
	if match:
	    f.attributes['mgiid'] = match.group(1)
	    f.attributes['symbol'] = f.attributes.get("Name",".")
	    # in case they used secondary ids, convert to primary
	    primary = self.mapping.get(f.attributes['mgiid'], None)
	    if primary:
		sys.stderr.write("Secondary %s (%s) converted to primary %s (%s)\n"
		    % (f.attributes['mgiid'], f.attributes['symbol'], primary[0], primary[1]))
		f.attributes['mgiid'] = primary[0]
		f.attributes['symbol'] = primary[1]
	else:
	    f.attributes['mgiid'] = "."
	    f.attributes['symbol'] = "."
	return f

    #
    def finalizeMgp (self):
        pass
    #
    def go(self):
        self.parseArgs()
        self.openFiles()
        # 
        # write feature file col headers
        h1 = [
            "chromosome",
            "start",
            "end",
            "strand",
	    "contig",
	    "lane",
            "type",
            "biotype",
            "id",
            "mgiid",
            "symbol",
        ]
        self.tsvOut.write('\t'.join(h1) + '\n')
        #
	# write chr file col headers
        h2 = [
            "chromosome",
            "length",
        ]
        self.chrOut.write('\t'.join(h2) + '\n')

	# main loop

        for f in gff3.iterate(self.gffIn):
	    #
	    f = self.processFeature(f)
	    if f is None:
	        continue

	    self.assignContig(f)
	    sLane = self.assignSwimLane(f)
            # write the feature record
            r = [
                f.seqid,
                str(f.start),
                str(f.end),
                f.strand,
		str(f.attributes['contig']),
		str(f.attributes['lane']),
                f.type,
                f.attributes.get("biotype","."),
                f.ID.replace("gene:",""),
                f.attributes.get("mgiid","."),
                f.attributes.get("symbol",".")
            ]
            self.tsvOut.write('\t'.join(r) + '\n')
            #
	self.finalize()
#
Prep().go()
