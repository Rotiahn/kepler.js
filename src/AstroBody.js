/** A function for creating AstroBody objects
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * @classdesc AstroBody is the root class for any object (such as Planets, Moons, Spacecraft)
 * @param {number} mass - the mass (in kg) of the AstroBody being created.
 * @module kepler
 */
KEPLER.AstroBody = function(mass) {

    /** @member {number}  */
    this.mass = mass;       // (kg)

}//end of Astro_Body() definition
