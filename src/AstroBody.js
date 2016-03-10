/** A function for creating AstroBody objects
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * @classdesc AstroBody is the root class for any object (such as Planets, Moons, Spacecraft)
 * @param {number} mass - the mass (in kg) of the AstroBody being created.
 * @param {KEPLER.Orbit} orbit - the Orbit object for this AstroBody.
 * @example
 * //Gives an AstroBody for the Sun at the center of the solar System
 * EXAMPLE.Sol = new KEPLER.AstroBody(KEPLER.SOL_MASS,new KEPLER.NULL_ORBIT());
 * @example
 * //Gives an AstroBody for the Earth orbiting the sun
 * EXAMPLE.Earth = new KEPLER.AstroBody(
 *     5.97219e24                               //mass
 *     ,new KEPLER.Orbit(
 *         EXAMPLE.Sol                         //Primary
 *         ,1.000371833989169e+00*KEPLER.AU    //a
 *         ,1.704239716781501e-02              //ecc
 *         ,3.581891404220149e+02*KEPLER.DEGREE//mAnomaly
 *         ,2.669113820737183e-04*KEPLER.DEGREE//rotI
 *         ,2.977668064579176e+02*KEPLER.DEGREE//rotW
 *         ,1.639752443600624e+02*KEPLER.DEGREE//rotOmeg
 *     )
 * );
 * @module kepler
 */
KEPLER.AstroBody = function(mass,orbit) {

    //Part I: Declare Members
    /** Mass of this AstroBody
    * @member {number}
    * @public
    */
    this.mass = mass;       // (kg)
    /** AstroBody's orbit (kept private to avoid direct interaction)
    * @member {KEPLER.Orbit}
    * @private
    */
    var orbit = orbit;
    /** List (Array) of KEPLER.AstroBody listing those AstroBodys which have this AstroBody as a primary
    * @member {array}
    * @private
    */
    this.satellites = [];
    /** Primary of AstroBody (The AstroBody around which this AstroBody is orbiting
    * @member {KEPLER.AstroBody}
    * @public
    */
    this.primary = orbit.primary;

    //Part II: Connect Orbit Functions

    /** @borrows KEPLER.Orbit.getElements as getElements */
    this.getElements = function() {
        return orbit.getElements()
    };
    /** @borrows KEPLER.Orbit.getPosition as getPosition */
    this.getPosition = function() {
        return orbit.getPosition()
    };
    /** @borrows KEPLER.Orbit.getVelocity as getVelocity */
    this.getVelocity = function() {
        return orbit.getVelocity()
    };
    /** @borrows KEPLER.Orbit.addTime as addTime */
    this.addTime = function() {
        return orbit.addTime()
    };
    /** @borrows KEPLER.Orbit.subTime as subTime */
    this.subTime = function() {
        return orbit.subTime()
    };


}//end of Astro_Body() definition
