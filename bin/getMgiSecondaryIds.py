#
# getMgiSecondaryIds.py
# 
# Queries MouseMine for all mouse feature primary and secondary ids.
# Writes a 2-column file of primaryId, secondaryId
#

import sys
import urllib

q = '''<query
    name="" model="genomic"
    view="SequenceFeature.synonyms.value SequenceFeature.primaryIdentifier SequenceFeature.symbol"
    longDescription=""
    sortOrder="SequenceFeature.primaryIdentifier asc"
    constraintLogic="A and B">
	<constraint path="SequenceFeature.primaryIdentifier" code="A" op="CONTAINS" value="MGI:"/>
	<constraint path="SequenceFeature.synonyms.value" code="B" op="CONTAINS" value="MGI:"/>
    </query>'''

url = 'http://www.mousemine.org/mousemine/service/query/results?query=' + urllib.quote_plus(q);
fd = urllib.urlopen(url)
sys.stdout.write("secondaryId\tprimaryId\tsymbol\n")
sys.stdout.write(fd.read())
