#
# indexFeatures.py
#
# Performs one of three related functions, depending on the action (-a) parameter:
#
# 1. create- Creates an index of the features in specified file. The feature file is a tab-delimied 
# GFF-like (but simpler) file. See prepGenomeFile.py. The generated index is also a tsv file,
# and comprises a sequence of "index blocks".
# Each IndexBlock:
#   i. covers a contiguous region of a single chromosome (has a chr+start+end),
#   ii. wholly contains some number of features.
#   iii. points to a contiguous block of characters in the feature file (has start/end byte offsets)
#
# 2. validate- Validates the index against the feature file.
#    For each index block:
#       i. verifies that the file slice parses into the correct number of lines.
#       ii. verifies all the lines in the slice parse into features wholly contained within
#           the block's coordinate range
#    For each feature in the feaure file:
#       iii. verifies the feature is contained by exactly one block.
#
# 3. lookup- Returns the features in a given range, using the index.
#
# 

import sys
import re
import argparse
import json

class IndexBlock:
    MAXBLKSIZE = 5000000
    blockCount = 0
    def __init__(self, si, ei, c, start, end, count=1):
        # offsets into file spanning range of lines for these features
        self.fileStart = si    # position in file of first byte of first list
        self.fileEnd = ei      # position in file of last byte ("\n") of last line
        # 
        self.chr = c          # the chromosome
        self.start = start
        self.end = end
        self.count = count      # number of features in this block

    def size (self):
        return self.end - self.start + 1

    def extend(self, other):
        #
        if self.chr != other.chr:
            canExtend = False
        elif other.start <= self.end:
            canExtend = True
        elif other.start - self.start + 1 <= IndexBlock.MAXBLKSIZE:
            canExtend = True
        else:
            canExtend = False

        if not canExtend:
            return False

        #
        self.count += 1
        self.fileEnd = other.fileEnd # file position
        self.end = max(self.end, other.end)
        #
        return True

    def jsonObj (self) :
        return {
	    "id"	: "%s:%d..%d"%(self.chr, self.start, self.end),
	    "chr"	: self.chr,
	    "start"	: self.start,
	    "end"	: self.end,
	    "count"     : self.count
	}

    def tuple(self):
        return (self.fileStart,self.fileEnd,self.chr,self.start,self.end,self.count)

    def rowString(self):
        return '\t'.join([str(x) for x in self.tuple()])

    def __str__(self):
        return "index[%d,%d] coords[%s:%d-%d] count[%d]"%self.tuple()

# Builds an index file over a GFF file. (The GFF file MUST be sorted
# by chromosome + start position!) The index divides the GFF file into
# a sequence of "blocks". The coordinates of a block are from the start
# coordinate of its first feature to the end coordinate of its last.
# The index tries to make each block approx 5 MB in size. An important
# requirement is that every feature in a block must be wholly contained 
# within its boundaries. In other words, the end coord of the last
# feature in a block must the max end coord of any feature in that block.
# UPDATE: closes the gaps between blocks. These gaps contain no features,
# but we want those regions "covered" by blocks. In fact, what we really
# want (to put it more simply) is that the blocks partition the chromosome.
#
def buildIndex(fin, fout):
    allBlocks = []
    index = 0
    #
    currBlk = None
    for i,line in enumerate(fin):
        lineLen = len(line)
        index += lineLen
        if i == 0: continue # skip header line
        fields = line[:-1].split('\t')
        start = int(fields[1])
        blk = IndexBlock(index-lineLen, index-1, fields[0], int(fields[1]), int(fields[2]))
        if currBlk:
            if not currBlk.extend(blk):
		if currBlk.chr == blk.chr:
		    currBlk.end = blk.start - 1
                fout.write(currBlk.rowString()+'\n')
                currBlk = blk
        else:
            currBlk = blk
    if currBlk:
        fout.write(currBlk.rowString()+'\n')

#
def makeFeature (row, colnames) :
    f = {}
    for i,n in enumerate(colnames):
	f[n] = row[i]
	if n in ["start","end"]:
	    f[n] = int(f[n])
    return f

#
def iterFeatFile(ff) :
    colnames = ff.readline()[:-1].split("\t")
    for line in ff:
        toks = line[:-1].split("\t")
	r = makeFeature(toks, colnames)
	yield r

#
def readFeatFile(ff) :
    return list(iterFeatFile(ff))

#
def readIndexFile(xf) :
    ix = {} # chr -> list of Blocks
    for ixLine in xf:
        toks = ixLine[:-1].split('\t')
        s = int(toks[0])
        e = int(toks[1])
        c = toks[2]
        cs = int(toks[3])
        ce = int(toks[4])
        n = int(toks[5])
        blk = IndexBlock(s, e, c, cs, ce, n)
        # sanity check
        if blk.end != ce:
            raise RuntimeError("End coordinates disagree.")
        ix.setdefault(c,[]).append(blk)
    #
    return ix
#
def validate(ff, ix) :
    items = ix.items()
    items.sort()
    for (c,blocks) in items:
        for b in blocks:
            ff.seek(b.fileStart)
            x = ff.read(b.fileEnd-b.fileStart+1)
            lines = x[:-1].split('\n')
            if len(lines) != b.count:
                print "Crap",
            else:
                print ".",
    print

# Returns all features in all the index blocks touched by the 
# specified coordinate range. From caller's perspective, the requested
# range is effectively enlarged to the index block boundary ends,
# and all of those features are returned. The caller can filter the
# returned list for features in the requested range.
# Args:
#    ff (open file) the gff file 
#    ix (index) the index for ff (as returned by readIndexFile())
#    chr (string) chromosome
#    start (integer) start coordinate
#    end (integer) end coordinate. End must be >= start.
# Returns:
#    List of index blocks overlapped by the given range. Each block contains
#    all the features in that block that overlap the range. 
#    Each block is an object:
#	{ chr (string), start (int), end (int), features (list of features) }
#    
def lookup(ff, ix, chr, start, end):
    ff.seek(0)
    colnames = ff.readline()[:-1].split()
    # get all the index blocks for the given chromosome
    cblocks = ix.get(chr,None)
    if not cblocks:
        raise RuntimeError("No such chromosome: " + chr)
    # filter for blocks that overlap the start,end range.
    cblocks = filter(lambda b : b.start <= end and b.end >= start, cblocks)
    #
    # each block ...
    answer = []
    for b in cblocks:
	# read the features
        ff.seek(b.fileStart)
        s = ff.read(b.fileEnd-b.fileStart+1)
	feats = map(lambda l: l.split("\t"), s[:-1].split("\n"))
	feats = map(lambda f: makeFeature(f, colnames), feats)
	# add block to answer
	b2 = b.jsonObj()
	b2["features"] = feats
	#
	answer.append(b2)
    #
    return answer


# Returns features by id from a single genome. Ids may be MGP and/or MGI ids.
# Args:
#    ff (open file) the gff file of the genome
#    ids (list of strings) List of ids to look up.
# Returns:
#    list of [id, [matching features]]. These correspond 1:1 to the input ids.
#    
def idlookup(ff, ids):
    # make a set for fast lookup
    idset = set(ids)
    # 
    results = {}
    for f in iterFeatFile(ff):
        if f["id"] in idset:
	    results.setdefault(f["id"], []).append(f)
	if f["mgiid"] in idset:
	    results.setdefault(f["mgiid"], []).append(f)
    #
    answer = [(i,results.get(i,[])) for i in ids]
    return answer

# Performs a binary search on a list. Returns the the index of
# the first item in the list having the given value, or None if not found.
# Args:
#    val The value to search for.
#    lst The list to search. MUST be sorted on val! (Duh)
#    vf  Function to get the value from a lst item. If None,
#        (the default) the list items are the values
# Returns
#    Index of the first item in the list with the given value, or None
#    if no item has that value.
#
def bsearch(val, lst, vf=None):
    # if vf is None, use the identity function
    vf = vf if vf else lambda x:x
    # initialize search range
    iMin = 0
    iMax = len(lst) - 1
    found = False
    # go
    while iMin <= iMax and iMax < len(lst):
	# get value from middle item
        iMid = (iMin + iMax) / 2
        v = vf(lst[iMid])
        if val < v:
	    # look in first part of list
            iMax = iMid - 1
        elif val > v:
	    # look in second part of list
            iMin = iMid + 1
	else:
	    # Found one. Set the flag and continue searching the first part of the
	    # list in order to find the first occurrence.
	    found = True
	    iMax = iMid - 1
    # if found, then iMin is pointing at the first occurrence
    return iMin if found else None

#
def initArgParser ():
    """
    Sets up the parser for the command line args.
    """
    parser = argparse.ArgumentParser(description='Create/verify/use a feature index.')

    parser.add_argument(
        '-a',
        dest="action",
        choices=['create','validate','lookup','idlookup','none'],
        default='lookup',
        metavar='ACTION', 
        help='Action to perform. One of: create, validate, lookup. (Default=lookup.)')

    parser.add_argument(
        '-x',
        dest="indexFile",
        metavar='FILE', 
        help='Name of index file.')

    parser.add_argument(
        '-f',
        dest="featureFile",
        metavar='FILE', 
        help='Name of feature file.')

    parser.add_argument(
        '-p',
        dest="position",
        default=None,
        metavar='CHR:START..END', 
        help='For action=lookup, the coordinate range to use.')

    parser.add_argument(
        'ids',
	metavar='IDs',
	nargs='*',
	help='An ID')

    return parser

def main():
    parser = initArgParser()
    args = parser.parse_args()
    #
    ff = open(args.featureFile,'r') if args.featureFile else sys.stdin
    #
    if args.action == "lookup":
        if not args.position:
            raise RuntimeError("No coordinates specified.")
        coordRange_re = re.compile(r'([^:]+):(\d+)[^0-9]+(\d+)')
        m = coordRange_re.match(args.position)
        if not m:
            raise RuntimeError("Could not parse coordinates.")
        if not args.indexFile:
            raise RuntimeError("No index file specified.")
        xf = open(args.indexFile, 'r')
	ix = readIndexFile(xf)
        ans = lookup(ff, ix, m.group(1), int(m.group(2)), int(m.group(3)))
        print json.dumps(ans, indent=2)
    elif args.action == "idlookup":
        ans = idlookup(ff, args.ids)
	print json.dumps(ans, indent=2)
    elif args.action == "validate":
        print "Validating index..."
        if not args.indexFile:
            raise RuntimeError("No index file specified.")
        xf = open(args.indexFile, 'r')
	ix = readIndexFile(xf)
        validate(ff, ix)
    elif args.action == "create":
        print "Creating index..."
        xf = open(args.indexFile, 'w') if args.indexFile else sys.stdout
        buildIndex(ff, xf)
    elif args.action == "none":
        print args

#
if __name__ == "__main__":
    main()
