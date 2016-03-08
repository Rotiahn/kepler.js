/** A function for creating AstroBody objects
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * @classdesc AstroBody is the root class for any object (such as Planets, Moons, Spacecraft)
 * @param {number} mass - the mass (in kg) of the AstroBody being created.
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
