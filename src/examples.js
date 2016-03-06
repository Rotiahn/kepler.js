/** A collection of example Celestial Bodies using this library
 * @author Rotiahn / https://github.com/Rotiahn/
 * All elements are based on J2000 start (i.e. 2000-Jan-01 00:00:00.0000 TDB)
 * @see {@link http://ssd.jpl.nasa.gov/horizons.cgi} JPL HORIZONS Web Interface
 *
 */

var EXAMPLE = {};

EXAMPLE.Sol = new KEPLER.AstroBody(KEPLER.SOL_MASS);
EXAMPLE.Sol.orbit = new KEPLER.NULL_ORBIT;

EXAMPLE.Earth = new KEPLER.AstroBody(5.97219e24);
EXAMPLE.Earth.orbit = new KEPLER.Orbit(
    EXAMPLE.Sol                         //Primary
    ,1.000371833989169e+00*KEPLER.AU    //a
    ,1.704239716781501e-02              //ecc
    ,3.581891404220149e+02*KEPLER.DEGREE//mAnomaly
    ,2.669113820737183e-04*KEPLER.DEGREE//rotI
    ,2.977668064579176e+02*KEPLER.DEGREE//rotW
    ,1.639752443600624e+02*KEPLER.DEGREE//rotOmeg
);

EXAMPLE.Moon = new KEPLER.AstroBody(734.9e20);
EXAMPLE.Moon.orbit = new KEPLER.Orbit(
    EXAMPLE.Earth                       //Primary
    ,3.812186882902056e5*KEPLER.KM      //a
    ,6.476694137484437e-02              //ecc
    ,1.407402568949268e+02*KEPLER.DEGREE//mAnomaly
    ,5.240010960708354e+00*KEPLER.DEGREE//rotI
    ,3.081359025079810e+02*KEPLER.DEGREE//rotW
    ,1.239837037681769e+02*KEPLER.DEGREE//rotOmeg
);
