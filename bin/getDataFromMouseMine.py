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

class DataGetter :

    def __init__ (self, odir, genomes) :
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

    def log(self, s):
        self.lFd.write(s)
        self.lFd.write('\n')

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
	    try:
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
	    except:
	        self.log("ERROR: skipping row: " + str(r))

    def formatRow(self, row):
        return '\t'.join(map(str, row)) + '\n'

    # Finds the number of transcripts for all genes on the specified chromosome in the specified genome
    # Returns a dict mapping gene id -> count.
    def getTranscriptCounts (self, g, c) :
        q = '''<query
	model="genomic"
	view="
	Transcript.primaryIdentifier
	Transcript.gene.primaryIdentifier"
	longDescription=""
	sortOrder="Transcript.primaryIdentifier asc"
	constraintLogic="A and B">
	  <constraint path="Transcript.gene.strain.name" code="A" op="=" value="%s"/>
	  <constraint path="Transcript.chromosome.primaryIdentifier" code="B" op="=" value="%s"/>
	</query>''' % (g,c)
	index = {}
	for r in self.doQuery(q) :
	    index[r[1]] = index.setdefault(r[1],0) + 1
        return index
    #
    def getTranscripts (self, g, c) :
	# Query returns transcripts and their exons.
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
	Transcript.exons.length"
	constraintLogic="A and B"
	sortOrder="Transcript.primaryIdentifier ASC Transcript.exons.chromosomeLocation.start ASC"
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
	#for t in self.getTranscripts(g, c):
	    #print t
	for f in self.getGenes(g, c):
	    tp = 'pseudogene' if 'pseudo' in f[2] else 'gene'
	    contig = ca.assignNext(f[4], f[5])
	    if f[6] == '+':
		lane = sa_plus.assignNext(f[4], f[5])
	    else:
		lane = -sa_minus.assignNext(f[4], f[5])
	    #row = [f[3], f[4], f[5], f[6], contig, lane, tp, f[2], f[1], f[7] , f[8], txptCounts.get(f[1],1)]
	    row = [f[3], f[4], f[5], f[6], contig, lane, tp, f[2], f[1], f[7] , f[8]]
	    self.fFd.write(self.formatRow(row))
	    attrs = {
	        'ID' : f[1],
		'canonical_id' : f[7],
		'canonical_symbol' : f[8],
		'lane' : lane,
		'contig': contig,
		'biotype' : f[2],
	    }
	    gffrow = [f[3], '.', tp, f[4], f[5], '.', f[6], '.', attrs]
	    print json.dumps(gffrow)

    # Main program. 
    def main (self):
	# Init genome file
	self.gFd.write('name\tlabel\n')
	genomes = list(self.getGenomes())
	genomes.sort(lambda a,b: cmp(a[2],b[2]))
	# For all the genomes we know about...
	for g in genomes:
	    #
	    if self.specifiedGenomes and g[1] not in self.specifiedGenomes:
		self.log('Skipping genome: ' + g[1])
	        continue
	    # Write genome record
	    self.log(g[1])
	    self.gFd.write('%s\t%s\n' % (g[2],g[1]))
	    # Init chromosome file
	    self.cFn = os.path.join(self.odir, '%s-chromosomes.tsv'%g[2])
	    self.cFd = open(self.cFn, 'w')
	    self.cFd.write('chromosome\tlength\n')
	    # Init feature file
	    self.fFn = os.path.join(self.odir, '%s-features.tsv'%g[2])
	    self.fFd = open(self.fFn, 'w')
	    self.fFd.write('chromosome\tstart\tend\tstrand\tcontig\tlane\ttype\tbiotype\tid\tmgiid\tsymbol\n')
	    # Process features a chromosome at a time
	    for c in self.getChromosomes(g[1]):
		# Write chromosome record
		self.log(c[0])
		self.cFd.write('%s\t%s\n' % (c[0],c[1]))
		# 
		self.processGenes(g[1], c[0])

class ContigAssigner :
    def __init__ (self) :
        self.contig = 0
	self.hwm = None

    def assignNext(self, fstart, fend):
        if self.hwm is None or fstart > self.hwm:
	    self.contig += 1
	self.hwm = max(self.hwm, fend)
	return self.contig

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
	help='Specify a specific genome')

    return parser.parse_args()

if __name__ == "__main__":
    args = getArgs()
    DataGetter(args.odir, args.genomes).main()

