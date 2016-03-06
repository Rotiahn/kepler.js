#!/bin/bash

#DIRECTORIES:
export BASEDIR=$(cd "$PWD/../../" && pwd) 
export SRCDIR="$BASEDIR/src"
export EXTERNALDIR="$BASEDIR/src/external"


#FILE LIST
FILELIST=(
    "$SRCDIR/Kepler.js"                         #Base KEPLER file

    "$EXTERNALDIR/three.js/Three.js"            #THREE.JS
    "$EXTERNALDIR/three.js/math/Matrix4.js"     #THREE.JS
    "$EXTERNALDIR/three.js/math/Vector3.js"     #THREE.JS
    "$EXTERNALDIR/external.js"                  #external renaming to KEPLER

    "$SRCDIR/AstroBody.js"                      #Astrobody
    "$SRCDIR/Orbit.js"                          #Orbit

    "$SRCDIR/examples.js"                       
)

#count=0
#while [ "x${FILELIST[count]}" != "x" ]
#do
#    count=$(( $count + 1 ))
#done
#echo $count


#Build Non-Minimized version:

echo "" > "$BASEDIR/kepler.js"
count=0
while [ "x${FILELIST[count]}" != "x" ]
do
    echo ""                                 >> "$BASEDIR/kepler.js"
    echo "//File: "${FILELIST[count]}""     >> "$BASEDIR/kepler.js"
    echo ""                                 >> "$BASEDIR/kepler.js"
    cat "${FILELIST[count]}"                >> "$BASEDIR/kepler.js"

    count=$(( $count + 1 ))
done
echo $count

#Build Minimized 

java -jar "$BASEDIR/utils/build/Compiler/compiler.jar" "$BASEDIR/kepler.js" \
--jscomp_off=globalThis --jscomp_off=checkTypes \
--js_output_file "$BASEDIR/kepler.min.js"
