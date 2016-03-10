/** A function for creating Spacecraft objects
 * A Spacecraft is an AstroBody which can use fuel to change its orbit.
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * @classdesc AstroBody is the root class for any object (such as Planets, Moons, Spacecraft)
 * @param {string} id - the ID of the Spacecraft being created.
 * @param {number} mass - the DRY mass (in kg) of the Spacecraft being created.
 * @param {number} fuel - the mass (in kg) of the total fuel being carried by the Spacecraft
 * @param {number} exhaustV - Engine ISP (m/s) = the effective exhaust velocity of the Spacecraft engine = Thrust (Newtons) / fuelRate (kg/s)
 * @param {KEPLER.Orbit} orbit - the Orbit object for this AstroBody.
 * @module kepler
 */
KEPLER.Spacecraft = function(id,mass,fuel,exhaustV,orbit) {
    //Part I: Build AstroBody
    KEPLER.AstroBody.call(this,id,mass,orbit);

    //Part II: Spacecraft Specifics

}