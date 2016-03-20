/** A collection of Transfer Solvers
 * @author Rotiahn / https://github.com/Rotiahn/
 * @namespace kepler.transferSolver
 */
KEPLER.TransferSolver = {};

/** A function for calculating the transfer with minimum deltaV assuming launch immediately
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @returns {KEPLER.Transfer} transfer - The optimum transfer orbit to minimize deltaV launching now.
 * @module kepler
 */
KEPLER.TransferSolver.minDeltaV_LaunchNow = function (orbit1, orbit2) {
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

        }

        testTime1 = Math.ceil( (travelTimeMin + travelTimeMax)/2 );
        testVectors1 = KEPLER.Lambert(object1,object2,testTime1);
        deltaV1 = testVectors1.departure.length() + testVectors1.arrival.length();

        testTime2 = testTime1+1;
        testVectors2 = KEPLER.Lambert(object1,object2,testTime2);
        deltaV2 = testVectors2.departure.length() + testVectors2.arrival.length();

        deltaVSlope = (deltaV2-deltaV1)/1;

        //console.log(i,testTime1,travelTimeMin,travelTimeMax,deltaV1,deltaV2,deltaVSlope);

        i++;
        if (i>100) {throw 'KEPLER.TransferSolver.minDeltaV_LaunchNow took too long with to calculate transfer';};

    }
    //Found Optimum Travel time: testTime1

    var optimumTransfer = new KEPLER.Transfer(orbit1,orbit2,testTime1);
    return optimumTransfer;
}


/** A function for calculating the optimum transfer, optimizing for minimum deltaV expenditure
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @module kepler
 */
KEPLER.TransferSolver.minDeltaV = function (orbit1, orbit2) {
    //Given a starting orbit, ending orbit and a maximum,start object,end object and start time, find the transfer orbit which
    // arrives at the target object with the least amount of delta_v
    // Allows delays in departure

    //Need a mechanism for optimizing non-coplanar comparisons.
    // Idea1 -  Chunks + newton solver:
    //          1. Break potential launch times into X chunks, where X = (larger Period / smaller period). Chunk size = smaller period
    //          2. Find chunk with lowest deltaV expectation
    //          3. Define chunkMin & chunkMax
    //          4. Test point = (chunkMin + chunkMax) /2
    //          5. Find deltaV at Test Point (deltaV0)
    //          6. Find deltaV at test point+1s (deltaV1)
    //          7. Determine deltaV slope (deltaV1-deltaV0)
    //          8. If deltaV slope >0, chunkMax = Testpoint, goto 4
    //          9. If deltaV slope <0, chunkMin = Testpoint, goto 4
    //          10.If deltaV slope ~=0, Found minimum deltaV!
    //
    // Idea2 - Global Binary Tree solver
    // Idea3 - Modified Lambert Solver?

    var object1 = orbit1.getElements();
    var object2 = orbit2.getElements();

    var periodSmall = Math.min(
                             object1.T  //either full orbit of departure object
                            ,object2.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1.T  //either full orbit of departure object
                            ,object2.T  //or the full orbit of target object
                            );


    var chunkSize = periodSmall;
    var chunkCount = Math.ceil(periodLarge / chunkSize);  // We will include the entirety of last chunk, even if that chunk extends past periodLarge


    var departTimeMin = 0;
    var departTimeMax = chunkSize * chunkCount;
    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;


    //Cycle through each Chunk and determine its approximate minima to identify chunk with preferred




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
