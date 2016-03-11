/** A collection of example Celestial Bodies using this library
 * @author Rotiahn / https://github.com/Rotiahn/
 * All elements are based on J2000 start (i.e. 2000-Jan-01 00:00:00.0000 TDB)
 * @see {@link http://ssd.jpl.nasa.gov/horizons.cgi} JPL HORIZONS Web Interface
 *
 */

var EXAMPLE = {};

EXAMPLE.Sol = new KEPLER.AstroBody(
     'Sol'
    ,KEPLER.SOL_MASS
    ,new KEPLER.NULL_ORBIT()
);

EXAMPLE.Mercury = new KEPLER.AstroBody(
     'Mercury'
    ,3.302e23                                //mass
    ,new KEPLER.Orbit(
        EXAMPLE.Sol                         //Primary
        ,3.870982252717257e-01*KEPLER.AU    //a
        ,2.056302512089075e-01              //ecc
        ,1.727497133778637e+02*KEPLER.DEGREE//mAnomaly
        ,7.005014199657344e+00*KEPLER.DEGREE//rotI
        ,2.912428058698772e+01*KEPLER.DEGREE//rotW
        ,4.833053756455964e+01*KEPLER.DEGREE//rotOmeg
    )
);

EXAMPLE.Venus = new KEPLER.AstroBody(
     'Venus'
    ,4.8685e24                               //mass
    ,new KEPLER.Orbit(
        EXAMPLE.Sol                         //Primary
        ,7.233268496749391e-01*KEPLER.AU    //a
        ,6.755697267164094e-03              //ecc
        ,4.931425178852966e+01*KEPLER.DEGREE//mAnomaly
        ,3.394589632336535e+00*KEPLER.DEGREE//rotI
        ,5.518541455452200e+01*KEPLER.DEGREE//rotW
        ,7.667837563371675e+01*KEPLER.DEGREE//rotOmeg
    )
);

EXAMPLE.Earth = new KEPLER.AstroBody(
     'Earth'
    ,5.97219e24                               //mass
    ,new KEPLER.Orbit(
        EXAMPLE.Sol                         //Primary
        ,1.000371833989169e+00*KEPLER.AU    //a
        ,1.704239716781501e-02              //ecc
        ,3.581891404220149e+02*KEPLER.DEGREE//mAnomaly
        ,2.669113820737183e-04*KEPLER.DEGREE//rotI
        ,2.977668064579176e+02*KEPLER.DEGREE//rotW
        ,1.639752443600624e+02*KEPLER.DEGREE//rotOmeg
    )
);

EXAMPLE.Luna = new KEPLER.AstroBody(
     'Luna'
    ,734.9e20                                //mass
    ,new KEPLER.Orbit(
        EXAMPLE.Earth                       //Primary
        ,3.812186882902056e5*KEPLER.KM      //a
        ,6.476694137484437e-02              //ecc
        ,1.407402568949268e+02*KEPLER.DEGREE//mAnomaly
        ,5.240010960708354e+00*KEPLER.DEGREE//rotI
        ,3.081359025079810e+02*KEPLER.DEGREE//rotW
        ,1.239837037681769e+02*KEPLER.DEGREE//rotOmeg
    )
);

EXAMPLE.Mars = new KEPLER.AstroBody(
     'Mars'
    ,6.4185e23                               //mass
    ,new KEPLER.Orbit(
        EXAMPLE.Sol                         //Primary
        ,1.523678184302188e+00*KEPLER.AU    //a
        ,9.331460653723893e-02              //ecc
        ,1.909450886999620e+01*KEPLER.DEGREE//mAnomaly
        ,1.849876609221010e+00*KEPLER.DEGREE//rotI
        ,2.865373577554387e+02*KEPLER.DEGREE//rotW
        ,4.956199966373916e+01*KEPLER.DEGREE//rotOmeg
    )
);

EXAMPLE.Phobos = new KEPLER.AstroBody(
     'Phobos'
    ,1.08e20                                 //mass
    ,new KEPLER.Orbit(
        EXAMPLE.Mars                        //Primary
        ,9.378286882214712e+03*KEPLER.KM    //a
        ,1.541577713745092e-02              //ecc
        ,3.458103658779790e+02*KEPLER.DEGREE//mAnomaly
        ,2.605134469392531e+01*KEPLER.DEGREE//rotI
        ,3.423765589430989e+02*KEPLER.DEGREE//rotW
        ,8.481060423679303e+01*KEPLER.DEGREE//rotOmeg
    )
);

EXAMPLE.Deimos = new KEPLER.AstroBody(
     'Deimos'
    ,1.80e20
    ,new KEPLER.Orbit(
        EXAMPLE.Mars                        //Primary
        ,2.345888830758717e+04*KEPLER.KM    //a
        ,2.419395670375644e-04              //ecc
        ,2.441640161731743e+02*KEPLER.DEGREE//mAnomaly
        ,2.757017394063173e+01*KEPLER.DEGREE//rotI
        ,1.902368646630796e+02*KEPLER.DEGREE//rotW
        ,8.366378692998410e+01*KEPLER.DEGREE//rotOmeg
    )
);


EXAMPLE.voyager1 = new KEPLER.Spacecraft(
     'Deimos'                               //id
    ,722                                    //mass
    ,10                                     //fuelMax
    ,3369                                   //exhaustV
    ,new KEPLER.Orbit(
        EXAMPLE.Sol                        //Primary
        ,-3.220924861390099E+00*KEPLER.AU    //a
        ,3.707585664603564E+00              //ecc
        ,1.248081698810124E+03*KEPLER.DEGREE//mAnomaly
        ,3.581757543323521E+01*KEPLER.DEGREE//rotI
        ,3.379563327150580E+02*KEPLER.DEGREE//rotW
        ,1.792513338910511E+02*KEPLER.DEGREE//rotOmeg
    )
);
