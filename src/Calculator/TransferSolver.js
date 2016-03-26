/** A collection of Transfer Solvers
 * @author Rotiahn / https://github.com/Rotiahn/
 * @namespace kepler.transferSolver
 */
KEPLER.TransferSolver = {};

/** A function which returns a value to be tested for running functions multiple times to locate extrema using slope
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {} testArg1 - first argument of testFunction
 * @param {} testArg2 - second argument of testFunction
 * @param {number} minX - the minimum value for X
 * @param {number} maxX - the maximum value for X
 * @param {function({},{},number):number} testFunction - the function to use for generating values to measure slope from.  Must take testArg1, testArg2 and a number (where minX<=number<=maxX) as arguments. Must return a number.
 * @param {function(number,number):number} comparator - a function which takes two values and returns a number evaluating
 * @returns {number} transfer - The value of testX1 reached based on the comparator.
 * @module kepler
 */
KEPLER.TransferSolver.bisectionSlopeSolver = function(testArg1, testArg2, minX, maxX, testFunction, comparator) {
    var i = 0;

    var  testX1,testX2,testValue1,testValue2,compareResult;
    do {
        testX1 = Math.ceil( (minX + maxX)/2 );
        testValue1 = testFunction(testArg1,testArg2,testX1);

        testX2 = testX1+1;
        testValue2 = testFunction(testArg1,testArg2,testX2);

        compareResult = comparator(testValue1,testValue2);

        //console.log(i,testX1,testX2,'|',testValue1,testValue2,'|',compareResult)

        if (compareResult > 0) {
            //compareResult is positive, value we're looking for is larger than our current testX1
            minX = testX1;
        } else if (compareResult < 0) {
            //compareResult is negative, value we're looking for is smaller than our current testX1
            maxX = testX1;
        } else {
            //compareResult is zero, set minX to be testX1 AND set maxX to be testX2  (we stumbled upon the value exactly)
            minX = testX1;
            maxX = testX2;
        }

        i++;
        if (i>100) {throw 'KEPLER.TransferSolver.bisectionSlopeSolver took too long to calculate using:\n'+testFunction;};

    } while ( maxX-minX > 1 );

    //Found Solution
    return testX1;
}
/** A function for calculating the transfer with minimum deltaV assuming launch after specific waitTime
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time, not including waitTime)
 * @param {number} waitTime - (Default:0) The amount of time (s) the solver should add before running calculation (i.e. the amount of time to delay departure time).
 * @returns {KEPLER.Transfer} transfer - The optimum transfer orbit to minimize deltaV launching now.
 * @module kepler
 */
KEPLER.TransferSolver.minDeltaV_LaunchSpecified = function (orbit1, orbit2, waitTime = 0) {
    var object1 = orbit1.clone();
    var object2 = orbit2.clone();

    object1.addTime(waitTime);
    object2.addTime(waitTime);

    var object1Elements = object1.getElements();
    var object2Elements = object2.getElements();

    var periodSmall = Math.min(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );

    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;



    var optimumTime = KEPLER.TransferSolver.bisectionSlopeSolver(
         object1        //testArg1
        ,object2        //testArg2
        ,travelTimeMin  //minX
        ,travelTimeMax  //maxX
        ,function(object1,object2,x) {
            return new KEPLER.Transfer(object1,object2,x);
        } //testFunction
        ,function(x,y) {
            //x is Transfer(time1), y is Transfer(time2)
            var deltaV1 = x.delta_v;
            var deltaV2 = y.delta_v;

            var deltaVSlope = (deltaV2-deltaV1)/1; //When deltaVSlope = 0, we have reached an extrema.

            //when slope is positive, we want to go smaller

            return -deltaVSlope;
        }//comparator
    );

    var optimumTransfer = new KEPLER.Transfer(object1,object2,optimumTime);
    return optimumTransfer;
}

/** A function for calculating the optimum transfer, optimizing for minimum deltaV expenditure
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @module kepler
 */
KEPLER.TransferSolver.minDeltaV = function (orbit1, orbit2) {
    //Given a starting orbit, ending orbit, find the next instance of a transfer orbit which is the optimum deltaV transfer.
    // Allows delays in departure
    // Searches launch times based on orbital periods of bodies in question.

    //Need a mechanism for optimizing non-coplanar comparisons.
    // Idea1 -  Chunks + binary tree solver:
    //          1. Break potential launch times into X chunks, where X = (larger Period / smaller period). Chunk size = smaller period
    //          3. Define chunkBegin & chunkEnd
    //          4. Test point = (chunkBegin + chunkEnd) /2
    //          5. Find deltaV at Test Point (deltaV0)
    //          6. Find deltaV at test point+1s (deltaV1)
    //          7. Determine deltaV slope (deltaV1-deltaV0)
    //          8. If deltaV slope >0, chunkMax = Testpoint, goto 4
    //          9. If deltaV slope <0, chunkMin = Testpoint, goto 4
    //          10.If deltaV slope ~=0, Found minimum deltaV!
    //
    // Idea2 - Global Binary Tree solver (cannot account for multiple local minima)
    // Idea3 - Modified Lambert Solver?

    // Currently Using Idea1 - This method is computationally expensive.  Future TODO: implement idea3 or alternate faster solution.

    var object1 = orbit1.clone();
    var object2 = orbit2.clone();

    var object1Elements = object1.getElements();
    var object2Elements = object2.getElements();

    var periodSmall = Math.min(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );


    var chunkSize = periodSmall/8;  //Use 1/8th orbits to decrease probability that we'll end up with multiple minima per chunk
    var chunkCount = Math.ceil(periodLarge / chunkSize);  // We will include the entirety of last chunk, even if that chunk extends past periodLarge


    var departTimeMin = 0;
    var departTimeMax = chunkSize * chunkCount;
    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;


    var chunkBegin = 0;
    var chunkEnd = 0;
    var testTime1 = 0;
    var testTime2 = 0;
    var resultTransfers = {};
    //Cycle through each Chunk and determine its minima to identify chunk with preferred
    for (var i=0; i< chunkCount; i++) {
        departTimeMin = chunkBegin = Math.ceil(   (i)*(chunkSize));
        departTimeMax = chunkEnd   = Math.floor((i+1)*(chunkSize));

        object1 = orbit1.clone();
        object2 = orbit2.clone();

        var j = 0;

        var testTime1 = Math.ceil( (departTimeMin + departTimeMax)/2 );
        var testTransfer1 = KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,testTime1);
        //var deltaV1 = testVectors1.vector1.length() + testVectors1.vector2.length();

        var testTime2 = testTime1+1;
        var testTransfer2 = KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,testTime2);
        //var deltaV2 = testVectors2.vector1.length() + testVectors2.vector2.length();

        var deltaVSlope = (testTransfer2.delta_v - testTransfer1.delta_v)/1;

        while ( departTimeMax-departTimeMin > 1 ) {

            if (deltaVSlope > 0) {
                //deltaV is increasing, set departTimeMax to be testTime1 (minima must be before this time)
                departTimeMax = testTime1;
            } else if (deltaVSlope < 0) {
                //deltaV is decreasing, set departTimeMin to be testTime1 (minima must be after this time)
                departTimeMin = testTime1;
            } else {
                //deltaV is 0, set departTimeMin to be testTime1 AND set departTimeMax to be testTime2  (we stumbled upon the minima exactly)
                departTimeMin = testTime1;
                departTimeMax = testTime2;
            }

            testTime1 = Math.ceil( (departTimeMin + departTimeMax)/2 );
            testTransfer1 = KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,testTime1);
            //deltaV1 = testVectors1.vector1.length() + testVectors1.vector2.length();

            testTime2 = testTime1+1;
            testTransfer2 = KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,testTime2);
            //deltaV2 = testVectors2.vector1.length() + testVectors2.vector2.length();

            deltaVSlope = (testTransfer2.delta_v - testTransfer1.delta_v)/1;

            //console.log(
            //     i
            //    ,j
            //    ,'|'
            //    ,testTime1
            //    ,departTimeMin
            //    ,departTimeMax
            //    ,'|'
            //    ,testTransfer1.delta_v
            //    ,testTransfer2.delta_v
            //    ,deltaVSlope
            //);


            j++;
            if (j>100) {throw 'KEPLER.TransferSolver.minDeltaV took too long on chunk '+i+' to calculate transfer';};

        }
        //minimum deltaV found for this chunk, save it to array
        resultTransfers[testTime1] = testTransfer1;
        console.log(
             i
        //    ,j
            ,'|'
            ,testTime1
        //    ,departTimeMin
        //    ,departTimeMax
        //    ,'|'
            ,testTransfer1.delta_v
        //    ,testTransfer2.delta_v
        //    ,deltaVSlope
        );

    }
    //All chunk minimum deltaVs found.  Now choose lowest deltaV option.  starting bestTransfer = last testTransfer1
    var bestTransfer = testTransfer1;
    //console.log(resultTransfers);
    for (chunk in resultTransfers) {
        if (resultTransfers[chunk].delta_v <= bestTransfer.delta_v) {
            bestTransfer = resultTransfers[chunk];
        }
    }

    return bestTransfer;

}
KEPLER.TransferSolver.minDeltaV2 = function (orbit1, orbit2) {
    //Given a starting orbit, ending orbit, find the next instance of a transfer orbit which is the optimum deltaV transfer.
    // Allows delays in departure
    // Searches launch times based on orbital periods of bodies in question.

    //Need a mechanism for optimizing non-coplanar comparisons.
    // Idea1 -  Chunks + binary tree solver:
    //          1. Break potential launch times into X chunks, where X = (larger Period / smaller period). Chunk size = smaller period
    //          3. Define chunkBegin & chunkEnd
    //          4. Test point = (chunkBegin + chunkEnd) /2
    //          5. Find deltaV at Test Point (deltaV0)
    //          6. Find deltaV at test point+1s (deltaV1)
    //          7. Determine deltaV slope (deltaV1-deltaV0)
    //          8. If deltaV slope >0, chunkMax = Testpoint, goto 4
    //          9. If deltaV slope <0, chunkMin = Testpoint, goto 4
    //          10.If deltaV slope ~=0, Found minimum deltaV!
    //
    // Idea2 - Global Binary Tree solver (cannot account for multiple local minima)
    // Idea3 - Modified Lambert Solver?

    // Currently Using Idea1 - This method is computationally expensive.  Future TODO: implement idea3 or alternate faster solution.

    var object1 = orbit1.clone();
    var object2 = orbit2.clone();

    var object1Elements = object1.getElements();
    var object2Elements = object2.getElements();

    var periodSmall = Math.min(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );


    var chunkSize = periodSmall/8;  //Use 1/8th orbits to decrease probability that we'll end up with multiple minima per chunk
    var chunkCount = Math.ceil(periodLarge / chunkSize);  // We will include the entirety of last chunk, even if that chunk extends past periodLarge

    var departTimeMin = 0;
    var departTimeMax = chunkSize * chunkCount;
    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;

    var resultTransfers = {};
    //Cycle through each Chunk and determine its minima to identify chunk with preferred
    for (var i=0; i< chunkCount; i++) {
        departTimeMin = chunkBegin = Math.ceil(   (i)*(chunkSize));
        departTimeMax = chunkEnd   = Math.floor((i+1)*(chunkSize));

        object1 = orbit1.clone();
        object2 = orbit2.clone();

        var j = 0;

        var optimumTime = KEPLER.TransferSolver.bisectionSlopeSolver(
             object1        //testArg1
            ,object2        //testArg2
            ,departTimeMin  //minX
            ,departTimeMax  //maxX
            ,function(object1,object2,x) {
                return KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,x);
            } //testFunction
            ,function(x,y) {
                //x is Transfer(departTime1), y is Transfer(departTime2)
                var deltaV1 = x.delta_v;
                var deltaV2 = y.delta_v;

                var deltaVSlope = (deltaV2-deltaV1)/1; //When deltaVSlope = 0, we have reached an extrema.

                //when slope is positive, we want to go smaller

                return -deltaVSlope;
            }//comparator
        );

        //minimum deltaV found for this chunk, save it to array
        resultTransfers[optimumTime] = KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,optimumTime);
        console.log(
             i
        //    ,j
            ,'|'
            ,optimumTime
        //    ,departTimeMin
        //    ,departTimeMax
        //    ,'|'
            ,resultTransfers[optimumTime] .delta_v
        //    ,testTransfer2.delta_v
        //    ,deltaVSlope
        );

    }
    //All chunk minimum deltaVs found.  Now choose lowest deltaV option.  starting bestTransfer = last testTransfer1
    var bestTransfer = resultTransfers[optimumTime] ;
    console.log(resultTransfers);
    for (time in resultTransfers) {
        //console.log(time);
        if (resultTransfers[time].delta_v <= bestTransfer.delta_v) {
            bestTransfer = resultTransfers[time];
        }
    }

    return bestTransfer;

}

/** A function for calculating the optimum transfer, optimizing for minimum time (with fixed deltaV budget)
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @param {number} maxDeltaV - the maximum amount of delta V (m/s) the vehicle may expend for the journey
 * @module kepler
 */
KEPLER.TransferSolver.minTime = function (orbit1, orbit2, maxDeltaV) {

}
