#!/bin/bash

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ".." && pwd )"
BIN="${DIR}/bin"
OUTDIR="${DIR}/data"

PYTHON="python"
MOUSEMINE="http://www.mousemine.org/mousemine"

# Max size in Mb for a feature. 
# Features above this size are removed and reported.
export SIZELIMIT="10"
