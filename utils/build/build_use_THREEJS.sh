#!/bin/bash


#FILE LIST
FILELIST=(
    "$SRCDIR/Kepler.js"                         #Base KEPLER file

    #"$EXTERNALDIR/three.js/Three.js"            #THREE.JS
    #"$EXTERNALDIR/three.js/math/Matrix4.js"     #THREE.JS
    #"$EXTERNALDIR/three.js/math/Vector3.js"     #THREE.JS
    "$EXTERNALDIR/external.js"                  #external renaming to KEPLER

    "$SRCDIR/AstroBody.js"                      #Astrobody
    "$SRCDIR/Orbit.js"                          #Orbit
    "$SRCDIR/Spacecraft.js"                     #Spacecraft
    "$SRCDIR/Transfer.js"                       #Transfer

    "$SRCDIR/Calculator/Lambert.js"             #Lambert Solver
    "$SRCDIR/Calculator/TransferSolver.js"      #Various Transfer Solvers

    "$SRCDIR/examples.js"                       
)

#count=0
#while [ "x${FILELIST[count]}" != "x" ]
#do
#    count=$(( $count + 1 ))
#done
#echo $count


#Build Non-Minimized version:

echo "" > "$BASEDIR/kepler_use_THREEJS.js"
count=0
while [ "x${FILELIST[count]}" != "x" ]
do
    echo ""                                 >> "$BASEDIR/kepler_use_THREEJS.js"
    echo "//File: "${FILELIST[count]}""     >> "$BASEDIR/kepler_use_THREEJS.js"
    echo ""                                 >> "$BASEDIR/kepler_use_THREEJS.js"
    cat "${FILELIST[count]}"                >> "$BASEDIR/kepler_use_THREEJS.js"

    count=$(( $count + 1 ))
done
echo $count

#Build Minimized 

java -jar "$BUILDSCRIPTS/Compiler/compiler.jar" "$BASEDIR/kepler_use_THREEJS.js" \
--jscomp_off=globalThis --jscomp_off=checkTypes \
--js_output_file "$BASEDIR/kepler_use_THREEJS.min.js"
