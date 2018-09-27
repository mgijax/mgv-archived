#
# getDataFromMouseMine.py
#
# Script that generates data files for MGV by querying MouseMine.
# Usage:
#    python getDataFromMouseMine.py PATH
# where PATH specifies the output directory
# 

import sys
import urllib
import os.path
from os import environ as ENV
import argparse
import json

MOUSEMINE = ENV.get('MOUSEMINE', 'http://www.mousemine.org/mousemine')
Q_URL_TMPLT = MOUSEMINE + '/service/query/results?format=tab&query=%s'
MAX_SIZE  = int(ENV.get('SIZELIMIT', '0')) * 1000000
BLOCKSIZE = 2000000

class DataGetter :

    def __init__ (self, odir, genomes, doTranscripts) :
	self.odir = odir
	self.specifiedGenomes = genomes
	# allGenomes file
	self.gFn = os.path.join(self.odir, 'allGenomes.tsv')
	self.gFd = open(self.gFn, 'w')
	# chromosome file
	self.cFn = None
	self.cFd = None
	#
	self.fFn = None
	self.fFd = None
	#
	self.lFd = sys.stderr
	#
        self.doTranscripts = doTranscripts

    def log(self, s, writeNL = True):
        self.lFd.write(s)
        if writeNL: self.lFd.write('\n')

    def doQuery (self, q) :
	url = Q_URL_TMPLT % (urllib.quote_plus(q))
	fd = urllib.urlopen(url)
	for line in fd:
	    toks = line[:-1].split('\t')
	    toks[0] = toks[0].split('.')[0]
	    yield toks
	fd.close()
	
    def convertStrainName (self, s):
	if "PAHARI" in s:
	    return "mus_pahari"
	elif "CAROLI" in s:
	    return "mus_caroli"
	elif "SPRET" in s:
	    return "mus_spretus"
	else:
	    return "mus_musculus_" + s.lower().replace('/','')
	  
    # Returns iterator over the set of annotated genomes.
    # Args:
    #    none
    # Returns:
    #    List of rows, one per genome.
    #    Each row has a primary identifier, a name, and a filename prefix.
    def getGenomes (self) :
	q = '''<query 
	model="genomic"
	view="Strain.primaryIdentifier Strain.name"
	sortOrder="Strain.name ASC"
	>
	  <constraint path="Strain" op="IN" value="Annotated strains"/>
	</query>'''

	for r in self.doQuery(q):
	    r.append(self.convertStrainName(r[1]))
	    yield r

    # Returns iterator over chromosomes for the given genome
    # Args:
    #    g (string) the name of the genome, eg, "A/J"
    # Returns:
    #    List of rows, one per chromosome of the given genome.
    #    Each row has a chromosome id and total chromosome length.
    #    The rows are sorted by chromosome id.
    def getChromosomes (self, g) :
	q = '''<query 
	model="genomic"
	view="Chromosome.primaryIdentifier Chromosome.length"
	sortOrder="Chromosome.symbol ASC"
	>
	<constraint path="Chromosome.strain.name" op="=" value="%s"/>
	</query>''' % g

	return self.doQuery(q)

    # Returns an iterator over genes on the specified chromosome for the specified genome.
    # Genes are sorted by start position on the chromosome.
    # Args:
    #    g (string) the name of the genome, eg, "A/J"
    #    c (string) the chromosome, eg, "13"
    # Returns:
    #    Iterator that yields one row per gene in the specified genome.
    #    Each row has: strain name, gene id, chromosome location (chr, start, end, strand)
    def getGenes (self, g, c) :
	q = '''<query 
	model="genomic"
	view="
	  Gene.strain.name
	  Gene.primaryIdentifier
	  Gene.sequenceOntologyTerm.name
	  Gene.chromosome.primaryIdentifier
	  Gene.chromosomeLocation.start
	  Gene.chromosomeLocation.end
	  Gene.chromosomeLocation.strand
	  Gene.canonical.primaryIdentifier
	  Gene.canonical.symbol
	  "
	sortOrder="Gene.chromosomeLocation.start ASC"
	>
	<join path="Gene.canonical" style="OUTER"/>
	<constraint path="Gene.strain.name" op="=" value="%s"/>
	<constraint path="Gene.chromosome.primaryIdentifier" op="=" value="%s"/>
	</query>''' % (g, c)

	for r in self.doQuery(q):
	    # coords into integers
	    r[4] = int(r[4])
	    r[5] = int(r[5])
	    if r[5] - r[4] + 1 > MAX_SIZE > 0:
		self.log('Feature too big (skipped): ' + self.formatRow(r))
		continue
	    # convert strand from +1/-1 to just +/-
	    r[6] = '-' if r[6] == '-1' else '+'
	    # the outer join returns '""' in place of nulls.
	    # convert them to '.'
	    r[7] = '.' if r[7] == '""' else r[7]
	    r[8] = '.' if r[8] == '""' else r[8]
	    yield r

    # Formats a row (array of values) as a tab-delimited string.
    def formatRow(self, row):
        return '\t'.join(map(str, row)) + '\n'

    # Returns an iterator over all the transcripts on the specified chromosome of
    # the specified genome. Each transcript contains its exons in the form of a list of 
    # offsets and a list of lengths. Transcripts are returned sorted by start position.
    def getTranscripts (self, g, c) :
	# Query returns all exons of all transcripts. Exons are aggregated to a list of
	# offsets and lengths for each transcript.
        q = '''<query
	model="genomic"
	view="
	Transcript.gene.primaryIdentifier
	Transcript.primaryIdentifier
	Transcript.chromosome.primaryIdentifier
	Transcript.chromosomeLocation.start
	Transcript.chromosomeLocation.end
	Transcript.chromosomeLocation.strand
	Transcript.exons.chromosomeLocation.start
	Transcript.exons.length
	Transcript.gene.chromosomeLocation.start"
	constraintLogic="A and B"
	sortOrder="Transcript.chromosomeLocation.start ASC Transcript.primaryIdentifier ASC Transcript.exons.chromosomeLocation.start ASC"
	>
	  <constraint path="Transcript.strain.name" op="=" value="%s" code="A" />
	  <constraint path="Transcript.chromosome.primaryIdentifier" op="=" value="%s" code="B" />
	</query>
	''' % (g, c)
	#
	lastTid = None
	lastT = None
	for r in self.doQuery(q):
	    gid     =     r[0]
	    tid     =     r[1]
	    tChr    =     r[2]
	    tStart  = int(r[3])
	    tEnd    = int(r[4])
	    tStrand =     r[5]
	    eStart  = int(r[6])
	    eLength = int(r[7])
	    gStart  = int(r[8])
	    eOffset = eStart - tStart
	    if tid != lastTid:
	        if lastT:
		    yield lastT
		lastTid = tid

		lastT = [ tChr, '.', 'transcript', tStart, tEnd, '.', tStrand, '.', 
		        { 'ID':tid, 'gene_id':gid, 'eOffsets':[eOffset], 'eLengths':[eLength] } ]
	    else:
		lastT[8]['eOffsets'].append( eOffset )
		lastT[8]['eLengths'].append( eLength )
	#
	if lastT:
	    yield lastT
    #
    def processGenes(self, g, c) :
	# For all the genes on the specified chromosome of the specified genome...
	ca = ContigAssigner()
	sa_plus = SwimLaneAssigner()
	sa_minus = SwimLaneAssigner()
	for i,f in enumerate(self.getGenes(g, c)):
	    tp = 'pseudogene' if 'pseudo' in f[2] else 'gene'
	    contig = ca.assignNext(f[4], f[5])
	    if f[6] == '+':
		lane = sa_plus.assignNext(f[4], f[5])
	    else:
		lane = -sa_minus.assignNext(f[4], f[5])
	    #row = [f[3], f[4], f[5], f[6], contig, lane, tp, f[2], f[1], f[7] , f[8]]
	    #self.fFd.write(self.formatRow(row))
	    attrs = {
	        'ID' : f[1],
		'canonical_id' : f[7],
		'canonical_symbol' : f[8],
		'lane' : lane,
		'contig': contig,
		'biotype' : f[2],
	    }
	    gffrow = [f[3], '.', tp, f[4], f[5], '.', f[6], '.', attrs]
	    yield gffrow

    # Process all the transcripts on the specified chromosome of the specified genome.
    # 
    def processTranscripts (self, g, c, id2feat):
	self.tdir = os.path.join(self.gdir, 'transcripts')
	if not os.path.isdir(self.tdir):
	    os.mkdir(self.tdir)
	tFn = None
	tFd = None
	cBlk = None
	seen = set()
        for t in self.getTranscripts(g[1], c[0]):
	    ta = t[8]
	    gene = id2feat.get(ta['gene_id'], None)
	    if not gene:
		self.log("Skipping transcript (gene not found): " + str(t))
	        continue
	    ga = gene[8]
	    ga['transcript_count'] = ga.setdefault('transcript_count',0) + 1
	    # Figure out which output file this goes in. May reopen a 
	    # file we've seen before.
	    gStart = gene[3]
	    gBlock = gStart / BLOCKSIZE
	    fn = 'chr%s.%d.json' % (c[0], gBlock)
	    if gBlock != cBlk:
	        if tFd:
		    tFd.close()
		tFn = os.path.join(self.tdir, fn)
		mode = 'a' if fn in seen else 'w'
		self.log(str(gBlock) + ' ', False)
		tFd = open(tFn, mode)
		if mode == 'w':
		    tFd.write('[\n')
	    cBlk = gBlock
	    sep = ',' if fn in seen else ''
	    tFd.write(sep + json.dumps(t) + '\n')
	    seen.add(fn)
	if tFd:
	    tFd.close()
	self.log('')
	for fn in seen:
	    fd = open(os.path.join(self.tdir, fn), 'a')
	    fd.write(']\n')
	    fd.close()

    # Reads data for one genome from mousemine and writes files to disk.
    def processGenome (self, g) :
	self.gdir = os.path.join(self.odir, g[2])
	if not os.path.isdir(self.gdir) :
	    os.mkdir(self.gdir)
	# Init chromosome file for this genome
	self.cFn = os.path.join(self.gdir, 'chromosomes.tsv')
	self.cFd = open(self.cFn, 'w')
	self.cFd.write('chromosome\tlength\n')
	# Init feature file for this genome
	self.fFn = os.path.join(self.gdir, 'features.json')
	self.fFd = open(self.fFn, 'w')
	self.fFd.write('[\n')
	# Process features and transcripts one chromosome at a time
	sep = ''
	for c in self.getChromosomes(g[1]):
	    self.log(c[0])
	    # Write chromosome record
	    self.cFd.write('%s\t%s\n' % (c[0],c[1]))
	    # Get all the features for this chromosome and index by id
	    # Load genes into memory. Then stream all transcripts+exons to files.
	    # All the transcripts/exons for a given gene are output to a file whose
	    # name is computed (in part) from the gene's start position.
	    # Along the way, increment transcript counts in the cached genes.
	    # Then write the genes.
	    feats = []
	    id2feat = {}
	    for f in self.processGenes(g[1], c[0]):
		feats.append(f)
		id2feat[f[8]['ID']] = f
	    if self.doTranscripts:
		# Now process all transcripts on this chromosome
		self.processTranscripts(g, c, id2feat)
	    # Output the features
	    for f in feats:
		self.fFd.write(sep + json.dumps(f) + '\n')
		sep = ','
	# close files
	self.fFd.write(']\n')
	self.fFd.close()
	self.cFd.close()

    # Main program. 
    def main (self):
	# Init genome file
	self.gFd.write('name\tlabel\n')
	genomes = list(self.getGenomes())
	genomes.sort(lambda a,b: cmp(a[2],b[2]))
	# For all the genomes we know about...
	for g in genomes:
	    # g == [primaryIdentifier, name, filename]
	    if self.specifiedGenomes and g[1] not in self.specifiedGenomes:
		self.log('Skipping genome: ' + g[1])
	    else:
		# Write genome record
		self.log("Processing " + g[1])
		self.gFd.write('%s\t%s\n' % (g[2],g[1]))
		self.processGenome(g)
	self.gFd.close()

#
class ContigAssigner :
    def __init__ (self) :
        self.contig = 0
	self.hwm = None

    def assignNext(self, fstart, fend):
        if self.hwm is None or fstart > self.hwm:
	    self.contig += 1
	self.hwm = max(self.hwm, fend)
	return self.contig

#
class SwimLaneAssigner :
    def __init__ (self):
        self.lanes = []

    def assignNext (self, fstart, fend) :
	for i, hwm in enumerate(self.lanes):
	    if fstart > hwm:
		self.lanes[i] = fend
		return i+1
	else:
	    self.lanes.append(fend) 
	    return len(self.lanes)

def getArgs ():
    parser = argparse.ArgumentParser(description='Generate MGV data files from MouseMine.')

    parser.add_argument(
	'-d',
	'--directory',
	dest="odir",
	required=True,
	metavar='PATH', 
	help='Where the output files go.')

    parser.add_argument(
	'-g',
	'--genome',
	dest="genomes",
	metavar='NAME', 
	action='append',
	help='Specify a specific genome. Repeat to specify multiple genomes.')

    parser.add_argument(
	'-t',
	'--transcripts',
	dest="doTranscripts",
	action='store_true',
	default=False,
	help='Also generate transcript files.')

    return parser.parse_args()

if __name__ == "__main__":
    args = getArgs()
    DataGetter(args.odir, args.genomes, args.doTranscripts).main()

