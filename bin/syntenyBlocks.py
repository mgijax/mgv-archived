#
# syntenyBlocks.py
#
# Infers synteny blocks among a set of annotated genomes.
#
# Infers synteny blocks for a pair of genomes based on 
# 1. gene annotations in each genome
# 2. an assertion of 'equivalence' between individual features
# 
import sys
import os
import argparse
import json

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
    def __init__(self, genome, gffobj):
	self.genome = genome
	self.chr        = gffobj[0]
	self.start      = gffobj[3]
	self.end        = gffobj[4]
	self.strand     = gffobj[6]
	self.type       = gffobj[2]
	self.biotype    = gffobj[8]['biotype']
	self.id         = gffobj[8]['ID']
	self.canonical  = gffobj[8].get('canonical_id',None)
	self.symbol     = gffobj[8].get('canonical_symbol',None)

    def __str__(self):
        return '{ %s }' % ', '.join(
	    ['%s:%s' % (c, getattr(self, c)) for c in 
	        ['id','symbol','canonical','genome','chr','start','end','strand']])

    def __repr__(self):
        return str(self)
# end class Feature
    
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
	blocks = []
        hwm = 0
	cchr = None
        for f in self.feats:
	    if cchr and cchr != f.chr:
	        hwm = 0
	    if hwm < f.start:
	        b = Block(f)
		blocks.append(b)
	    else:
	        b.addFeature(f)
	    cchr = f.chr
	    hwm = max(hwm, f.end)
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
    def readFromFile(self, fname):
	fd = open(fname, 'r')
	self.feats = [ Feature(self, f) for f in json.load(fd) ]
	fd.close()
	for count, f in enumerate(self.feats):
	    f.index = count
	    self.id2feat[f.id] = f
	    self.cid2feats.setdefault(f.canonical, []).append(f)
	self.contigs = self.buildContigCover()
	return self;

    def	xreadFromFile(self, fname):
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
# A Block is a region defined by the outer limits of a contiguous sublist of one or more features
# from the genome's feature list. A block may be initialized with a single feature or another block.
# Features can be added to the block and long as they continue to form a contiguous sublist (ie you can 
# add negighboring features/blocks).
class Block (Region):
    def __init__(self, f, update=False):
	try:
	    Region.__init__(self, f.genome, f.chr, f.start, f.end)
	except:
	    print f
	    raise
	self.index = -1	# index in my genome
	self.partners = set() # join partners in other genome
	self.pOri = ""        # orientation of self/partners, "+", "-", or "" (unset)
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

    # Adds a feature to the block. Features must form contiguous blocks (ie, you have to add
    # features at the ends).
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

    # Returns the list of feature indices in this block.
    def getFeatureIndices(self):
        return range(self.fStart, self.fStart + self.nFeats)

    # Returns the list of features in this block
    def getFeatures(self):
        return self.genome.feats[self.fStart:self.fStart+self.nFeats]

    # Iterator that yields the features in this block
    def features (self):
        for i in range(self.fStart, self.fStart+self.nFeats):
	    yield self.genome.feats[i] 

    # 
    def hasNeighbor(self, other):
	if self.genome != other.genome \
        or self.chr != other.chr:
	    return None
	if self.fStart+self.nFeats == other.fStart:
	    return "+"
	if other.fStart+other.nFeats == self.fStart:
	    return "-"
	return None

    # Helper function for merge(). Takes other's partners and makes them partners of self.
    def stealPartners(self, other):
	for op in other.partners:
	    op.partners.remove(other)
	    op.partners.add(self)
	    self.partners.add(op)

    # Merges this block with other. If update is False, returns a new Block.
    # If update is True, merges other into self.
    def merge(self, other, update=False):
	# quich sanity check
	if self.chr != other.chr:
	    raise RuntimeError("Cannot merge these blocks:\n\t%s\n\t%s"%(str(self), str(other)))
	newBlk = self if update else Block(self)
	newBlk.fStart = min(self.fStart, other.fStart)
	newBlk.nFeats = self.nFeats + other.nFeats
	newBlk.start  = min(self.start, other.start)
	newBlk.end    = max(self.end, other.end)
	if update:
	    self.stealPartners(other)
	return newBlk

    # Returns the connected component of partner blocks containing this block.
    # This is a cc in a bipartite graph, so the it is represented as two sets
    # of Blocks.
    def getCC(self):
        def _(b, i, cc):
	    if b in cc[i]: return
	    cc[i].add(b)
	    for p in b.partners:
	        _(p, 1-i, cc)
	    return cc
	cc = _(self, 0, (set(), set()))
	skey = lambda x: x.fStart
	cc = (sorted(cc[0],key=skey), sorted(cc[1], key=skey))
	edges = [ [i, cc[1].index(b)] for i,a in enumerate(cc[0]) for b in a.partners ]
	return (cc[0], cc[1], edges)

# end class Block

#-------------------------------------------------------------------------
# A BlockCover is a list of Blocks that cover the genome. 
# Specifically:
# - blocks in a cover do not overlap
# - every feature is covered by exactly one block
#
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

    # Extends the start/end coordinates blocks in a cover so neighbors meet in the middle.
    # The first block on a chromosome is extended to 0. The last block on a chromosome is NOT extended.
    def gapFill (self) :
	prev = None
        for b in self.blocks:
	    if prev is None or prev.chr != b.chr:
		b.start = 0
	        prev = b
		continue
	    delta = b.start - prev.end - 1
	    prev.end += delta / 2
	    b.start = prev.end + 1
	    prev = b

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
	        if b.fStart != bb.fStart + bb.nFeats: raise RuntimeError("Invalid cover. [%s][%s]"%(str(bb),str(b)))
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
    # "swallow up" any unattached neighbors.) Note that merging only happens between blocks on
    # the same chromosome.
    #
    def mergeUnattached(self):
	if not self.joinedTo:
	    raise RuntimeError("Invalid operation: BlockCover is not joined.")
	newbs = [] # new blocks
	cb = None  # current block
	cchr = None# current chromosome
        for b in self.blocks:
	    if b.chr != cchr:
		# changed chromosomes (or very first block). start new cb.
		cchr = b.chr
	        newbs.append(b)
		cb = b
	    elif len(cb.partners) and len(b.partners):
		# same chromosome, but they both have partners. cannot merge.
		newbs.append(b)
		cb = b
	    else:
		# same chromosome, and at least one has no partners, merge.
		cb = cb.merge(b, update=True)
	#
	self.blocks = newbs

    # Iterator that yields all connected components, ie, blocks in this genome
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
	        #log("Uncollapsible connected component.")
		#log(str(cc))
		pass
	#
	self.mergeRanges ( mergeOrders[0] )
	self.joinedTo.mergeRanges( mergeOrders[1] )


# end class BlockCover

#-------------------------------------------------------------------------
# A SyntenyBloc comprises two lists of Blocks, one from genome A and one from genome B,
# deemed to be equivalent. Hopefully, each list contains exactly 1 Block (ie, the bloc is 1:1),
# but we must allow for the general case 1:n, n:1, and even n:m.
#
class SyntenyBloc:
    COUNT = 0
    def __init__(self, cc, aGenome, bGenome):
	self.id = SyntenyBloc.COUNT
	SyntenyBloc.COUNT += 1
	self.aGenome = aGenome
	self.bGenome = bGenome
        self.a = [ Block(x) for x in cc[0] ]
	self.b = [ Block(x) for x in cc[1] ]
	self.edges = cc[2]
	self.count = 1
	self.ori = self.getOrientation()

    def __str__(self):
        return '<%s, %s>' % (str(self.a), str(self.b))

    def __repr__(self):
        return str(self)

    def getOrientation(self):
        if not(len(self.a) == len(self.b) == 1):
	    return '?'
	for af in self.a[0].getFeatures():
	    if not af.canonical or af.canonical == '.':
	        continue
	    for bf in self.b[0].getFeatures():
	        if af.canonical == bf.canonical:
		    return '+' if af.strand == bf.strand else '-'
	raise RuntimeError("Cannot get orientation. Blocks do not join.")

    def canExtend(self, cc):
	if not (len(self.a) == 1 and len(self.b) == 1 and len(cc[0]) == 1 and len(cc[1]) == 1):
	    return False
        if not (self.a[0].hasNeighbor(cc[0][0])=='+' and self.b[0].hasNeighbor(cc[1][0])==self.ori):
	    return False
	return True

    def extend(self, cc):
        self.a[0].merge(cc[0][0], update=True)
        self.b[0].merge(cc[1][0], update=True)
	# should be no need to update edges since there's still only 1
	self.count += 1
    #
    COLNAMES = [
	      "aGenome",
	      "bGenome",
	      "blockId",
	      "blockOri",
	      "aIndex",
	      "aChr",
	      "aStart",
	      "aEnd",
	      "bIndex",
	      "bChr",
	      "bStart",
	      "bEnd",
	    ]
    #
    def getRows(self):
	rows = []
	for i,e in enumerate(self.edges):
	    aa = self.a[e[0]]
	    bb = self.b[e[1]]
            r = [
		self.aGenome.name,
		self.bGenome.name,
		"%s_%d" % (self.id, i),
		self.ori,
		aa.index,
		aa.chr,
		aa.start,
		aa.end,
		bb.index,
		bb.chr,
		bb.start,
		bb.end,
	    ]
	    rows.append( r )
	return rows

#-------------------------------------------------------------------------
# Iterator that yields SyntenyBlocs for the two genomes, a and b
# Args:
#    a (Genome object) - assumes a has been initialized and an initial
#		contig cover has been created.
#    b (Genome object) - same assumption for b
# Yields:
#    SyntenyBloc objects in genome A order.
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
	# CCs that cannot be turned into 1:1 are reported
	a.contigs.collapseCCs()
	# fill empty spaces between blocks in each cover
	a.contigs.gapFill()
	b.contigs.gapFill()
	# sanity check: make sure covers are still valid
	a.contigs.validate()
	b.contigs.validate()
	#
	csb = None # current synteny block
	for cc in a.contigs.enumerateCCs():
	    if len(cc[0]) > 1 or len(cc[1]) > 1:
	        #log("UNCOLLAPSED:" + str(cc)) 
		pass
	    if csb and csb.canExtend(cc):
	        csb.extend(cc)
	    else:
	        if csb: yield csb
		csb = SyntenyBloc(cc, a, b)
	if csb:
	    yield csb

# Iterator that yields SyntenyBloc for two genomes.
# Args:
#    aName (string) Name of genome A, e.g. "A/J"
#    aFile (string) Path to file of genome A features
#    bName (string) Name of genome B, e.g. "AKR/J"
#    bFile (string) Path to file of genome B features
# Yields:
#    stream of SyntenyBlocs
#    
def _generateFromFiles(aName, aFile, bName, bFile):
    global a
    global b
    SyntenyBloc.COUNT = 0
    BlockCover.COUNT  = 0
    a = Genome(aName).readFromFile(aFile)
    b = Genome(bName).readFromFile(bFile)
    for sbloc in generate(a, b):
        for r in sbloc.getRows():
	    yield r

def generateFromFiles(aName, aFile, bName, bFile, noHeader):
    allRows = list(_generateFromFiles(aName, aFile, bName, bFile))
    def _(ci):
	allRows.sort(lambda x,y: x[ci]-y[ci])
	i = -1
	prev = None
	for r in allRows:
	    if r[ci] != prev:
	        i += 1
	    prev = r[ci]
	    r[ci] = i
    _(8) # sort on bIndex and renumber
    _(4)  # sort on aIndex and renumber
    if not noHeader:
	sys.stdout.write( format(SyntenyBloc.COLNAMES) + NL )
    for r in allRows:
	sys.stdout.write( format(r) + NL )

#
def format(lst):
    return TAB.join(map(lambda x: str(x), lst))

#
def getArgs ():
    parser = argparse.ArgumentParser(description='Generate synteny blocks.')

    parser.add_argument(
	'-d',
	'--directory',
	dest="odir",
	required=True,
	metavar='PATH', 
	help='Directory containing the feature files.')
    return parser.parse_args()

#-------------------------------------------------------------------------
if __name__ == "__main__":
    global sbg
    args = getArgs()
    genomes = []
    for n in os.listdir(args.odir):
	if os.path.isdir(os.path.join(args.odir, n)):
	    genomes.append(n)
    genomes.sort()
    for i, gn1 in enumerate(genomes):
	aname = gn1
	afile = os.path.join(args.odir, gn1, 'features.json')
        for j, gn2 in enumerate(genomes[i:]):
	    bname = gn2
	    bfile = os.path.join(args.odir, gn2, 'features.json')
	    sys.stderr.write('%d %s vs %d %s\n' % (i, aname, i+j, bname))
	    generateFromFiles(aname, afile, bname, bfile, i or j)
###
