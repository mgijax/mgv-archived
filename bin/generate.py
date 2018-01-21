
#
'''
generate.py

Given two sets of features, one from genome A and one from genome B,
and a file of a/b feature pairs defining corrospondence between features in A and B,
generates synteny blocks between genome A and genome B via interpolation.

Inputs: 2 files, plus optional 3rd:
    1. A file of features from genome A. We'll call this "A". Required.
    2. A file of features from genome B. We'll call this "B". Required.
    3. A 2-column, tab delimited file of A/B ID pairs, which defines 
       the correspondence between A and B features. We'll call this "AB".
       This file is optional. If not given, then features from A and B are
       considered equivalent if they have the same ID attribute.

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

Implementation outline:

1. Filter AB to contain only 1:1 relationships.

2. a. Filter file A for features whose ID appears in AB.
   b. Sort by chr+start position.
   c. Filter to remove any overlaps between features.
   d. Number the features, 1, 2, 3...

3. Repeat steps 2a-d, for file B.

4. a. Join A-AB-B to obtain a table of feature pairs.
   b. Project the needed columns:
       aIndex, aID, aChr, aStart, aEnd, aStrand,
       bIndex, bID, bChr, bStart, bEnd, bStrand

5. Generate synteny blocks. The heart of the algorithm is here.
   Given the output of step 4 (a file of corresponding pairs (a,b), separately numbered by position in each genome),
   we sort the table by aIndex, then scan the results, looking for breaks in the sequece of bIndex values - these 
   indicate synteny block boundaries. (Detail: also look for changes in aChr or bChr)
'''
import argparse
import sys
import gff3
import math

class SyntenyBlockGenerator:

    def __init__ (self):
        """
        Initializes the SyntenyBlockGenerator instance.
        """
        #
        self.A = None   # list of gff3.Features
        self.B = None   # list of gff3.Features
        self.AB = None  # list of [aid,bid] pairs
        #
        self.nBlocks = 0 # number of synteny blocks created.
        #

        self.initArgParser()

    def go (self):
        """
        The generator's main program. Reads the inputs, does the computation,
        and writes the synteny blocks to the output.
        """
        self.parseArgs()
        self.readFiles()
        self.prepAB()
        self.aid2feat = self.prepGff(self.A, self.a2b)
        self.bid2feat = self.prepGff(self.B, self.b2a)
        self.join()
        if self.args.debug:
	    self.writePairs()
        self.generateBlocks()
        self.writeBlocks()
#
    def initArgParser (self):
        """
        Sets up the parser for the command line args.
        """
        self.parser = argparse.ArgumentParser(description='Generate synteny blocks.')
        self.parser.add_argument(
            '-A',
            required=True,
            dest="fileA",
            metavar='AFEATURES', 
            help='GFF3 file of features from genome A.')

        self.parser.add_argument(
            '-B',
            required=True,
            dest="fileB",
            metavar='BFEATURES', 
            help='GFF3 file of features from genome B.')

        self.parser.add_argument(
            '-AB',
            dest="fileAB",
            metavar='FILE', 
            help='Tab delimited, 2-column file of A/B id pairs. These pairs define correspondence between features in AFEATURES and BFEATURES. If no -AB is provided, then features correspond if they have the same ID.')

        self.parser.add_argument(
            '-d',
            dest="debug",
            action="store_true",
            default=False,
            help='Debug mode.')

    def parseArgs (self) :
        """
        """
        self.args = self.parser.parse_args()

    def readFiles (self) :
        """
        Loads the 2 GFF3 files and the AB file (if specified).
        If no AB specified, generates AB so that features with same ID correspond.
        """
        self.A = self.readFeatureFile(self.args.fileA)
	self.ctgsByChrA = self.computeContigs(self.A)
        self.B = self.readFeatureFile(self.args.fileB)
	self.ctgsByChrB = self.computeContigs(self.B)
        if self.args.fileAB:
            # correspondence is based on data file provided by user
            self.AB = self.readTsv(self.args.fileAB)
        else:
            # correspondence is based on shared ID.
            allIds = set([f.ID for f in self.A] + [f.ID for f in self.B])
            self.AB = [ [i,i] for i in allIds ]

    def readFeatureFile (self, fname) :
        """
        Reads a tsv file of features. Returns list of gff3.Feature objects.
	Each row has these fields: chromosome, start, end, strand, type, biotype, id, mgiid, symbol
        """
	feats = []
	for r in self.readTsv(fname):
	    if r[0] == "chromosome":
	        continue
	    idval = r[6] if r[7] == "." else r[7]
	    f = gff3.Feature([
	        r[0],
		".",
		r[4],
		r[1],
		r[2],
		".",
		r[3],
		".",
		{ "ID" : idval,
		  "bioType": r[5],
		  "mgpId" : r[6]
		}
	    ])
	    if r[7] != ".":
	        f.attributes["mgiId"] = r[7]
		f.attributes["mgiSymbol"] = r[8]
	    feats.append(f);
        return feats

    def readTsv (self, fname) :
        """
        Reads a tab delimited text file.
        Returns list of records, each a list of field values.
        """
        rows = []
        fd = open(fname, 'r')
        for line in fd:
            rows.append( line[:-1].split("\t") )
        fd.close()
        return rows

    def indexAB (self) :
        """
        Creates a mapping from aid to list of corresponding bids.
        Creates a mapping from bid to list of corresponding aids.
        """
        self.a2b = {}  # map from a -> [ b's ]
        self.b2a = {}  # map from b -> [ a's ]
        for a,b in self.AB:
            self.a2b.setdefault(a,[]).append(b)
            self.b2a.setdefault(b,[]).append(a)

    def prepAB (self) :
        """
        Filters the A/B pairs to contain only the 1:1s.
        """
        # index all relationships
        self.indexAB()
        # look for the 1-1's, build new list of a,b pairs
        ab1_1 = []
        for a in self.a2b:
            if len(self.a2b[a]) == 1:
                b = self.a2b[a][0]
                if len(self.b2a[b]) == 1:
                    ab1_1.append([a,b])
        #
        self.AB = ab1_1
        # reindex with just the 1-1's
        self.indexAB()

    # Finds the contigs (clusters of overlappping features) in the list of features.
    # We use a gff3.Feature to represent each contig, as we only need its chr, start, and end coordinate.
    # Args:
    #    feats (list of Features) must be sorted by chr + start coord
    # Returns:
    #    Dict mapping chromosomes to their contigs:
    #       {chr -> [list-of-contigs for that chr]}.
    #
    def computeContigs(self, feats):
        #
	contigsByChr = {} # chr -> [ contigs for that chr, sorted by start coord ]
	currCtg = None
	#
	for f in feats:
	    if currCtg is None \
	    or not currCtg.overlaps(f):
	        currCtg = gff3.Feature(f)
		currCtg.source = '.'
		currCtg.type = 'contig'
		currCtg.strand = '.'
		currCtg.attributes = {'features':[f]}
		contigsByChr.setdefault(currCtg.seqid, []).append(currCtg)
	    else:
	        currCtg.end = max(currCtg.end, f.end);
		currCtg.attributes['features'].append(f)
	#
	return contigsByChr

    # Returns the contig intersected by the specified point (chr + position),
    # or None if there is no contig at that position
    # Args:
    #    which (string) "a" or "b"
    #    chr   (string) The chromosome. e.g. "17"
    #    coord (integer) The base position.
    #
    def getContigAt(self, which, chr, coord):
	# Binary search the list of contigs for this chromosome
        ctgs = (self.ctgsByChrA if which.upper() == "A" else self.ctgsByChrB)[chr]
	iMin = 0
	iMax = len(ctgs) - 1
	while iMin <= iMax:
	    iMid = (iMin + iMax) / 2
	    c = ctgs[iMid]
	    if coord < c.start:
	        iMax = iMid - 1
	    elif coord > c.end:
	        iMin = iMid + 1
	    else:
	        return c
	#
	return None

    def prepGff (self, feats, index) :
        """
        Filters, sorts, and otherwise modifies the list of GFF3 features
        to the refined list of (feature-like) objects.
        Returns an index from ID to feature-like object.
        """
        # a. Filter for features whose ID is in the index
        n = len(feats)
        feats[:] = filter(lambda f: f.ID.startswith("MGI:") and f.ID in index, feats)

        # b. Sort by chr+start position.
        def gffSorter (a, b) :
            if a.seqid == b.seqid:
                return cmp(a.start, b.start)
            else:
                return cmp(a.seqid, b.seqid)
        #
        feats.sort(gffSorter)

	'''
        # c. Filter to remove any overlaps between features.
        # IS THIS IMPORTANT??
        def overlaps(a, b):
            return a.seqid == b.seqid and a.start <= b.end and a.end >= b.start
        #
        nfs = []
        pf = None
        for f in feats:
            if pf and overlaps(pf, f):
                continue
            nfs.append(f)
            pf = f
        n = len(feats)
        feats[:] = nfs
	'''
        
        # d. Number the features, 1, 2, 3... and project just the bits we need
        nfs = []
        for i,f in enumerate(feats) :
            nf = {
                'index'  :   i,
                'ID'     :   f.ID,
                'chr'    :   f.seqid,
                'start'  :   f.start,
                'end'    :   f.end,
                'strand' :   f.strand
            }
            nfs.append(nf)
        feats[:] = nfs;
        #
        # e. Build an index from ID to feature, and return it.
        ix = {}
        for f in feats:
            ix[f['ID']] = f
        #
        return ix

    def renumber(self):
        """
        Renumbers the features in the current list of feature pairs to fill any gaps in the
        numbering sequence.
        """
        def _renumber(which):
            self.pairs.sort(
              lambda x,y: cmp(x[which]['index'], y[which]['index']))
            for i,p in enumerate(self.pairs): 
                if p[which]:
                    p[which]['index'] = i
        #
        _renumber('b')
        _renumber('a')
        # leave it sorted by a


    def join (self) :
        """
        Joins the features in A to their corresponding features in B.
        Generates a list of feature pairs. 
        Update: add pairs that contain just an A or just a B (to deal with
        insertions/deletions).
        """
        self.pairs = []
        for a in self.A:
            aid = a['ID']
            bid = self.a2b.get(aid,[None])[0]
            b = self.bid2feat.get(bid, None)
            #
            if not b: continue
            # 
            pair = {
              'a': a,
              'b': b
              }
            self.pairs.append(pair)
        #
        # the join step may cause genes to drop out, and it is important that the
        # sequence is unbroken for each genome
        self.renumber()

    def startBlock(self,pair):
        """
        Starts a new synteny block from the given feature pair.
        Returns the block, which is a list of 4 values:
         - Block id (integer) Block ids are assigned starting at 0.
           They have no meaning outside a given set of results.
         - Block orientation ("+" or "-") Specifies whether the A and B regions 
           of the block have the same or opposite orientations in their respective genomes.
         - Block count (integer) Records how many a/b feature pairs combined to generate this block
         - Pair (pair of feaures) Looks like this: {a:feature,b:feature}.
           Each feature (actually, feature-like object) is used to record the 
	   chromosome, start, and end of the syntenic region in its genome.
        """
        self.nBlocks += 1
        blockId = self.nBlocks
        blockCount = 1
	ori = +1 if (pair['a']['strand'] == pair['b']['strand']) else -1
	ids = set([pair['a']['ID'], pair['b']['ID']])
	pcopy = pair.copy()
        return [ blockId, ori, blockCount, pcopy, ids ]

    def extendBlock(self,newPair,currBlock):
        """
        Extends the given synteny block to include the coordinate
        ranges of the given pair.
        """
        bname,bori,bcount,bpair,bids = currBlock
        currBlock[2] = bcount+1
	bpair['a']['start'] = min(bpair['a']['start'], newPair['a']['start'])
	bpair['a']['end']   = max(bpair['a']['end'],   newPair['a']['end'])
	bids.add(newPair['a']['ID'])
	bpair['b']['start'] = min(bpair['b']['start'], newPair['b']['start'])
	bpair['b']['end']   = max(bpair['b']['end'],   newPair['b']['end'])
	bpair['b']['index'] = newPair['b']['index']
	bids.add(newPair['b']['ID'])

    def canMerge(self,newPair,currBlock):
        """
        Returns True iff the given pair can merge with (and extend)
        the given synteny block. 
        """
        if currBlock is None:
	    return False
        bid,bori,bcount,bpair,ids = currBlock
	nori = 1 if (newPair['a']['strand']==newPair['b']['strand']) else -1
        return \
            newPair['a']['chr'] == bpair['a']['chr'] \
            and newPair['b']['chr'] == bpair['b']['chr'] \
            and bori == nori \
            and (newPair['b']['index'] == bpair['b']['index']+bori)

    def generateBlocks (self) :
        """
        Scans the pairs, generating synteny blocks.
        """
        self.blocks = []
        currBlock = None
        for currPair in self.pairs:
            if self.canMerge(currPair,currBlock):
                self.extendBlock(currPair,currBlock)
            else:
                currBlock = self.startBlock(currPair)
                self.blocks.append(currBlock)
            currPair['block'] = currBlock[0]

	# At this point, each block exends from the start of its first and feature to the end of its last.
	# The problem is that there are lots of other features that do not participate in the block calculation, 
	# and they can (and often are) cut by the ends of the blocks.
	# Here we extend the ends of each block so that no feature is cut.
	self.extendBlocksToContigBoundaries()

	# At this point, any gaps between blocks are guaranteed to be "empty space". 
	# Extend neighboring blocks so they meet in the middle.
	#self.closeGaps()

    # Extends the boundaries of each synteny block to the edges of the end contigs.
    def extendBlocksToContigBoundaries(self):
	#
	def extendOne(which, x):
	    #
	    acs = self.getContigAt(which, x['chr'], x['start'])
	    if not acs:
	        raise RuntimeError("Hmmm...no contig found at start")
	    x['start'] = acs.start
	    #
	    ace = self.getContigAt(which, x['chr'], x['end'])
	    if not ace:
	        raise RuntimeError("Hmmm...no contig found at end")
	    x['end']   = ace.end
        #
	for blk in self.blocks:
	    blkid, blkori, blkcount, blkfields, blkids = blk
	    extendOne('a', blkfields['a'])
	    extendOne('b', blkfields['b'])

    def sortBlocksBy (self, which) :
	self.blocks.sort( cmp = lambda x,y : x[3][which]['index'] - y[3][which]['index'] )

    def closeGapsBy (self, which) :
	#
	self.sortBlocksBy(which)
	#
	pblk = None # previous block
	for cblk in self.blocks:
	    if pblk:
		cblkid, cblkori, cblkcount, cblkfields, cblkids = cblk
		pblkid, pblkori, pblkcount, pblkfields, pblkids = pblk
		if pblkfields[which]['chr'] != cblkfields[which]['chr']:
		    # starting new chromosome
		    pblk = None
		    continue
		# half the distance between previous and current
		delta = (cblkfields[which]['start'] - pblkfields[which]['end'] - 1) / 2.0
		if delta > 0:
		    pblkfields[which]['end'] += int(math.floor(delta))
		    cblkfields[which]['start'] -= int(math.ceil(delta))
	    #
	    pblk = cblk

    def closeGaps (self):
        self.closeGapsBy('b')
        self.closeGapsBy('a')

    def writePairs (self) :
        for p in self.pairs:
            a = p['a']
            b = p['b']
            r = [ a['index'], b['index'], a['ID'], a['chr'], a['start'], a['end'], a['strand'], b['ID'], b['chr'], b['start'], b['end'], b['strand'] ]
            sys.stdout.write('# ' + '\t'.join([ str(x) for x in r ]) + '\n')

    def writeBlocks(self):
        """
        Writes the blocks to stdout.
        """
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
def main () :
    sbg = SyntenyBlockGenerator()
    sbg.go()

#
main()
