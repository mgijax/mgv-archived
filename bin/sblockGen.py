'''
sblockGen.py

Given two sets of features, one from genome A and one from genome B,
generates synteny blocks between genome A and genome B.

Inputs: 2 files
    1. A file of features from genome A. We'll call this "A". Required.
    2. A file of features from genome B. We'll call this "B". Required.

Outputs a tab-delimited file of inferred synteny blocks.
Each row corresponds to one block, and has the following fields:
    1. block id, integer
    2. block count, number of AB pairs used to infer this block
    3. block orientation, + or -
    4. aChr: chromosome in A genome
    5. aStart: start position on aChr
    6. aEnd: end position on aChr
    7. bChr: chromosome in b genome
    8. bStart: start position on bChr
    9. bEnd: end position on bChr
'''
import argparse
import sys
import gff3
import math

TAB = '\t'
NL = '\n'
COMMA = ','

class SBlockGenerator:
    def __init__ (self):
        self.args = self.parseArgs()
	self.a = Genome(self.args.aGenome).readFromFile(self.args.aFile)
	self.b = Genome(self.args.bGenome).readFromFile(self.args.bFile)

    def go(self):
        pass

    def log (self, s) :
        sys.stderr.write(s)
	sys.stderr.write('\n')

    def parseArgs (self):
        self.parser = argparse.ArgumentParser(description='Generate synteny blocks.')

        self.parser.add_argument(
	    '-a',
            '--aGenome',
            required=True,
            dest="aGenome",
            metavar='NAME', 
            help='Name of genome A.')

        self.parser.add_argument(
	    '-f',
            '--aFile',
            required=True,
            dest="aFile",
            metavar='FILE', 
            help='GFF3 file of features from genome A.')

        self.parser.add_argument(
	    '-b',
            '--bGenome',
            required=True,
            dest="bGenome",
            metavar='NAME', 
            help='Name of genome B.')

        self.parser.add_argument(
	    '-g',
            '--bFile',
            required=True,
            dest="bFile",
            metavar='FILE', 
            help='GFF3 file of features from genome B.')

	return self.parser.parse_args()

    def joinBlocks(self):
	# for each block in genome A
        for ba in self.a.blocks:
	    # for each feature in the block
	    bbs = set()
	    for fa in ba.feats:
		# get the genome B feature(s) it joins to
	        fbs = self.b.cid2feats.get(fa.canonicalId, [])
		# get their genome B blocks and add to our set
		bbs.update(set(map(lambda fb: fb.sblock, fbs)))
	    bbs = list(bbs)
	    bbs.sort(lambda x,y: x.id - y.id)
	    ba.partners = bbs
		

    def writeBlocks(self):
        b = [
              "blockId",
              "blockCount",
              "blockOri",
              "blockRatio",
              "aIndex",
              "aChr",
              "aStart",
              "aEnd",
              "aLength",
              "bIndex",
              "bChr",
              "bStart",
              "bEnd",
              "bLength",
            ]
        sys.stdout.write( '\t'.join(map(lambda x:str(x),b)) + '\n' )
        for block in self.blocks:
            blkid, ori, blkcount, fields, ids = block
            alen = fields['a']['end']-fields['a']['start']+1
            blen = fields['b']['end']-fields['b']['start']+1
            blkRatio = (1.0 * min(alen,blen)) / max(alen,blen);
            r = [
              blkid,
              blkcount,
              (ori==1 and "+" or "-"),
              "%1.2f"%blkRatio,
	      #
              fields['a']['index'],
              fields['a']['chr'],
              fields['a']['start'],
              fields['a']['end'],
              fields['a']['end']-fields['a']['start']+1,
	      #
              fields['b']['index'] - (blkcount-1 if ori == 1 else 0),
              fields['b']['chr'],
              fields['b']['start'],
              fields['b']['end'],
              fields['b']['end']-fields['b']['start']+1,
            ]
            sys.stdout.write( '\t'.join(map(lambda x:str(x),r)) + '\n' )

#
class Feature:
    def __init__(self, row, colNames):
	cn2 = []
        for i,c in enumerate(colNames):
	    v = row[i]
	    if c in ['start','end']:
	        v = int(v)
	    elif c == 'mgiid':
	        c = 'canonicalId'
	    elif c == 'chromosome':
	        c = 'chr'
	    setattr(self, c, v)
	    cn2.append(c)
	self.__colNames__ = cn2

    def __str__(self):
        return '{ %s }' % ', '.join(['%s:%s' % (c, getattr(self, c)) for c in self.__colNames__])

    def __repr__(self):
        return str(self)
    
class SBlock:
    def __init__(self, genome, ident, f):
	self.genome = genome
	self.id = ident
	f.sblock = self
        self.feats = [f]
	self.chr = f.chr
	self.start = f.start
	self.end = f.end
	self.minFin = f.index
	self.maxFin = f.index
	self.partners = []

    def __str__(self):
        return 'SBlock(genome:%s, id:%s, coords:%s:%d..%d, no.feats:%d)' %  \
	    (self.genome.name, self.id, self.chr, self.start, self.end, len(self.feats))

    def __repr__ (self):
        return str(self)
     
    def addFeature(self, f):
	#
	if f.chr != self.chr:
	    raise RuntimeError(
	      'Chromosomes do not agree: self:"%s" feature:"%s"' % (self.chr, f.chr))
	if f.index != self.maxFin+1 and f.index != self.minFin-1:
	    raise RuntimeError('Cannot add feature out of sequence.')
	#
	f.sblock = self
	self.feats.append(f)
	self.start  = min(self.start, f.start)
	self.end    = max(self.start, f.start)
	self.minFin = min(self.minFin, f.index)
	self.maxFin = max(self.maxFin, f.index)
	return self

    def isNeighbor(self, other):
	if self.chr != other.chr:
	    return False
	#self.ids other.ids mumble



class Genome:
    def __init__(self, name):
        self.name = name
	self.feats = None	# all the features sorted by chr,start
	self.blocks = None	# blocks (of features)
	self.id2feat = {}	# index by feature id
	self.cid2feats = {}	# index by canonical (eg MGI) id

    def	readFromFile(self, fname):
	self.feats = []
	self.blocks = []
	block = None
	fd = open(fname, 'r')
	colNames = ['index'] + fd.readline()[:-1].split(TAB)
	for i,line in enumerate(fd):
	    row = [i] + line[:-1].split(TAB)
	    f = Feature(row, colNames)
	    self.feats.append(f)
	    self.id2feat[f.id] = f
	    self.cid2feats.setdefault(f.canonicalId, []).append(f)
	    if not block or f.contig != block.id:
	        block = SBlock(self, f.contig, f)
		self.blocks.append(block)
	    else:
	        block.addFeature(f)
	return self;

#
def main () :
    global sbg
    sbg = SBlockGenerator()
    sbg.go()

#
main()

