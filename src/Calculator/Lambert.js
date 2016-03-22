/** A function for calculating thrust actions necessary for orbital transfers
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit
 * @param {number} duration - the amount of time (s) the transfer orbit should take
 * @returns {object} thrustVectors - an object containing the two thrust vectors (departure and arrival) necessary to transfer from Orbit1 to Orbit2
 * @see Rodney L. Anderson, “Solution of the Lambert Problem using Universal Variables”
 * @see Bate, Roger R., D.D. Mueller, and J.E. White, Fundamentals of Astrodynamics, New Dover Publications, New York, 1971
 * @module kepler
 */

KEPLER.Lambert = function(orbit1,orbit2,duration) {

    //check that orbit1 and orbit2 have same primary
    if (orbit1.primary !== orbit2.primary) {throw 'Cannot use lambert solver to find path from Orbiting '+orbit1.primary+' to orbiting '+orbit2.primary;};

    //Create Local instances of orbits at departure and arrival
    var object1 = orbit1.clone();
    var object2 = orbit2.clone();
    object2.addTime(duration);

	var r_initial = object1.getPosition();
	var r_final = object2.getPosition();

	var r_initial_length = r_initial.length();
	var r_final_length = r_final.length();

	var t_delta = duration;
	var DM = +1;  //Needs to be +1 (posigrade transfer) or -1 (retrograde transfer) based on direction of motion, currently arbitrarily assigning to +1

	//  cos(delta_nu) = ( r_initial dot.product r_final ) / (r_initial_length * r_final_length )
	//                =         m     *           m       /    m           *     m
	//      unitless  =                      m^2          /            m^2
	//  cos(delta_nu) = ( r_initial.dot(r_final) ) / ( r_initial_length * r_final_length )
	//
	//  A = DM * sqrt( r_initial_length * r_final_length * ( 1 + cos(delta_nu) ) )
	//    =      sqrt(      m        *      m      *          unitless     )
	//  km=      sqrt(                 m^2                                 )
	//  A = DM * sqrt( r_initial_length * r_final_length * ( 1 + ( r_initial.dot(r_final) ) / ( r_initial_length * r_final_length ) )
	//  A = DM * sqrt( r_initial_length * r_final_length + ( r_initial.dot(r_final) ) )
	//

	var A =  DM * Math.sqrt( (r_initial_length * r_final_length) + ( r_initial.dot(r_final) ) )  //m
	if (A===0) {return 0 }; //not solveable

	//initialize
	var z = 0.0;
	var C = 1/2;
	var S = 1/6;
	var z_up = 4 * Math.PI * Math.PI;
	var z_low = -4 * Math.PI;
	var t = 0;
	var y = 0;
	var x = 0;
	var i = 0;

	var mu = orbit1.getElements().mu;

	//Loop
	while ( Math.abs( t - t_delta) > 1 ) {
		y = r_initial_length + r_final_length + (( A * ((z * S) - 1) )/( Math.sqrt(C) )) ; //m
	//  m =         m          +       m          + ( m * (   unitless) )/( unitless     )
		if ( A>0.0 && y<0.0 ) {
			//increment z_low until y >0.0
			y = 0;
		};
		x = Math.sqrt( y / C );
	//	m^(1/2)=  sqrt  (m / unitless)
		t = ( (Math.pow(x,3) * S) + (A * Math.sqrt(y)) ) / ( Math.sqrt(mu) )
	//  s = ( (km^(3/2)*unitless) + (m * sqrt( m )   ) ) / (sqrt (m^3/s^2 )
	//  s = ( (                m^(3/2)                   / (m^(3/2)  * 1/s  )
	//  s = (    1   /  (1/s)
	//  s = (   s    )
		if (t <= t_delta) {
			z_low = z;
		} else {
			z_up = z
		};

		z = (z_up + z_low) / 2;

		if (z > 0.000001) {
			//Transfer orbit is looking parabolic
			C = ( 1.0 - Math.cos(Math.sqrt(z)) ) / ( z );
			S = ( Math.sqrt(z) - Math.sin(Math.sqrt(z)) ) / ( Math.pow(z,3/2) );
		} else if (z < -0.000001) {
			//Transfer orbit is looking hyperbolic
			C = ( 1.0 - Math.cosh(Math.sqrt(-z)) ) / ( z );
			S = ( Math.sinh(Math.sqrt(-z)) - Math.sqrt(-z) ) / ( Math.pow(-z,3/2) );
		} else {
			C = 0.5;
			S = 1/6;
		};
		i++
		//console.log(Math.abs( t-t_delta));
		if (i>150) {
		    //console.log("Lambert solver exceeded 150 iterations; Breaking",duration);
		    //throw 'Lambert solver exceeded 150 iterations; Breaking '+duration
		    return -1;
		};
	};
	var f =  1 - ( y / r_initial_length );  //km/km = no unit
	var dg = 1 - ( y / r_final_length );    //km/km = no units
	var g = A * Math.sqrt( y / mu );    // km * sqrt(km / km^3/s^2) = km * sqrt(km^2/s^2) = km * km/s = km^2/s

	var v_initial = new THREE.Vector3(0,0,0);
	var fr_initial = new THREE.Vector3(0,0,0);
	fr_initial.copy(r_initial);
	fr_initial.multiplyScalar(f);
	v_initial.subVectors(r_final,fr_initial).divideScalar(g); //in km/s
	//console.log("v_initial = "+v_initial.length());

	var v_final = new THREE.Vector3(0,0,0);
	var dgr_final = new THREE.Vector3(0,0,0);
	dgr_final.copy(r_final);
	dgr_final.multiplyScalar(dg);
	v_final.subVectors(dgr_final,r_initial).divideScalar(g); //in km/s
	//console.log("v_final = "+v_final.length());

	//v_delta = v_final.length() + v_final.length();  //in km/s
	//console.log("v_delta = "+v_delta);

	var vectors = {
					 departure:	v_initial
					,arrival:	v_final
					};

	return vectors;

}//end of lambert definition
