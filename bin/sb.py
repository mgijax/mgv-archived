import sys

TAB = '\t'
NL  = '\n'

#-------------------------------------------------------------------------
def log(msg):
    sys.stderr.write(msg)
    sys.stderr.write(NL)

#-------------------------------------------------------------------------
# A region is a contiguous stretch of a chromosome in a genome.
# Has: genome, chromosome, start, end and (optionally) strand.
class Region:
    def __init__(self, genome, chr, start, end, strand=None):
        self.genome = genome
	self.chr = chr
	self.start = int(start)
	self.end = int(end)
	if self.start > self.end:
	    raise RuntimeError("Illegal arguments: start > end. %s %s:%d..%d"% \
	        (self.genome.name, self.chr, self.start, self.end))
	self.strand = strand

    @property
    def length(self):
        return self.end - self.start + 1

    # Returns true iff the Region overlaps the other Region by at least 1 base.
    def overlaps(self, other):
        return self.genome == other.genome \
	    and self.chr == other.chr \
	    and self.start <= other.end \
	    and self.end >= other.start

    # Returns true iff the Region wholly contains the other Region.
    def contains(self, other):
        return self.genome == other.genome \
	    and self.chr == other.chr \
	    and self.start <= other.start \
	    and self.end >= other.end
# end class Region

#-------------------------------------------------------------------------
# A Feature is a Region that has an id and a canonical id.
#
# chromosome      start   end     strand  contig  lane    type    biotype id      mgiid   symbol
#
class Feature (Region):
    def __init__(self, genome, colNames, values):
	self.genome = genome
        for i,c in enumerate(colNames):
	    v = values[i]
	    if c in ['start','end','contig','lane']:
	        v = int(v)
	    setattr(self, c, v)

    def __str__(self):
        return '{ %s }' % ', '.join(['%s:%s' % (c, getattr(self, c)) for c in ['id','symbol','canonical','genome','chr','start','end','strand']])

    def __repr__(self):
        return str(self)
# end class Feature
    
#-------------------------------------------------------------------------
# A Block is a region defined by the outer limits of a contiguous sublist of one or more features
# from the genome's feature list. A block may be initialized with a single feature or another block.
# Features can be added to the block and long as they continue to form a contiguous sublist (ie you can 
# add negighboring features/blocks).
class Block (Region):
    def __init__(self, f, update=False):
	Region.__init__(self, f.genome, f.chr, f.start, f.end)
	self.index = -1	# index in my genome
	self.partners = set() # join partners in other genome
	#
	if isinstance(f, Feature):
	    self.fStart = f.index
	    self.nFeats = 1
	    if update: f.block = self
	elif isinstance(f, Block):
	    self.fStart = f.fStart
	    self.nFeats = f.nFeats
	    self.index = f.index
	    if update: self.stealPartners(f)
	else:
	    raise RuntimeError("Cannot create a Block from this object: " + str(f))

    def __str__(self):
        return 'Block(genome:%s, coords:%s:%d..%d, fStart:%d, no.feats:%d)' %  \
	    (self.genome.name, self.chr, self.start, self.end, self.fStart, self.nFeats)

    def __repr__ (self):
        return str(self)

    # Marks the features in this block. as belonging to this block.
    def markFeatures(self):
	for f in self.features():
	    setattr(f, 'block', self)

    def addFeature(self, f):
	#
	if f.chr != self.chr:
	    raise RuntimeError(
	      'Chromosomes do not agree: self:"%s" feature:"%s"' % (self.chr, f.chr))
	if f.index != self.fStart + self.nFeats:
	    raise RuntimeError('Cannot add feature out of sequence.')
	#
	self.nFeats += 1
	self.start  = min(self.start, f.start)
	self.end    = max(self.end, f.end)
	return self

    def getFeatureIndices(self):
        return range(self.fStart, self.fStart + self.nFeats)

    def getFeatures(self):
        return self.genome.feats[self.fStart:self.fStart+self.nFeats]

    def features (self):
        for i in range(self.fStart, self.fStart+self.nFeats):
	    yield self.genome.feats[i] 

    def hasNeighbor(self, other):
	if self.genome != other.genome \
        or self.chr != other.chr:
	    return None
	if self.fStart+self.nFeats == other.fStart:
	    return "+"
	if other.fStart+other.nFeats == self.fStart:
	    return "-"
	return None

    def stealPartners(self, other):
	for op in other.partners:
	    op.partners.remove(other)
	    op.partners.add(self)
	    self.partners.add(op)

    def merge(self, other, update=False):
	newBlk = self if update else Block(self)
	newBlk.fStart = min(self.fStart, other.fStart)
	newBlk.nFeats = self.nFeats + other.nFeats
	newBlk.start  = min(self.start, other.start)
	newBlk.end    = max(self.end, other.end)
	if update:
	    self.stealPartners(other)
	return newBlk

    def getCC(self):
        def _(b, i, cc):
	    if b in cc[i]: return
	    cc[i].add(b)
	    for p in b.partners:
	        _(p, 1-i, cc)
	    return cc

	return _(self, 0, (set(), set()))

# end class Block

#-------------------------------------------------------------------------
# A BlockCover is a list of Blocks that cover the genome. 
# Specifically:
# - blocks in a cover do not overlap
# - every feature is covered by exactly one block
# A BlockCover in one genome may be joined with a BlockCover in another.
#
class BlockCover:
    COUNT = 0
    def __init__(self, genome, blocks=None):
	self.id = 'BlockCover:%d' % BlockCover.COUNT
	BlockCover.COUNT += 1
	self.genome = genome
        self.blocks = [] if blocks is None else blocks
	self.joinedTo = None

    # Numbers the blocks 0..n.
    # Resets the index attribute in each block
    def renumber(self):
        for i,b in enumerate(self.blocks):
	    b.index = i

    # Raises an exception if this is not a valid block cover.
    def validate (self):
	n = 0
        for i,b in enumerate(self.blocks):
	    n += b.nFeats
	    if i == 0:
		# first block must start at 0
	        if b.fStart != 0: raise RuntimeError("Cover does not start at 0.")
	    else:
		# each successive block must start right after the previous
		bb = self.blocks[i-1]
	        if b.fStart != bb.fStart + bb.nFeats: raise RuntimeError("Invalid cover.")
	# Number of features in the cover must equal the number of features in the genome.
	if n != len(self.genome.feats):
	    raise RuntimeError("Incomplete cover.")
	#
	return self

    # Marks every feature with the block it belongs to in this cover.
    # Removes all previous marks for this cover.
    # Adds the mark to the feature as an attribute whose name is the cover identifier
    # and whose value is the block.
    def markFeatures(self):
        for b in self.blocks:
	    b.markFeatures(b)

    # Finds the block in this cover containing the given feature, or None
    # if no such block exists. (This should only happen if the feature is is not
    # from the same genome.)
    def findBlock(self, feature):
	return getattr(feature, self.id, None)

    # Returns a new Block that merges current blocks i through i+n-1.
    # Args:
    #	i (integer) index of starting feature. Must be >= 0 and < len(self.blocks)
    #   n (integer) number of features to merge. Must be >= 1 and <= (len(self.blocks) - i)
    def mergeRange(self, i, n):
	merged = Block(self.blocks[i], update=True)
	for j in range(1,n):
	    merged = merged.merge(self.blocks[i+j], update=True)
	    if merged is None: raise RuntimeError("Cannot merge this block.")
	return merged
        

    # Merges multiple contiguous range(s) of blocks; each specified range of blocks
    # is merged into a single block; all other blocks are unchanged. E.g.
    # 		cover.merge( [(2,3),(10,2)] ) 
    # would merge blocks 2,3,4 into one, and similarly for 10,11. All other blocks would
    # remain unchanged.
    #
    # Each range specifier is a tuple (i,n) indicating the index of the first block in the
    # range and the number of blocks to merge. Blocks i, i+1, ... i+n-1 will be merged.
    #
    def mergeRanges (self, ranges) :
	# sort ranges by start position
	ranges.sort(lambda a,b: a[0]-b[0])
	# make sure they're valid
	for i in range(len(ranges)-1):
	    if ranges[i][0] + ranges[i][1] > ranges[i+1][0]: 
	        raise RuntimeError("Overlapping ranges: %s" % str(ranges))
	# Take the current list of blocks in a series of slices, defined by the ranges.
	newbs = []
	i = 0
	for r in ranges:
	    # blocks between the last range and this are copied
	    newbs += self.blocks[i:r[0]] 
	    # blocks in the current range are merged
	    merged = self.mergeRange(r[0], r[1])
	    newbs.append(merged)
	    i = r[0] + r[1]
	    #
	    merged.markFeatures()
	#
	newbs += self.blocks[i:] # the end chunk
	# update self
	self.blocks = newbs
	self.renumber()

    # Joins the blocks in this block cover with those in other.
    # Two blocks join iff they contain features that join.
    # Two features join iff they have the same canonical id.
    # The result of the join is that each block is given the set
    # of its join partners from other side.
    def join(self, other):
	if self.joinedTo: self.unjoin()
	if other.joinedTo: other.unjoin()
	self.joinedTo = other
	other.joinedTo = self
	# initializes and indexes the list of blocks. Returns the index.
	def _(blocks):
	    index = {}
	    for b in blocks:
	        b.partners = set()
	        for f in b.features():
		    cid = f.canonical 
		    if cid and cid != '.':
			index.setdefault(cid,set()).add(b)
	    return index
	# create index on other cover's blocks
	oindex = _(other.blocks)
	# scan the blocks in this cover, doing an index lookup to join
	for b in self.blocks:
	    b.partners = set()
	    for f in b.features():
		oblks = oindex.get(f.canonical,[])
	        b.partners.update(oblks)
		for o in oblks:
		    o.partners.add(b)

    # 
    def unjoin(self):
        if not self.joinedTo:
	    return
	def _(x):
	    for b in x.blocks:
	       b.partners.clear()
	    x.joinedTo = None   
	_(self.joinedTo)
	_(self)

    # After joining with another BlockCover, there may be blocks left that did not join with
    # any partner. This step merges such blocks with their neighbors until only blocks having 
    # partners remain. (Another way to think of this: blocks that do have partners expand and
    # "swallow up" any unattached neighbors.)
    #
    def mergeUnattached(self):
	if not self.joinedTo:
	    raise RuntimeError("Invalid operation: BlockCover is not joined.")
	newbs = []
	cb = None
        for b in self.blocks:
	    # new blocks are all (and only) the one that have partners
	    if len(b.partners):
	        newbs.append(b)
	    #
	    if not cb:
		# no current block. start one with b.
	        cb = b
	    elif len(cb.partners):
		# current block exists and has partners
	        if len(b.partners):
		    # new block also has partners, can't merge
		    cb = b
		else:
		    # merge new block into current
		    cb = cb.merge(b, update=True)
	    else:
		# current block exists and has no partners.
		# only happens at the start of the list.
		cb = b.merge(cb, update=True)
	#
	self.blocks = newbs

    # Iterator that yields all connected components of blocks in this genome
    # and their partner blocks in the other.
    # Yields a sequence of tuples (aBlocks,bBlocks), each containing the A 
    # and B genome blocks (aBlocks and bBlocks, respectively) in the cc.
    def enumerateCCs(self):
	if not self.joinedTo:
	    raise RuntimeError("Invalid operation: BlockCover is not joined.")
	seen = set()
        for b in self.blocks:
	   if not b in seen:
	      cc = b.getCC()
	      seen.update(cc[0])
	      yield cc

    # Divides a sorted list of blocks into a series of runs. Each run
    # is a sub-list containing blocks that are sequential in the genome
    def findRuns(self, blocks):
        runs = []
	lastb = None
	for i,b in enumerate(blocks):
	    if lastb is None or not lastb.hasNeighbor(b):
		runs.append([i,1])
	    else:
	        runs[-1][1] += 1
	    lastb = b
	return runs

    # Looks for CCs that have multiple A blocks and/or multiple B blocks,
    # and tries to merge them. What we want is all cc's to have 1 of each.
    def collapseCCs(self):
	if not self.joinedTo:
	    raise RuntimeError("Invalid operation: BlockCover is not joined.")
	#
	def _(blocks, orders):
	    if len(blocks) < 2: return True
	    blocks = list(blocks)
	    blocks.sort(lambda x,y: x.fStart - y.fStart)
	    runs = self.findRuns(blocks)
	    merges = map(lambda r: [blocks[r[0]].index, r[1]], filter(lambda r: r[1]>1, runs))
	    orders += merges
	    return len(runs) == 1
	#
	self.renumber()
	self.joinedTo.renumber()
	mergeOrders = [ [], [] ]
	for cc in self.enumerateCCs():
	    aok = _(cc[0], mergeOrders[0])
	    bok = _(cc[1], mergeOrders[1])
	    if not aok or not bok:
	        log("Uncollapsible connected component.")
		log(str(cc))
	#
	self.mergeRanges ( mergeOrders[0] )
	self.joinedTo.mergeRanges( mergeOrders[1] )

# end class BlockCover

#-------------------------------------------------------------------------
# A SyntenyBlock is a pair of Blocks, one from genome A and one from genome B,
# deemed to be equivalent.
#
class SyntenyBlock:
    COUNT = 0
    def __init__(self, aBlock, bBlock):
	self.id = SyntenyBlock.COUNT
	SyntenyBlock.COUNT += 1
        self.a = Block(aBlock)
	self.b = Block(bBlock)
	self.count = 1

    def __str__(self):
        return '<%s, %s>' % (str(self.a), str(self.b))

    def __repr__(self):
        return str(self)

    def canExtend(self, aNew, bNew):
        return self.a.hasNeighbor(aNew) and self.b.hasNeighbor(bNew)

    def extend(self, aNew, bNew):
        self.a.merge(aNew, update=True)
        self.b.merge(bNew, update=True)
	self.count += 1

    def asRow(self, colNames=False, formatted=False):
	if colNames:
	    r = [
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
        else:
            r = [
		self.id,
		self.count,
		"+", #FIXME
		"%1.2f" % (float(self.a.length) / self.b.length),
		self.a.index,
		self.a.chr,
		self.a.start,
		self.a.end,
		self.a.length,
		self.b.index,
		self.b.chr,
		self.b.start,
		self.b.end,
		self.b.length
	    ]
	if formatted:
	    return TAB.join(map(lambda x: str(x), r))
	else:
	    return r
# end class SyntenyBlock

#-------------------------------------------------------------------------
# A Genome represents one actual genome, such as an inbred mouse strain.
# A Genome has a name and a list of features. The feature list is sorted by
# chromosome, than by start position. Features are also indexed by id and
# by canonical id.
#
class Genome:
    def __init__(self, name):
        self.name = name
	self.feats = None	# all the features sorted by chr,start
	self.id2feat = {}	# index by feature id
	self.cid2feats = {}	# index by canonical (eg MGI) id

    # Returns the feature having that id, or None if no such feature exists.
    def getFeatureById(self, id):
        return self.id2feat.get(id, None)

    # Returns a list of all features having the given canonical id.
    def getFeaturesByCanonicalId(self, cid):
        fs = self.cid2feats.get(cid, None)
	return [] if fs is None else fs[:]

    # Contigs have been precomputed and each feature tagged with its contig index
    # Build a block cover from this information.
    def buildContigCover(self):
	b = None
	c = None
	blocks = []
        for f in self.feats:
	    if f.contig != c:
	        b = Block(f)
		c = f.contig
		blocks.append(b)
	    else:
	        b.addFeature(f)
	return BlockCover(self, blocks)

    # Reads the features for this genome from the given file and stores them in self.feats.
    # Also builds indexes (1) from feature id to feature and (2) from canonical id to feature(s).
    # Also builds an initial set of Blocks from contigs (sequences of overlapping features).
    # Contigs have already been computed. 
    # Each feature is tagged with the id of the contig it belongs to.
    #
    # Columns in *-features.tsv files:
    # chromosome      start   end     strand  contig  lane    type    biotype id      mgiid   symbol
    #
    # Mapped to these names:
    # chr      start   end     strand  contig  lane    type    biotype id      canonical   symbol
    # 
    def	readFromFile(self, fname):
	self.feats = []
	fd = open(fname, 'r')
	colNames = fd.readline()[:-1].replace('chromosome','chr').replace('mgiid','canonical').split(TAB)
	count = 0
	for i,line in enumerate(fd):
	    r = line[:-1].split(TAB)
	    f = Feature(self, colNames, r)
	    f.index = count
	    count += 1
	    self.feats.append(f)
	    self.id2feat[f.id] = f
	    self.cid2feats.setdefault(f.canonical, []).append(f)
	self.contigs = self.buildContigCover()
	return self;
# end class Genome

#-------------------------------------------------------------------------
# Iterator that yields SyntenyBlocks for the two genomes, a and b
# Args:
#    a (Genome object) - assumes a has been initialized and an initial
#		contig cover has been created.
#    b (Genome object) - same assumption for b
# Yields:
#    SyntenyBlock objects in genome A order.
#
def generate(a, b):
	# join blocks in genome a to blocks in genome b (based on features
	# with shared canonical ids).
	a.contigs.join(b.contigs)
	# merge any block without a partner into its neighbors
	a.contigs.mergeUnattached()
	b.contigs.mergeUnattached()
	# for each connected component (cc) where the number of A blocks or
	# the number of B blocks is > 1, try to merge them into 1 block.
	# (Want every cc to be 1:1)
	a.contigs.collapseCCs()
	# sanity check: make sure covers are still valid
	a.contigs.validate()
	b.contigs.validate()
	#
	for cc in a.contigs.enumerateCCs():
	    if len(cc[0]) > 1 or len(cc[1]) > 1:
	        log("UNCOLLAPSED:" + str(cc)) 
	#
	# OK, here we go...
	csb = None # current synteny block
	for aBlk in a.contigs.blocks:
	    bBlk = list(aBlk.partners)[0] #FIXME
	    if csb and csb.canExtend(aBlk, bBlk):
	        csb.extend(aBlk, bBlk)
	    else:
	        if csb: yield csb
		csb = SyntenyBlock(aBlk, bBlk)
	#
	if csb: 
	    yield csb

# Iterator that yields SyntenyBlocks for two genomes.
# Args:
#    aName (string) Name of genome A, e.g. "A/J"
#    aFile (string) Path to file of genome A features
#    bName (string) Name of genome B, e.g. "AKR/J"
#    bFile (string) Path to file of genome B features
#    
def generateFromFiles(aName, aFile, bName, bFile):
    global a
    global b
    a = Genome(aName).readFromFile(aFile)
    b = Genome(bName).readFromFile(bFile)
    for sblock in generate(a, b):
        yield sblock

#-------------------------------------------------------------------------
if __name__ == "__main__":
    global sbg
    aName = "A/J"
    aFile = "../data/genomedata/mus_musculus_aj-features.tsv"
    bName = "AKR/J"
    bFile = "../data/genomedata/mus_musculus_akrj-features.tsv"
    sbg = generateFromFiles(aName, aFile, bName, bFile)
    for i,sb in enumerate(sbg):
        if i == 0:
	    sys.stdout.write( sb.asRow(colNames=True, formatted=True) + NL )
	sys.stdout.write( sb.asRow(formatted=True) + NL )


