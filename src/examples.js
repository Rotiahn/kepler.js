/** A collection of example Celestial Bodies using this library
 * @author Rotiahn / https://github.com/Rotiahn/
 *
 */

var EXAMPLE = {};

EXAMPLE.Sol = new KEPLER.AstroBody(KEPLER.SOL_MASS);
EXAMPLE.Sol.orbit = new KEPLER.NULL_ORBIT;

EXAMPLE.Earth = new KEPLER.AstroBody(5.97219e24);
EXAMPLE.Earth.orbit = new KEPLER.Orbit(
    EXAMPLE.Sol                         //Primary
    ,0.99196459869394*KEPLER.AU         //a
    ,0.01242306592274693                //ecc
    ,72.10170659940029*KEPLER.DEGREE    //mAnomaly
    ,0.01023176935583496*KEPLER.DEGREE  //rotI
    ,209.9698129670859*KEPLER.DEGREE    //rotW
    ,239.0197599202685*KEPLER.DEGREE    //rotOmeg
);