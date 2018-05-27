#!/usr/bin/python

import os
import sys 
import json
import cgi 
import cgitb
cgitb.enable()
from indexFeatures import lookup, idlookup, readIndexFile

#----------------------------------------------------------
# Returns features with the specified coordinate range(s) within the specified genome.
def getByCoords(datadir, form):
    # get the coords
    genome = form['genome'].value
    coords = form['coords'].value
    '''
    genome = "mus_musculus_dba2j"
    coords = "4:65219973..91282907"
    '''
    # open the feature file
    featfile = os.path.join(datadir, '%s-features.tsv' % genome)
    ff = open(featfile,'r')
    # read the index file
    indexfile = os.path.join(datadir, '%s-index.tsv' % genome)
    ix = readIndexFile(open(indexfile,'r'))

    answer = []
    allBlocks = {}
    for c in coords.split(","):
	chr, rest = c.split(":")
	s,e   = rest.split("..")
	start = int(round(float(s))) if "." in s else int(s)
	end   = int(round(float(e))) if "." in e else int(e)
	blocks= lookup(ff, ix, chr, start, end)
	for b in blocks:
	    if not b["id"] in allBlocks:
		allBlocks[b["id"]] = b
		answer.append(b)
    #
    return answer

#----------------------------------------------------------
# Returns features by ID from a specified genome.
def getByIds(datadir, form):
    #
    genome = form['genome'].value
    ids = form['ids'].value.split()
    # open the feature file
    featfile = os.path.join(datadir, '%s-features.tsv' % genome)
    ff = open(featfile,'r')
    #
    return idlookup(ff, ids)


#----------------------------------------------------------
# Given either an MGI id or strain specific id, returns genologs from all genomes. 
# 
def getGenologs(datadir, form):
    pass

#----------------------------------------------------------
def main (form) :
    # find the data directory
    mgvdir = os.path.dirname(__file__)
    datadir = os.path.join(mgvdir, '../data/genomedata')
    #
    if 'coords' in form:
	ans = getByCoords(datadir, form)
    elif 'ids' in form:
        ans = getByIds(datadir, form)
    else:
        ans = []
    #
    print "Content-type: application/json"
    print
    print json.dumps(ans)


#----------------------------------------------------------
def test ():
    #
    class FakeFormEntry:
       def __init__(self, name, value):
           self.name = name
	   self.value = value
    #
    class FakeForm:
	def __init__ (self):
	    self.entries = {}
	def add(self, name, value):
	    self.entries[name] = FakeFormEntry(name,value)
	def __getitem__(self, name):
	    return self.entries[name]
	def __contains__(self, item):
	    return item in self.entries
    #
    form = FakeForm()
    form.add( "genome", "mus_musculus")
    form.add( "coords", "1:10000000..20000000")
    #form.add( "ids"   , "MGI:99677 MGI:97490")
    #
    main(form)

#----------------------------------------------------------
if __name__ == "__main__":
    main(cgi.FieldStorage())
