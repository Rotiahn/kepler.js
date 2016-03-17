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
// Idea1 -  Chunks + newton solver:
//          1. Break into X chunks, where X = (larger Period / smaller period) = travelTimeMax / departTimeMax
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

	    //deltaV = v_initial.length() + v_final.length()
	    //v_initial = (r_final - f*r_initial)/g
	    //d(v_initial)/dz = (r_final - df/dz * r_initial) / dg/dz

	    //f = 1 - y/r_initial_length
	    //y = r_initial + r_final + (A/Math.sqrt(C))*(z*S - 1)
	    //dy/dz = 0     + 0       + (A/Math.sqrt(C))*(S)
	    //dy/dz = (A/Math.sqrt(C))*(S)
        //df/dz = df/dy * dy/dz
	    //df/dz = -(1/r_initial_length)(dy/dz)
	    //df/dz = -(1/r_initial_length)((A/Math.sqrt(C))*(S))

        //g = A*Math.sqrt(y/mu) = A*(y^0.5)(mu^-0.5)
        //dg/dz = dg/dy * dy/dz =  (A/Math.sqrt(mu))*((1/2)*y^-0.5) * (A/Math.sqrt(C))*(S)
        //dg/dz = (S*A^2 / Math.sqrt(C*mu) ) * (1/Math.sqrt(y))

        //y is at an extrema if A=0, C=0 OR S=0
        //f is at an extrema if A=0, OR S=0
        //g is at an extrema if A=0, S=0 OR y=0

	    //v_initial = (r_final - f*r_initial)/g
	    //v_initial = (r_final - f*r_initial)*(g^-1)
	    //v_initial =  r_final*(g^-1) - f*r_initial*(g^-1)
	    //d(v_initial)/dz = d(v_initial)/dg * dg/dz
	    //d(v_initial)/dz = (-1*r_final*(g^-2) - ( (-1)*f*r_initial*(g^-2) + (df/dg)*r_initial*(g^-1) )) * (dg/dz)
	    //df/dg = df/dz * dz/dg = df/dz * dz/dy * dy/dg

	    //y = r_initial_length + r_final_length + (A/Math.sqrt(C))*(z*S - 1)
	    //y-(r_initial_length + r_final_length) = (A/Math.sqrt(C))*(z*S - 1)
	    // ( y-(r_initial_length + r_final_length) ) / (A/Math.sqrt(C)) = (z*S - 1)

	    // 1+ ( y-(r_initial_length + r_final_length) ) / (A/Math.sqrt(C)) = (z*S)
	    // z = 1/S + ( y-(r_initial_length + r_final_length) ) / ((S*A)/Math.sqrt(C))
        // dz/dy = (1/ ((S*A)/Math.sqrt(C))

        //g = A*Math.sqrt(y/mu)
        //g/A = Math.sqrt(y/mu)
        // ( g/A )^2 = y/mu
        // y = (mu*g^2)/A^2
        //dy/dg = 2*(mu*g)/A^2

        //df/dg = df/dz * dz/dy * dy/dg
        //df/dg = -(1/r_initial_length)((A/Math.sqrt(C))*(S)) * (1/ ((S*A)/Math.sqrt(C)) * 2*(mu*g)/A^2
        //df/dg = -(1/r_initial_length)((A/Math.sqrt(C))*(S)) * (Math.sqrt(C)/ ((S*A)) * 2*(mu*g)/A^2
        //df/dg = (1/(A^2)) * (4) * ( -((mu*g)/r_initial_length) )
        //df/dg = ((4/(A^2)) * ( -((mu*g)/r_initial_length) ))

	    //d(v_initial)/dz = (-1*r_final_length*(g^-2) - ( (-1)*f*r_initial_length*(g^-2) + ( (4/(A^2))*(-((mu*g)/r_initial_length)) )*r_initial_length*(g^-1) )) * (dg/dz)
	    //d(v_initial)/dz = (-1*r_final_length*(g^-2) - ( (-1)*f*r_initial_length*(g^-2) + ( (4/(A^2))*(-(mu*g)) )*(g^-1) )) * (dg/dz)
	    //d(v_initial)/dz = (-1*r_final_length*(g^-2) + ( f*r_initial_length*(g^-2) + ( (-4/(A^2))*(-(mu)) ) )) * (dg/dz)
	    //d(v_initial)/dz = (-1*r_final_length*(g^-2) + ( (1 - y/r_initial_length)*r_initial_length*(g^-2) + ( (-4/(A^2))*(-(mu)) ) )) * (dg/dz)
	    //d(v_initial)/dz = (-1*r_final_length*(g^-2) + ( (r_initial_length*(g^-2) - r_initial_length*(g^-2)*(y/r_initial_length)) + ( (-4/(A^2))*(-(mu)) ) )) * (dg/dz)
	    //d(v_initial)/dz = (-1*r_final_length*(g^-2) + (r_initial_length*(g^-2) - (g^-2)*(y)) + (-4/(A^2))*(-(mu)) ) * (dg/dz)
	    //d(v_initial)/dz = ( (r_initial_length - r_final_length)*(g^-2) - (g^-2)*(y)) + (-4/(A^2))*(-(mu)) ) * (dg/dz)

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
