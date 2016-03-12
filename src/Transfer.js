/** A function for creating orbital transfer objects
 * A Transfer contains three Orbits: A start Orbit, a final Orbit and the intermediate transfer Orbit.
 * It also contains Thrust vector and delta-V requirement components
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * @classdesc Transfers contain all information to describe the orbital transfer from one Orbit to another
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @param {number} duration - the amount of time (s) the transfer orbit should take
 * @module kepler
 */

KEPLER.Transfer = function (orbit1,orbit2,duration) {
    //check that orbit1 and orbit2 have same primary
    if (orbit1.primary !== orbit2.primary) {throw 'Cannot create Transfer from Orbiting '+orbit1.primary+' to orbiting '+orbit2.primary;};

	var vectors = KEPLER.Lambert(orbit1,orbit2,duration);  // m/s
	if (vectors === -1) {
        //console.log("this orbital transfer is not solveable with these times, breaking",time1,time2);
        return -1;
	}

    //Create Local instances of orbits at departure and arrival
	var object1 = orbit1.clone();
    var object2 = orbit2.clone();
    object2.addTime(duration);

	var origin_v = object1.getVelocity();  // m/s
	var target_v = object2.getVelocity();  // m/s

	var thrust_departure = vectors.departure.clone()
	thrust_departure.sub(origin_v);  // km/s

	var thrust_arrival = vectors.arrival.clone()
	thrust_arrival.sub(target_v);  // km/s

	var thrust = {
					 departure: thrust_departure
					,arrival: thrust_arrival
					};
	var delta_v = thrust.departure.length() + thrust.arrival.length();

	var transfer = {
					 object1: 	object1
					,object2: 	object2
					,object1_v:	origin_v
					,object2_v:	target_v
					,duration: 	duration
					,vector1:	vectors.departure
					,vector2:	vectors.arrival
					,thrust1:	thrust.departure
					,thrust2:	thrust.arrival
					,delta_v:	delta_v
					}
	return transfer;


}
