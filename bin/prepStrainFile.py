
#
# prepStrainFile.py
#
#

import sys
import gff3
import re
import argparse


class Prep:
    def __init__(self):
        self.args = None
        self.gffIn = None
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
            help='Strain GFF3 input file. (Default=reads from stdin)')

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
            if f.type == "chromosome":
                r = [
                    f.seqid,
                    str(f.end - f.start + 1),
                ]
                self.chrOut.write('\t'.join(r) + '\n')
                continue
            # get the MGI id, if any
            m = self.mgi_re.search(f.attributes.get('description',''))
            mgiid = "."
            if m:
                mgiid = m.group(1)
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
                f.attributes.get("Name","."),
            ]
            self.tsvOut.write('\t'.join(r) + '\n')
            #
#
Prep().go()
