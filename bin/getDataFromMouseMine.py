import sys
import urllib
import os.path

MOUSEMINE="http://www.mousemine.org/mousemine"

class DataGetter :

    def __init__ (self) :
	self.odir = '.'
	self.gFn = os.path.join(self.odir, 'allGenomes.tsv')
	self.gFd = open(self.gFn, 'w')
	self.cFn = None
	self.cFd = None
	self.fFn = None
	self.fFd = None
	self.lFd = sys.stderr

    def log(self, s):
        self.lFd.write(s)
        self.lFd.write('\n')

    def doQuery (self, q) :
	fmt = 'tab'
	url = '%s/service/query/results?format=%s&query=%s' % (MOUSEMINE,fmt,urllib.quote_plus(q))
	fd = urllib.urlopen(url)
	for line in fd:
	    toks = line[:-1].split('\t')
	    toks[0] = toks[0].split('.')[0]
	    yield toks
	fd.close()
	
    def convertStrainName (self, s):
	if "PAHARI" in s:
	    return "mus_pahari"
	elif "CAROLI" in s:
	    return "mus_caroli"
	elif "SPRET" in s:
	    return "mus_spretus"
	else:
	    return "mus_musculus_" + s.lower().replace('/','')
	  
    # Returns iterator over the set of annotated genomes.
    # Args:
    #    none
    # Returns:
    #    List of rows, one per genome.
    #    Each row has a primary identifier, a name, and a filename prefix.
    def getGenomes (self) :
	q = '''<query 
	model="genomic"
	view="Strain.primaryIdentifier Strain.name"
	sortOrder="Strain.name ASC"
	>
	  <constraint path="Strain" op="IN" value="Annotated strains"/>
	</query>'''

	for r in self.doQuery(q):
	    r.append(self.convertStrainName(r[1]))
	    yield r

    # Returns iterator over chromosomes for the given genome
    # Args:
    #    g (string) the name of the genome, eg, "A/J"
    # Returns:
    #    List of rows, one per chromosome of the given genome.
    #    Each row has a chromosome id and total chromosome length.
    #    The rows are sorted by chromosome id.
    def getChromosomes (self, g) :
	q = '''<query 
	model="genomic"
	view="Chromosome.primaryIdentifier Chromosome.length"
	sortOrder="Chromosome.symbol ASC"
	>
	<constraint path="Chromosome.strain.name" op="=" value="%s"/>
	</query>''' % g

	return self.doQuery(q)

    # Returns an iterator over genes on the specified chromosome for the specified genome.
    # Args:
    #    g (string) the name of the genome, eg, "A/J"
    #    c (string) the chromosome, eg, "13"
    # Returns:
    #    Iterator that yields one row per gene in the specified genome.
    #    Each row has: strain name, gene id, chromosome location (chr, start, end, strand)
    def getGenes (self, g, c) :
	q = '''<query 
	model="genomic"
	view="
	  Gene.strain.name
	  Gene.primaryIdentifier
	  Gene.sequenceOntologyTerm.name
	  Gene.chromosome.primaryIdentifier
	  Gene.chromosomeLocation.start
	  Gene.chromosomeLocation.end
	  Gene.chromosomeLocation.strand
	  Gene.canonical.primaryIdentifier
	  Gene.canonical.symbol
	  "
	sortOrder="Gene.chromosomeLocation.start ASC"
	>
	<join path="Gene.canonical" style="OUTER"/>
	<constraint path="Gene.strain.name" op="=" value="%s"/>
	<constraint path="Gene.chromosome.primaryIdentifier" op="=" value="%s"/>
	</query>''' % (g, c)

	for r in self.doQuery(q):
	    # the outer join returns '""' in place of nulls.
	    # convert them to '.'
	    r[7] = '.' if r[7] == '""' else r[7]
	    r[8] = '.' if r[8] == '""' else r[8]
	    yield r

    def formatRow(self, row):
        return '\t'.join(map(str, row)) + '\n'

    # Main program. 
    def main (self):
	# Init genome file
	self.gFd.write('name\tlabel\n')
	genomes = list(self.getGenomes())
	genomes.sort(lambda a,b: cmp(a[2],b[2]))
	# For all the genomes we know about...
	for g in genomes:
	    # Write genome record
	    self.log(g[1])
	    self.gFd.write('%s\t%s\n' % (g[2],g[1]))
	    # Init chromosome file
	    self.cFn = os.path.join(self.odir, '%s-chromosomes.tsv'%g[2])
	    self.cFd = open(self.cFn, 'w')
	    self.cFd.write('chromosome\tlength\n')
	    # Init feature file
	    self.fFn = os.path.join(self.odir, '%s-features.tsv'%g[2])
	    self.fFd = open(self.fFn, 'w')
	    self.fFd.write('chromosome\tstart\tend\tstrand\tcontig\tlane\ttype\tbiotype\tid\tmgiid\tsymbol\n')
	    # Process features a chromosome at a time
	    for c in self.getChromosomes(g[1]):
		# Write chromosome record
		self.log(c[0])
		self.cFd.write('%s\t%s\n' % (c[0],c[1]))
		# For all the genes on this chromosome...
		for f in self.getGenes(g[1], c[0]):
		    strand = '-' if f[6] == '-1'else '+'
		    row = [f[3], f[4], f[5], strand, 0, 0, 'gene', f[2], f[1], f[7] , f[8]]
		    self.fFd.write(self.formatRow(row))


if __name__ == "__main__":
    DataGetter().main()

