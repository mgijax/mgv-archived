#
# indexFeatures.py
#
# Performs one of three related functions, depending on the action (-a) parameter:
#
# 1. create- Creates an index of the features in specified file. The feature file is a tab-delimied 
# GFF-like (but simpler) file. See prepGenomeFile.py. The generated index is also a tsv file,
# and comprises a sequence of "blocks" where each block:
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
import gff3

class Block:
    MAXBLKSIZE = 5000000
    blockCount = 0
    def __init__(self, si, ei, c, start, end, count=1):
        # offsets into file spanning range of lines for these features
        self.startIndex = si    # position in file of first byte of first list
        self.endIndex = ei      # position in file of last byte ("\n") of last line
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
        elif other.start - self.start + 1 <= Block.MAXBLKSIZE:
            canExtend = True
        else:
            canExtend = False

        if not canExtend:
            return False

        #
        self.count += 1
        self.endIndex = other.endIndex # file position
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
        return (self.startIndex,self.endIndex,self.chr,self.start,self.end,self.count)

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
# UPDATE: close the gaps between blocks. These gaps contain no features,
# but we want those regions "covered" by blocks. In fact, what we really
# want (to put it more simply) is that the index partitions the chromosome.
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
	f = gff3.Feature(line[:-1])
        blk = Block(index-lineLen, index-1, f.seqid, f.start, f.end)
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

# Validates an index against a feature file.
def validate(ff, ix) :
    items = ix.items()
    items.sort()
    for (c,blocks) in items:
        for b in blocks:
            ff.seek(b.startIndex)
            x = ff.read(b.endIndex-b.startIndex+1)
            lines = x[:-1].split('\n')
            if len(lines) != b.count:
                print "Crap",
            else:
                print ".",
    print

#
def makeFeature (row, colnames) :
    f = {}
    for i,n in enumerate(colnames):
	f[n] = row[i]
	if n in ["start","end"]:
	    f[n] = int(f[n])
    return f

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
        blk = Block(s, e, c, cs, ce, n)
        # sanity check
        if blk.end != ce:
            raise RuntimeError("End coordinates disagree.")
        ix.setdefault(c,[]).append(blk)
    #
    return ix

def makeJsonFeat(f):
    mgiid = f.attributes.get("geneId",None)
    if mgiid and not mgiid.startswith("MGI:"): mgiid = None
    symbol = f.attributes.get("geneLabel",None)
    return {
	"id"         : f.ID,
	"mgiid"      : mgiid,
	"symbol"     : symbol,
	"chromosome" : f.seqid,
	"start"      : f.start,
	"end"        : f.end,
	"strand"     : f.strand,
	"type"       : f.type,
	"biotype"    : f.attributes.get("biotype","")
    }

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
    # get all the index blocks for the given chromosome
    cblocks = ix.get(chr,None)
    if not cblocks:
        raise RuntimeError("No such chromosome: " + chr)
    # filter for blocks that overlap the start,end range.
    cblocks = filter(lambda b : b.start <= end and b.end >= start, cblocks)
    #
    # each remaining block ...
    answer = []
    for b in cblocks:
	# read the features
        ff.seek(b.startIndex)
        s = ff.read(b.endIndex-b.startIndex+1)
	feats = map(lambda l: makeJsonFeat(gff3.Feature(l)), s[:-1].split("\n"))
	# add block to answer
	b2 = b.jsonObj()
	b2["features"] = feats
	#
	answer.append(b2)
    #
    return answer

# Returns features by MGI id.
# Args:
#    ff (open file) the gff file 
#    ids (list of strings) one or more ids to lookup
# Returns:
#    list of [id, feature] pairs. The elements of the returned list map 1:1
#    with the elements in the ids input. If an id was not found, the feature 
#    is null. Duplicate ids (or aliases) will returns the same feature multiple times.
#    
def idlookup(ff, ids):
    # read all the features
    feats = readFeatFile(ff)
    # build an id index
    fix = {}
    for f in feats:
       fix.setdefault(f["mgiid"], []).append(f)
    # lookup each id
    answer = []
    for i in ids:
        answer.append((i, fix.get(i,[])))
    #
    return answer

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
