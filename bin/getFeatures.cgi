#!/usr/bin/python

import os
import sys 
import json
import cgi 
import cgitb
cgitb.enable()
from indexFeatures import lookup, readIndexFile

# extract the form data: a genome name and one or more sets of coordinates
form   = cgi.FieldStorage()
genome = form['genome'].value
coords = form['coords'].value
'''
genome = "mus_caroli"
coords = "7:2000000..4000000,8:4000000..6000000,X:64000000..68000000"
'''

# find the data directory
mgvdir = os.path.dirname(__file__)
datadir = os.path.join(mgvdir, '../data/genomedata')
featfile = os.path.join(datadir, '%s-features.tsv' % genome)
indexfile = os.path.join(datadir, '%s-index.tsv' % genome)
ff = open(featfile,'r')
xf = open(indexfile,'r')
ix = readIndexFile(xf)

print "Content-type: application/json"
print

allFeats = []
for c in coords.split(","):
    chr, rest = c.split(":")
    s,e = rest.split("..")
    start = int(s)
    end = int(e)
    feats = lookup(ff, ix, chr, start, end)
    blk = {
      "chr" : chr,
      "start" : start,
      "end" : end,
      "features" : feats
    }
    allFeats.append(blk)
print json.dumps(allFeats)
