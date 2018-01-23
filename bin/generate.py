#
# g2.py
#
import argparse
import sys
import gff3
import math
import itertools

class SyntenyBlockGenerator:

    #
    def __init__ (self):
        """
        Initializes the SyntenyBlockGenerator instance.
        """
        #
        self.A = []   # list of gff3.Features
	self.id2a = {}
	self.mgi2a = {}
	#
        self.B = []   # list of gff3.Features
	self.id2b = {}
	self.mgi2b = {}
	#
	self.AB = []
	#
	self.parseArgs()

    #
    def go (self):
        """
        The generator's main program. Reads the inputs, does the computation,
        and writes the synteny blocks to the output.
        """
        self.readFiles()
        self.join()
	return
        self.generateBlocks()
        self.writeBlocks()
    #
    def parseArgs (self) :
        """
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

        self.args = self.parser.parse_args()

    # 
    def indexBy(self, feats, attr):
	ix = {}
        for f in feats:
	    v = f.attributes.get(attr, None)
	    ix.setdefault(v,[]).append(f)
	return ix

    #
    def readFiles (self) :
        """
        Loads the 2 GFF3 files and the AB file (if specified).
        If no AB specified, generates AB so that features with same ID correspond.
        """
	#
        self.A = self.readFeatureFile(self.args.fileA)
	self.id2a = self.indexBy(self.A, "ID") 
	self.mgi2a= self.indexBy(self.A, "geneId")
	self.ctgsByChrA = self.computeContigs(self.A)
	#
        self.B = self.readFeatureFile(self.args.fileB)
	self.id2b = self.indexBy(self.B, "ID") 
	self.mgi2b= self.indexBy(self.B, "geneId")
	self.ctgsByChrB = self.computeContigs(self.B)

    # Comparator functions for sorting features by chr + start pos.
    def cmpFeatures(self, a, b):
        if a[0] < b[0]:    # compare seqids
	    return -1
	elif a[0] > b[0]:
	    return 1
	elif a[3] < b[3]:  # compare start coordinates
	    return -1
	elif a[3] > b[3]:
	    return 1
	else:
	    return 0;
	
    #
    def readFeatureFile (self, fname) :
        """
        Reads a gff3 file of features.
	Sorts them by chr+start
	Numbers the features.
	Returns the list.
        """
	feats = [f for f in gff3.iterate(fname)]
	feats.sort(self.cmpFeatures)
	for i,f in enumerate(feats):
	    f.attributes["index"] = i
        return feats

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
	
    # Helper class for the join() method
    #
    class ABJoinRec:
	#
	def __init__(self, a, b):
	    self.a = a
	    self.aIndex = 0
	    self.b = b
	    self.bIndex = 0
	#
	def __getitem__(self, n):
	    return self.__dict__[n]
	#
	def __setitem__(self, n, v):
	    self.__dict__[n] = v
	#
	def __str__(self):
	    return "%d %s %d %s" % (self.aIndex, self.a.ID, self.bIndex, self.b.ID)

    # Helper class allowing us to cover a list with "block" and be able to repeatedly split that block
    class SBlock:
	#
        def __init__(self, recs):
	    # the whole list
	    self.recs = recs
	    # my slice coodinates into the list
	    self.start = 0
	    self.end = len(recs)
	    #
	    self.next = None
	    self.prev = None
	    #
	    self.dup = False

	def __getitem__(self, i):
	    return self.recs[self.start + i]

	# length of my slice
	def __len__(self):
	    return self.end - self.start

	# return my slice
	def getRecs(self):
	    return self.recs[ self.start : self.end ]

	# Splits this block at the specified position and returns the new block.
	# Position is relative to this block, i.e, the valid split positions are 
	# between 0 and the length of the block (non-inclusive).
	# Any value outside this range has no effect and returns None.
	# Args:
	#    pos (integer) split position, >0 and <len(self)
	# Returns:
	#    The new SBlock, which is the tail segment of the split. Self is truncated at the split point.
	#    If the specified split position is outside the valid range, returns None, and self is unchanged.
	# Side effects:
	#    Links are maintained between split neighbors, so that all the blocks together form a 
	#    doubly-linked list,
	def split(self, pos):
	    if pos <= 0 or pos >= len(self):
	        return None
	    #
	    gpos = pos + self.start
	    other = self.__class__(self.recs)
	    #
	    other.start = gpos
	    other.end = self.end
	    self.end = gpos
	    #
	    other.prev = self
	    other.next = self.next
	    self.next = other
	    #
	    return other

	# Similar to split() with two big diffs:
	# 1. Takes a global position (i.e., relative to whole list)
	# 2. Traverses next/prev links as needed to find the block containing
	# the position before doing the split.
	# 
	def splitG(self, gpos):
	    # traverse left or right till we find the block or run out of room
	    bb = self
	    if gpos < bb.start:
		while bb and gpos < bb.start: bb = bb.prev
	    elif gpos > bb.end:
		while bb and gpos > bb.end: bb = bb.next
	
	    if bb:
		# found it. Do a local split
		return bb.split( gpos - bb.start )
	    else:
		# nada
	        return None

    #
    def pj(self, n=1000):
	pr = None
	da = 0
	db = 0
        for i in range(n):
	    cr = self.AB[i]
	    if pr:
	        da = cr.aIndex - pr.aIndex
	        db = cr.bIndex - pr.bIndex
	    print da, db, self.AB[i]
	    pr = cr
        
    #
    def join (self) :
        """
        Joins the features in A to their corresponding features in B, based on shared geneId.
        """
	# where the results go. Each element it an AJJoinRec
	self.AB = []

	# Join
        for a in self.A:
	    mgi = a.attributes.get("geneId", None)
	    bs = self.mgi2b.get(mgi, [])
	    for b in self.mgi2b.get(mgi,[]):
	        r = self.ABJoinRec(a, b)
		self.AB.append(r)
	#
	def sortAndNumber(which):
	    # Sort by B, and number
	    self.AB.sort( lambda r1, r2: r1[which].attributes['index'] - r2[which].attributes['index'] )
	    i = 0
	    pr = None
	    for r in self.AB:
		# increment for each new feature
		if not pr or pr[which] != r[which]:
		    i += 1
		# extra increment at chromosome boundaries
		if pr and pr[which].seqid != r[which].seqid:
		    i += 10000
		# 
		r[which+'Index'] = i
		pr = r

	# Sort and number each side (A and B). Do B first, because we want to end up with
	# things sorted on the A side.
	sortAndNumber('b')
	sortAndNumber('a')

	# Create a block to cover the lot,
	# then start splitting.
	self.root = self.SBlock(self.AB)

	# Split on A-side chromosome boundaries
	cblock = self.root # current block
	pr = None     # previous block
	di = 1	      # index delta
	for j,cr in enumerate(self.AB):
	    if pr:
	        di = cr.aIndex - pr.aIndex
	    if di > 1:
	        cblock = cblock.splitG(j)
	    pr = cr
	
	# Split on A-side repeats
	cb = self.root
	while cb:
	    dupBlk = None
	    cb.dup = False
	    count = 0
	    for x,g in itertools.groupby(cb.getRecs(), lambda x:x.aIndex):
	        g = list(g)
		if len(g) > 1:
		    #dup detected
		    if not dupBlk:
		        # start of dup block. split
		        if count == 0:
		            dupBlk = cb
			else:
			    dupBlk = cb.split(count)
			    count = 0
			dupBlk.dup = True
		else:
		    #non-dup
		    if dupBlk:
		        # end of dup block. split
		        cb = dupBlk.split(count)
			count = 0
		        dupBlk = None
		count += len(g)
	    # end for
	    cb = cb.next
	# end while

	# Split on B-side sequence runs
	cb = self.root # current block
	while cb:
	    # loop through the recs in the current block, 
	    # splitting on every seq run boundary
	    pr = None 
	    di = 0
            for r in cb.getRecs():
		if pr: di =  r.bIndex - pr.bIndex
	        pr = r
	    cb = cb.next
	

    '''
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
    '''

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
    global sbg
    sbg = SyntenyBlockGenerator()
    sbg.go()

#
main()
