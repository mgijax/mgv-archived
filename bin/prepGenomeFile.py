
#
# prepGenomeFile.py
#
# Write out chromosome file (chr name + length).
# Excludes features on contigs
#

import sys
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
        self.initArgParser()

    def initArgParser (self):
        """
        Sets up the parser for the command line args.
        """
        self.parser = argparse.ArgumentParser(description='Generate synteny blocks.')
        self.parser.add_argument(
            '-f',
            dest="gffFile",
            metavar='GFF file', 
            help='Genome GFF3 input file. (Default=reads from stdin)')

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
        #
	# for each input feature...
	#

	# init contig state
	contig = 0		# curr contig id
	contigChr = None	# curr contig chromosome
	contigHwm = None	# curr contig high water mark

	# init swim lanes
	#   - one set of lanes (a pool) per chromosome
	#   - each pool is a list of lanes
	#   - each lane has a high water mark and a list of features
	pools = {}

        for f in gff3.iterate(self.gffIn):
            # exclude features on contigs.
            if len(f.seqid) > 2:
                continue
	    # write chromosome feature to chr file and continue
            if f.type == "chromosome":
                r = [
                    f.seqid,
                    str(f.end - f.start + 1),
                ]
                self.chrOut.write('\t'.join(r) + '\n')
                continue
            # regular old feature. get the MGI id, if any
            match = self.mgi_re.search(f.attributes.get('description',''))
            if match:
                mgiid = match.group(1)
		symbol = f.attributes.get("Name",".")
		# in case they used secondary ids, convert to primary
		primary = self.mapping.get(mgiid, None)
		if primary:
		    sys.stderr.write("Secondary %s (%s) converted to primary %s (%s)\n"
		        % (mgiid, symbol, primary[0], primary[1]))
		    mgiid = primary[0]
		    symbol = primary[1]
	    else:
		mgiid = "."
		symbol = "."

            # assign f to a contig
	    if contigChr is None or contigChr != f.seqid:
		# start new contig at beginning and when chromosome changes
	        contig += 1
		contigChr = f.seqid
	        contigHwm = f.end
	    elif f.start > contigHwm:
	        # new contig
		contig += 1
		contigHwm = f.end
	    else:
	        # curr feat is part of curr contig
		contigHwm = max(contigHwm, f.end)
	    
	    # Assign f to a swim lane.
	    # pools is a map from chromosome to 2 sets of lanes: one for pos strand and one for neg.
	    # Each lane has a hight water mark and a list of features
	    sign = 1 if f.strand == "+" else -1
	    pool0 = pools.setdefault(f.seqid, [[],[]])
	    pool = pool0[0] if sign == 1 else pool0[1]
	    fLane = None
	    for i,lane in enumerate(pool):
	        if f.start > lane[0]:
		    fLane = (i+1)*sign
		    lane[0] = f.end
		    lane[1].append(f)
		    break
            else:
		fLane = sign
	        pool.append( [f.end, [f]] ) # lane = [hwm, [list o' features]]


            # write the feature record
            r = [
                f.seqid,
                str(f.start),
                str(f.end),
                f.strand,
		str(contig),
		str(fLane),
                f.type,
                f.attributes.get("biotype","."),
                f.ID.replace("gene:",""),
                mgiid,
                symbol
            ]
            self.tsvOut.write('\t'.join(r) + '\n')
            #
#
Prep().go()
