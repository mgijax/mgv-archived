#
# prepGenomeFile.py
#
# Preprocesses the GFF file for a genome. Extracts the MGI id and symbol (if present) and makes them
# explicit attributes (they come embedded in a description field). Also writes out a chromosome information
# file containing the names and lengths of each chromosome.
#
import sys
import gff3
import re
import argparse

class Prep:
    def __init__(self):
        self.args = None
        self.gffIn = None
        self.gffOut = None
        self.chrOut = None
        self.mgi_re = re.compile(r'(MGI:[0-9]+)')
        self.initArgParser()

    def initArgParser (self):
        """
        Sets up the parser for the command line args.
        """
        self.parser = argparse.ArgumentParser(description='')
        self.parser.add_argument(
            '-f',
            dest="gffFile",
            metavar='GFF file', 
            help='Genome GFF3 input file. (Default=reads from stdin)')

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
        self.gffOut = sys.stdout
        if self.args.ofile:
           self.gffOut  = open(self.args.ofile, "w")
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
        h2 = [
            "chromosome",
            "length",
        ]
	self.gffOut.write(gff3.HEADER)
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
	    # the MGP identifier. Unique across all the genomes.
	    mgpId = f.ID.replace("gene:","")
            # get the associated MGI id, if any
            m = self.mgi_re.search(f.attributes.get('description',''))
            mgiId = "."
	    #
	    geneId = mgpId
	    geneLabel = mgpId
            if m:
                mgiId = m.group(1)
		geneId = mgiId
		geneLabel = f.attributes.get("Name",".")
            #
	    r = gff3.Feature(f)
	    r.attributes = {
	        'ID': mgpId,
		'geneId': geneId,
		'geneLabel': geneLabel,
		'biotype': f.attributes.get("biotype",""),
	    }
	    #
            self.gffOut.write(str(r))
            #
#
Prep().go()
