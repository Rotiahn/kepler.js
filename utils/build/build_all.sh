#!/bin/bash

#DIRECTORIES:
export BASEDIR=$(cd "$PWD/../../" && pwd) 
export SRCDIR="$BASEDIR/src"
export EXTERNALDIR="$BASEDIR/src/external"
export BUILDSCRIPTS="$BASEDIR/utils/build"

source "$BUILDSCRIPTS/build_main.sh"
source "$BUILDSCRIPTS/build_use_THREEJS.sh"