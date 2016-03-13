/** A function for creating AstroBody objects
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * @classdesc AstroBody is the root class for any object (such as Planets, Moons, Spacecraft)
 * @param {string} id - the ID of the AstroBody being created.
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
KEPLER.AstroBody = function(id,mass,orbit) {

    //Part I: Declare Members
    /** ID of this AstroBody
    * @member {string}
    * @public
    */
    this.id = id;
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
    //Add this Astrobody as a satellite to its primary
    this.primary.addSatellite(this);

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
    /** Create a new (clone) AstroBody with the same parameters at this one, and return it.
    * @function clone
    * @returns {KEPLER.AstroBody} - Returns a new KEPLER.AstroBody with the same parameters as this one.  The orbits will also be separate objects.
    * @example
    * //Returns AstroBodyB is a copy of AstroBodyA, but different objects
    * AstroBodyA = new KEPLER.AstroBody('1',50*KEPLER.TONNE,new KEPLER.Orbit({mass:KEPLER.SOL},100e3,0,0,0,0));
    * AstroBodyB = AstroBodyA.clone();
    * AstroBodyA === AstroBodyB; //false
    * //All True:
    * for (key in Object.keys(orbitA.getElements())) {console.log(key,':',(orbitA.getElements()[key]===orbitB.getElements()[key]));};
    * @public
    */
    this.clone = function() {
        //Part I: gather Orbital Elements
        //this.updateAllElements();
        var elements = this.getElements();
        var id = this.id;
        var mass = this.mass;
        var satellites = this.satellites;

        //Part II: Create clone of Orbit
        var cloneOrbit = new KEPLER.Orbit(
             this.primary
            ,elements.a
            ,elements.ecc
            ,elements.mAnomaly
            ,elements.rotI
            ,elements.rotW
            ,elements.rotOmeg
        );

        //Part III: Clone Astrobody
        var cloneAstroBody = new KEPLER.AstroBody(id,mass,cloneOrbit);
        satellites.forEach(function(satellite) {
            cloneAstroBody.addSatellite(satellite.clone());
        });
        return cloneAstroBody;
    }

    //Part III: AstroBody Functions
    /** Add satellite
    * @function addSatellite
    * @param {KEPLER.AstroBody} satellite
    * @public
    */
    this.addSatellite = function(satellite) {
        this.satellites.push(satellite);
    }
    /** Remove satellite
    * Only satellites which are pointers to exactly the same object will be removed.
    * Satellites which are different, but identical values will not be removed
    * @function removeSatellite
    * @param {KEPLER.AstroBody} satellite
    * @public
    */
    this.removeSatellite = function(satellite) {
        this.satellites = this.satellites.filter(function(x) {
            return x !== satellite;
        });
    }


}//end of Astro_Body() definition
