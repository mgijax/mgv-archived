#!/bin/bash

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ".." && pwd )"
BDIR="${DIR}/bin"
GDIR="${DIR}/data/genomedata"
LOG="${DIR}/data/LOG"

# Max size in Mb for a feature. Features above this size are removed and reported.
export SIZELIMIT="10"
