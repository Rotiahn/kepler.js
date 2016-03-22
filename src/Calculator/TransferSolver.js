/** A collection of Transfer Solvers
 * @author Rotiahn / https://github.com/Rotiahn/
 * @namespace kepler.transferSolver
 */
KEPLER.TransferSolver = {};

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

    var testTime1 = Math.ceil( (travelTimeMin + travelTimeMax)/2 );
    var testVectors1 = KEPLER.Lambert(object1,object2,testTime1);
    var deltaV1 = testVectors1.departure.length() + testVectors1.arrival.length();

    var testTime2 = testTime1+1;
    var testVectors2 = KEPLER.Lambert(object1,object2,testTime2);
    var deltaV2 = testVectors2.departure.length() + testVectors2.arrival.length();

    var deltaVSlope = (deltaV2-deltaV1)/1; //When deltaVSlope = 0, we have reached an extrema.

    //console.log(testTime1,testTime2,deltaV1,deltaV2,deltaVSlope);

    var i = 0;

    while ( travelTimeMax-travelTimeMin > 1 ) {

        if (deltaVSlope > 0) {
            //deltaV is increasing, set travelTimeMax to be testTime1 (minima must be before this time)
            travelTimeMax = testTime1;
        } else if (deltaVSlope < 0) {
            //deltaV is decreasing, set travelTimeMin to be testTime1 (minima must be after this time)
            travelTimeMin = testTime1;
        } else {
            //deltaV is 0, set travelTimeMin to be testTime1 AND set travelTimeMax to be testTime2  (we stumbled upon the minima exactly)
            travelTimeMin = testTime1;
            travelTimeMax = testTime2;
        }

        testTime1 = Math.ceil( (travelTimeMin + travelTimeMax)/2 );
        testVectors1 = KEPLER.Lambert(object1,object2,testTime1);
        deltaV1 = testVectors1.departure.length() + testVectors1.arrival.length();

        testTime2 = testTime1+1;
        testVectors2 = KEPLER.Lambert(object1,object2,testTime2);
        deltaV2 = testVectors2.departure.length() + testVectors2.arrival.length();

        deltaVSlope = (deltaV2-deltaV1)/1;

        //console.log('x',i,testTime1,travelTimeMin,travelTimeMax,deltaV1,deltaV2,deltaVSlope);

        i++;
        if (i>100) {throw 'KEPLER.TransferSolver.minDeltaV_LaunchSpecified took too long to calculate transfer';};

    }
    //Found Optimum Travel time: testTime1

    var optimumTransfer = new KEPLER.Transfer(object1,object2,testTime1);
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

/** A function for calculating the optimum transfer, optimizing for minimum time (with fixed deltaV budget), assuming launch after specific waitTime
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time, not including waitTime)
 * @param {number} maxDeltaV - the maximum amount of delta V (m/s) the vehicle may expend for the journey
 * @module kepler
 */
KEPLER.TransferSolver.minTime_LaunchSpecified = function (orbit1, orbit2, maxDeltaV, waitTime = 0) {
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

    var chunkSize = periodSmall/8;  //Use 1/8th orbits to decrease probability that we'll end up with multiple minima per chunk
    var chunkCount = Math.ceil(periodLarge / chunkSize);  // We will include the entirety of last chunk, even if that chunk extends past periodLarge

    var travelTimeMin = 1;
    var travelTimeMax = chunkSize * chunkCount;

    var chunkBegin = 0;
    var chunkEnd = 0;
    var testTime1 = 0;
    var testTime2 = 0;
    var resultTransfers = {};
    for (var i=0; i< chunkCount; i++) {
        travelTimeMin = chunkBegin = Math.ceil(   (i)*(chunkSize));
        travelTimeMax = chunkEnd   = Math.floor((i+1)*(chunkSize));

        object1 = orbit1.clone();
        object2 = orbit2.clone();

        var j = 0;

        do {
            testTime1 = Math.ceil( (travelTimeMin + travelTimeMax)/2 );
            testVectors1 = KEPLER.Lambert(object1,object2,testTime1);
            //console.log(testVectors1);
            if (testVectors1 !== 0 && testVectors1 !== -1) {
                var deltaV1 = testVectors1.departure.length() + testVectors1.arrival.length();
            }

            testTime2 = testTime1+1;
            testVectors2 = KEPLER.Lambert(object1,object2,testTime2);
            //console.log(testVectors2);
            if (testVectors2 !== 0 && testVectors2 !== -1) {
                var deltaV2 = testVectors2.departure.length() + testVectors2.arrival.length();
            }


            //console.log(i,j,'|',testVectors1,testVectors2);
            var deltaVSlope = (deltaV2-deltaV1)/1;

            //console.log(
            //     i
            //    ,j
            //    ,'|'
            //    ,testTime1
            //    ,travelTimeMin
            //    ,travelTimeMax
            //    ,'|'
            //    ,deltaV1
            //    ,deltaV2
            //    ,deltaVSlope
            //);
//
            if (deltaVSlope === undefined || isNaN(deltaVSlope) ) {
                //testTime1 or TestTime2 failed Lambert. Assume this means that travel time is not enough
                travelTimeMin = testTime1;
            } else if (deltaV1 <= maxDeltaV ) {
                //testTime1 is an allowable amount of deltaV, therefore fastest allowable transfer will be here or before here
                //testTime1 is a new maximum amount of travel time
                travelTimeMax = testTime1;
            } else {
                //testTime1 is not an allowable solution (too much delta_V), so see if local minima is before or after this time
                if (deltaVSlope > 0) {
                    //deltaV is increasing, set departTimeMax to be testTime1 (minima must be before this time)
                    travelTimeMax = testTime1;
                } else if (deltaVSlope < 0) {
                    //deltaV is decreasing, set departTimeMin to be testTime1 (minima must be after this time)
                    travelTimeMin = testTime1;
                } else {
                    //deltaV slope is 0, set departTimeMin to be testTime1 AND set departTimeMax to be testTime2  (we stumbled upon the minima exactly)
                    //However, deltaV is still too high, so this chunk won't work.
                    travelTimeMin = testTime1;
                    travelTimeMax = testTime2;
                }


            }
            j++;
            if (j>100) {throw 'KEPLER.TransferSolver.minTime_LaunchSpecified took too long on chunk '+i+' to calculate transfer';};


        } while (travelTimeMax-travelTimeMin > 1); // Found local minima
        var testTransfer1 = new KEPLER.Transfer(object1,object2,testTime1);

        if ( testTransfer1.delta_v <= maxDeltaV) {
            //Found an acceptable solution, return it
            //console.log('I FOUND ONE!',testTransfer1);
            return testTransfer1;
        } else {
            //This chunk does not have an acceptable minima, move on to the next one.
        }

    }
    //tested all chunks without acceptable solution, this problem is not solvable with maxDeltaV
    //console.log('Nothing here :-(');
    return -1;

}
/** A function for calculating the optimum transfer, optimizing for minimum time (with fixed deltaV budget), allows departure delays
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @param {number} maxDeltaV - the maximum amount of delta V (m/s) the vehicle may expend for the journey
 * @module kepler
 */
KEPLER.TransferSolver.minTime = function (orbit1, orbit2, maxDeltaV) {

}
