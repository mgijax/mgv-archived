#!/bin/bash

source ./genomes.cfg

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ".." && pwd )"
export ENSEMBLRELEASE=92
export BASEURL="ftp://ftp.ensembl.org/pub/release-${ENSEMBLRELEASE}/gff3"
export MGIBASEURL="http://www.informatics.jax.org/downloads/mgigff3"
#
# Max size in Mb for a feature. Features above this size are removed and reported.
export SIZELIMIT="10"
#
BDIR="${DIR}/bin"
DDIR="${DIR}/data/downloads"
SDIR="${DIR}/data/genomedata"
LOG="${DIR}/data/LOG"

