#
# indexFeatures.py
#
# Performs one of three related functions, depending on the action (-a) parameter:
#
# 1. create- Creates an index of the features in specified file. The feature file is a tab-delimied 
# GFF-like (but simpler) file. See prepStrainFile.py. The generated index is also a tsv file,
# and comprises a sequence of "blocks" where each block:
#   i. covers a contiguous region of a single chromosome (has a chrom+start+end),
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

class Block:
    MAXBLKSIZE = 5000000
    blockCount = 0
    def __init__(self, si, ei, c, start, end):
        # offsets into file spanning range of lines for these features
        self.startIndex = si    # position in file of first byte of first list
        self.endIndex = ei      # position in file of last byte ("\n") of last line
        # 
        self.chrom = c          # the chromosome
        self.start = start
        self.end = end
        self.count = 1          # number of features in this block

    def size (self):
        return self.end - self.start + 1

    def extend(self, other):
        #
        if self.chrom != other.chrom:
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

    def tuple(self):
        return (self.startIndex,self.endIndex,self.chrom,self.start,self.end,self.count)

    def rowString(self):
        return '\t'.join([str(x) for x in self.tuple()])

    def __str__(self):
        return "index[%d,%d] coords[%s:%d-%d] count[%d]"%self.tuple()

#
def buildIndex(fin, fout):
    allBlocks = []
    currBlk = None
    index = 0
    #
    for i,line in enumerate(fin):
        lineLen = len(line)
        index += lineLen
        if i == 0: continue
        fields = line[:-1].split('\t')
        start = int(fields[1])
        blk = Block(index-lineLen, index-1, fields[0], int(fields[1]), int(fields[2]))
        if currBlk:
            if not currBlk.extend(blk):
                fout.write(currBlk.rowString()+'\n')
                currBlk = blk
        else:
            currBlk = blk
    if currBlk:
        fout.write(currBlk.rowString()+'\n')

#
def readIndexFile(xf) :
    ix = {}
    for ixLine in xf:
        toks = ixLine[:-1].split('\t')
        s = int(toks[0])
        e = int(toks[1])
        c = toks[2]
        cs = int(toks[3])
        ce = int(toks[4])
        n = int(toks[5])
        blk = Block(s, e, c, cs, ce)
        blk.count = n
        # sanity check
        if blk.end != ce:
            raise RuntimeError("End coordinates disagree.")
        ix.setdefault(c,[]).append(blk)
    #
    return ix
#
def validate(ff, xf) :
    ix = readIndexFile(xf)
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

def lookup(ff, xf, chr, start, end):
    #print "LOOKING UP:", chr, start, end
    answer = []
    ix = readIndexFile(xf)
    cblocks = ix.get(chr,None)
    if not cblocks:
        raise RuntimeError("No such chromosome: " + chr)
    #print "cblocks", map(str, cblocks)
    #
    for i,b in enumerate(cblocks):
        #print "CHECKING", str(b), start
        if start <= b.end and end >= b.start:
            #print "FOUND IT", i, str(b)
            break
    else:
        return []

    #print "HERE"
    #
    while i < len(cblocks):
        b = cblocks[i]
        ff.seek(b.startIndex)
        s = ff.read(b.endIndex-b.startIndex+1)
        #print s
        lines = s[:-1].split('\n')
        for l in lines:
            toks = l.split('\t')
            ls = int(toks[1])
            le = int(toks[2])
            if le >= start and ls <= end:
                answer.append(toks)
            elif ls > end:
                return answer
        i += 1
    return answer


#
def bsearch(val, lst, vf=None):
    vf = vf if vf else lambda x:x
    iMin = 0
    iMax = len(lst) - 1
    while iMin <= iMax and iMax < len(lst):
        iMid = (iMin + iMax) / 2
        v = vf(lst[iMid])
        if val <= v:
            iMax = iMid - 1
        elif val > v:
            iMin = iMid + 1
    #
    if iMin < len(lst) and vf(lst[iMin]) == val:
        return iMin
    #
    return None

#
def initArgParser ():
    """
    Sets up the parser for the command line args.
    """
    parser = argparse.ArgumentParser(description='Create/verify/use a feature index.')
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
        '-a',
        dest="action",
        choices=['create','validate','lookup','none'],
        default='lookup',
        metavar='ACTION', 
        help='Action to perform. One of: create, validate, lookup. (Default=lookup.)')

    parser.add_argument(
        '-p',
        dest="position",
        default=None,
        metavar='CHR:START..END', 
        help='For action=lookup, the coordinate range to use.')

    return parser

def main():
    parser = initArgParser()
    args = parser.parse_args()
    #
    ff = open(args.featureFile,'r') if args.featureFile else sys.stdin
    #
    if args.action == "lookup":
        print "Lookup"
        if not args.position:
            raise RuntimeError("No coordinates specified.")
        coordRange_re = re.compile(r'([^:]+):(\d+)[^0-9]+(\d+)')
        m = coordRange_re.match(args.position)
        if not m:
            raise RuntimeError("Could not parse coordinates.")
        if not args.indexFile:
            raise RuntimeError("No index file specified.")
        xf = open(args.indexFile, 'r')
        ans = lookup(ff, xf, m.group(1), int(m.group(2)), int(m.group(3)))
        print ans
    elif args.action == "validate":
        print "Validating index..."
        if not args.indexFile:
            raise RuntimeError("No index file specified.")
        xf = open(args.indexFile, 'r')
        validate(ff, xf)
    elif args.action == "create":
        print "Creating index..."
        xf = open(args.indexFile, 'w') if args.indexFile else sys.stdout
        buildIndex(ff, xf)
    elif args.action == "none":
        print args

#
main()
