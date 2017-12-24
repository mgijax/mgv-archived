#!/usr/bin/python

import os
import sys 
import cgi 
import cgitb
#cgitb.enable()
from indexFeatures import lookup
import json

mgvdir = os.path.dirname(__file__)
datadir = os.path.join(mgvdir, '../data/straindata')


form   = cgi.FieldStorage()
strain = form['strain'].value
chr    = form['chr'].value
start  = int(form['start'].value)
end    = int(form['end'].value)
'''
strain = "mus_caroli"
chr    = "7"
start  = 2000000
end    = 4000000
'''

featfile = os.path.join(datadir, '%s-features.tsv' % strain)
indexfile = os.path.join(datadir, '%s-index.tsv' % strain)
ff = open(featfile,'r')
xf = open(indexfile,'r')
feats = lookup(ff, xf, chr, start, end)

print "Content-type: application/json"
print
print json.dumps(feats)
