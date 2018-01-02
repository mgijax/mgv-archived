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
genome = "mus_musculus_dba2j"
coords = "4:65219973..91282907"
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

answer = []
allBlocks = {}
for c in coords.split(","):
    chr, rest = c.split(":")
    s,e   = rest.split("..")
    start = int(s)
    end   = int(e)
    blocks= lookup(ff, ix, chr, start, end)
    for b in blocks:
        if not b["id"] in allBlocks:
	    allBlocks[b["id"]] = b
	    answer.append(b)
#
print json.dumps(answer)


