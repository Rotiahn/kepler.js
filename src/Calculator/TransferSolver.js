/** A collection of Transfer Solvers
 * @author Rotiahn / https://github.com/Rotiahn/
 * @namespace kepler.transferSolver
 */
KEPLER.TransferSolver = {};

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
    var object1 = orbit1.getElements();
    var object2 = orbit2.getElements();

    var departTimeMin = 0;
    var departTimeMax = Math.min(
                             object1.T  //either full orbit of departure object
                            ,object2.T  //or the full orbit of target object
                            );
    var travelTimeMin = 1;
    var travelTimeMax = Math.max(
                             object1.T  //either full orbit of departure object
                            ,object2.T  //or the full orbit of target object
                            );

//Need a mechanism for optimizing non-coplanar comparisons.
// Idea1 - Break into 10 chunks, find best, then 10 chunks, etc.
// Idea2 - Binary solver
// Idea3 - Modified Lambert Solver?

//There will be local minima (based on behavior of smaller orbit), but best minima will be best local minimum for particular position of larger orbit.


	var joptions=[];
	for (var j=departTimeMin; j<=departTimeMax; j++) {
        options=[];
        for (var i=travelTimeMin; i<=travelTimeMax; i++) {
            var time1=j;
            var time2=j+i;
            var transfer = new KEPLER.Transfer(orbit1,orbit1,i);
            options.push(transfer);
            //console.log(j,i,transfer.delta_v)
        }
        var best = options[0];
        for (var i=0;i < options.length;i++) {
            if (options[i].delta_v <= best.delta_v) {best = options[i];};
        }
        joptions.push(best);
    }
    var jbest = joptions[0];
    for (var j=0;j<joptions.length;j++) {
        if (joptions[j].delta_v <= jbest.delta_v) {jbest = joptions[j];};
    }
    return jbest;


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
