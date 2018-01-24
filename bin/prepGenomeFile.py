
#
# prepGenomeFile.py
#
# Write out chromosome file (chr name + length).
# Excludes features on contigs
#

import sys
import gff3
import re
import argparse


class Prep:
    def __init__(self):
        self.args = None
        self.gffIn = None
	self.mapping = None
        self.tsvOut = None
        self.chrOut = None
        self.mgi_re = re.compile(r'(MGI:[0-9]+)')
        self.initArgParser()

    def initArgParser (self):
        """
        Sets up the parser for the command line args.
        """
        self.parser = argparse.ArgumentParser(description='Generate synteny blocks.')
        self.parser.add_argument(
            '-f',
            dest="gffFile",
            metavar='GFF file', 
            help='Genome GFF3 input file. (Default=reads from stdin)')

        self.parser.add_argument(
            '-m',
            dest="mappingfile",
            metavar='FILE', 
            help='File of MGI primary and secondary ids. 2 columns, tab delimited. Columns=primaryId, secondaryId')

        self.parser.add_argument(
            '-o',
            dest="ofile",
            metavar='FILE', 
            help='Output file name. (default=writes to stdout)')

        self.parser.add_argument(
            '-c',
            dest="chrFile",
            metavar='FILE', 
            help='Output file for chromosomes (default=writes to OUTFILE.chromosomes.tsv')

    def parseArgs (self) :
        """
        """
        self.args = self.parser.parse_args()

    def openFiles(self):
        self.gffIn = sys.stdin
        if self.args.gffFile:
            self.gffIn = open(self.args.gffFile, "r")
	#
	if self.args.mappingfile:
	    # read the mapping file, build a dict
	    self.mapping = {}
	    for line in open( self.args.mappingfile, "r"):
	        toks = line[:-1].split("\t")
		if len(toks) != 3: continue
		if not toks[0].startswith("MGI:") or not toks[1].startswith("MGI:"): continue
		self.mapping[toks[0]] = (toks[1],toks[2])
	#
        self.tsvOut = sys.stdout
        if self.args.ofile:
           self.tsvOut  = open(self.args.ofile, "w")
        if self.args.chrFile is None:
            if self.args.ofile:
                self.args.chrFile = "chromosomes." + self.args.ofile 
            else:
                self.args.chrFile = "chromosomes.tsv"
        self.chrOut = open(self.args.chrFile, "w")

    def go(self):
        self.parseArgs()
        self.openFiles()
        # 
        #
        h1 = [
            "chromosome",
            "start",
            "end",
            "strand",
            "type",
            "biotype",
            "id",
            "mgiid",
            "symbol",
        ]
        self.tsvOut.write('\t'.join(h1) + '\n')
        #
        h2 = [
            "chromosome",
            "length",
        ]
        self.chrOut.write('\t'.join(h2) + '\n')
        #
        for f in gff3.iterate(self.gffIn):
            # exclude features on contigs.
            if len(f.seqid) > 2:
                continue
	    #
            if f.type == "chromosome":
		# chromosome. write data and continue
                r = [
                    f.seqid,
                    str(f.end - f.start + 1),
                ]
                self.chrOut.write('\t'.join(r) + '\n')
                continue
            # feature. get the MGI id, if any
            mgiid = "."
	    symbol = f.attributes.get("Name",".")
            m = self.mgi_re.search(f.attributes.get('description',''))
            if m:
                mgiid = m.group(1)
		# in case they used secondary ids, convert to primary
		primary = self.mapping.get(mgiid, None)
		if primary:
		    sys.stderr.write("Secondary %s (%s) converted to primary %s (%s)\n" %(mgiid, symbol, primary[0], primary[1]))
		    mgiid = primary[0]
		    symbol = primary[1]
            #
            r = [
                f.seqid,
                str(f.start),
                str(f.end),
                f.strand,
                f.type,
                f.attributes.get("biotype","."),
                f.ID.replace("gene:",""),
                mgiid,
                symbol
            ]
            self.tsvOut.write('\t'.join(r) + '\n')
            #
#
Prep().go()
