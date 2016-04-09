

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/Kepler.js

/** A library for handling orbital mechanics math and calculations
 * @author Rotiahn / https://github.com/Rotiahn/
 * @namespace kepler
 */

var KEPLER = { VERSION: '0.0.7' };


//CONSTANTS

////LENGTH

/**@constant {string}  */
KEPLER.UNIT_LENGTH = 'meter';

/**@constant {number}  */
KEPLER.MAX_SAFE_LENGTH = Number.MAX_SAFE_INTEGER; // 9007199254740991 m ~= 0.95 light years

/**@constant {number}  */
KEPLER.KILOMETER = KEPLER.KM = 1000;

/**@constant {number}  */
KEPLER.AU = 1.496e+11;

/**@constant {number}  */
KEPLER.LIGHT_SECOND = 2.998e+8;

/**@constant {number}  */
KEPLER.LIGHT_MINUTE = 1.799e+10;

/**@constant {number}  */
KEPLER.LIGHT_HOUR = 1.079e+12;

/**@constant {number}  */
KEPLER.LIGHT_DAY = 2.59e+13;

/**@constant {number}  */
KEPLER.LIGHT_YEAR = 9.461e+15;


////TIME

/**@constant {string}  */
KEPLER.UNIT_TIME = 'second';

/**@constant {number}  */
KEPLER.MAX_SAFE_TIME = Number.MAX_SAFE_INTEGER; // 9007199254740991 s ~= 285 Million light years

/**@constant {number}  */
KEPLER.MINUTE = 60;

/**@constant {number}  */
KEPLER.HOUR = 3600;

/**@constant {number}  */
KEPLER.DAY = 86400;

/**@constant {number}  */
KEPLER.YEAR = 3.154e+7;


////ROTATION

/**@constant {string}  */
KEPLER.UNIT_ROTATION = 'Radians';

/**@constant {number}  */
KEPLER.DEGREE = 0.0174533;

/**@constant {number}  */
KEPLER.PI = Math.PI;

/**@constant {number}  */
KEPLER.DEGREES_PER_DAY = KEPLER.DEGREE / KEPLER.DAY;


////MASS

/**@constant {string}  */
KEPLER.UNIT_mass = 'Kilograms';

/**@constant {number}  */
KEPLER.TONNE = KEPLER.TON = 1000;

/**@constant {number}  */
KEPLER.EARTH_MASS = 5.974e24;

/**@constant {number}  */
KEPLER.SOL_MASS = 1.9891e30;


////GRAVITATIONAL CONSTANT

/**@constant {number}  */
KEPLER.G = 6.674e-11; //Nm^2 / kg^2 = kg*m*(1/s^2)*m^2*(1/kg^2) = m^3/(kg*s^2)

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/external/external.js

/** A Reference to the Vector3 class from Three.js
 * @author Rotiahn / https://github.com/Rotiahn/
 * @borrows THREE.Vector3 as KEPLER.Vector3
 * @module kepler
 */

KEPLER.Vector3 = THREE.Vector3;

/** A Reference to the Matrix4 function from Three.js
 * @author Rotiahn / https://github.com/Rotiahn/
 * @borrows THREE.Matrix4 as KEPLER.Matrix4
 * @module kepler
 */

KEPLER.Matrix4 = THREE.Matrix4;

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/AstroBody.js

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
    * @protected - orbit is accessible, and orbit functions are readable, however cannot directly change orbit to new value;
    */
    var orbit = orbit;
    Object.defineProperties(this, {
        orbit: {
             enumerable: true
            ,value: orbit
        }
    });
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

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/Orbit.js

/** A Class to represent an Orbit around a particular AstroBody
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * classdesc Orbit is a class for defining orbit parameters and characteristics useful to all AstroBodys
 * @param {AstroBody}   primary     - The AstroBody around which this orbit exists
 * @param {number}      a           - The semi-major axis of the orbit in meters
 * @param {number}      ecc         - The eccentricity of the orbit
 * @param {number}      mAnomaly    - The Mean Anomaly of the oribt
 * @param {number}      rotI        - The inclination of the orbit (rotation of plane from horizontal)
 * @param {number}      rotW        - The Argument of perifocus (rotation of orbit around normal of its inclined plane)
 * @param {number}      rotOmeg     - The Longitude of Ascending Node (rotation of orbital plane around vertical axis)
 * @example
 * //returns circular orbit of earth
 * var earthOrbit = new KEPLER.Orbit({mass:KEPLER.SOL_MASS},KEPLER.AU,0,0,0,0);
 * @module kepler
 */
KEPLER.Orbit = function(primary,a,ecc,mAnomaly,rotI,rotW,rotOmeg) {
	//This is an object which represents an orbit for an AstroBody

    //Part I: Initialization values:

    //Part Ia: System level inputs:
    /**
    * @member {AstroBody} primary - The AstroBody around which this orbit exists
    * @public
    */
    this.primary = primary; //Astrobody

    //Part Ib: Orbital Elements

    /**
    * @member {number} a - Semi-major axis, a (m)
    * @member {number} ecc         - ()      Eccentricity, e                     ; circular: ecc=0,      eliptical: 0<ecc<1, parabolic: ecc=1,       hyperbolic: e>1
    * @member {number} mAnomaly    - (rad)   Mean anomaly, M                     ;
    * @member {number} rotI        - (rad)   Inclination w.r.t xy-plane, i       ;
    * @member {number} rotW        - (rad)   Argument of Perifocus, w            ;
    * @member {number} rotOmeg     - (rad)   Longitude of Ascending Node, OMEGA  ;
    * @member {number} mu          - (m^3/s^2) Standard Gravitational Parameter  ;
    * @member {number} peri        - (m)     Periapsis distance, q               ;
    * @member {number} apo         - (m)     Apoapsis distance                   ;
    * @member {number} T           - (s)     Sidereal orbit period               ;
    * @member {number} meanMotion  - (rad/s) Mean motion, n                      ;
    * @member {number} periT       - (s)     Time of periapsis                   ;
    * @private
    */

    //mandatory to define position at point in time.
    var a           = a;        // Semi-major Axis
    var ecc         = ecc;      // Eccentricity
    var mAnomaly    = mAnomaly; // M, Mean Anomaly
    var rotI        = rotI;     // angle of inclination
    var rotW        = rotW;     // angle of argument of periapsis
    var rotOmeg     = rotOmeg;  // angle of longitude of ascending node

    //mandatory additional for defining position over time:
    var mu          = KEPLER.G * this.primary.mass;

    //derivable
    var peri        = 0;
    var apo         = 0;
    var T           = 0;
    var meanMotion  = 0;
    var tAnomaly    = 0; // (rad)   True anomaly, nu                    ;
    var periT       = 0; // (s)     time since periapsis, t-t0
    var E           = 0; // (rad)   Eccentric anomaly                   ;

    //NOTES:
    //1. By definition, a (semi-major axis) is undefined for parabolic orbits.
    //  However, by convention we are using a=q in order to make the code simpler




    //Part II: calculation functions:
    //Source: http://www.bogan.ca/orbits/kepler/orbteqtn.html

    /** Calculate Periapsis
    * @function calcualtePeri
    * @returns {number} peri - (m) the periapsis of the orbit based on its orbital elements
    * @private
    */
    var calculatePeri = function() {
        if (ecc < 1) {
            return (1 - ecc) * a;
        } // circular or eliptical
        else if (ecc === 1) {
            //See Note 1.
            return a;
        } // parabolic
        else if (ecc > 1) {
            return (1 - ecc) * a;
        } // hyperbolic
    };
    /** Calculate Apoapsis
    * @function calculateApo
    * @returns {number} apo - (m) the apoapsis of the orbit based on its orbital elements
    * Infinity for parabolic and hyperbolic orbits
    * @private
    */
    var calculateApo = function() {
        if (ecc < 1) {
            return (1 + ecc) * a;
        } // circular or eliptical
        else if (ecc >= 1) {
            return Infinity;
        } // parabolic or hyperbolic
    };
     /** Calculate Period (Sidereal Year)
    * @function calculateT
    * @returns {number} T - (s) The period (sidereal Year) for the orbit.
    * @private
    */
    var calculateT = function() {
        if (ecc < 1) {
            return 2 * KEPLER.PI * Math.pow( ( (a*a*a)/(mu) ) , 0.5);
        } // circular or eliptical
        else if (ecc >= 1) {
            return Infinity;
        } // parabolic or hyperbolic

    };
    /** Calculate Mean Motion
    * @function calculateMeanMotion
    * @returns {number} meanMotion - (rad/s) the Mean motion of the orbiting body
    * @private
    */
    var calculateMeanMotion = function() {
        if (ecc < 1) {
            return Math.pow( ( (a*a*a)/(mu) ) , -0.5);
        } // circular or eliptical
        else if (ecc >= 1) {
            return Infinity;
        } // parabolic or hyperbolic

    };
    /** Calculate True Anomaly
    * @function calculateTAnomaly
    * @returns {number} tAnomaly - (rad) True anomaly, nu
    * @private
    */
    var calculateTAnomaly = function() {
        if (ecc === 0) {
            return mAnomaly;
        } // circular
        else if (ecc < 1) {
            E = calculateE();
            var tAnomaly = 2 * Math.atan2( Math.sqrt( (1+ecc) )* Math.sin( E/2 ) , Math.sqrt( (1-ecc) )* Math.cos( E/2 ) );  //https://en.wikipedia.org/wiki/True_anomaly
            return tAnomaly;
        } // eliptical
        else if (ecc === 1) {
            //var periT = Math.pow( ( (2*a*a*a)/(mu) ) , 0.5) * mAnomaly        //http://www.bogan.ca/orbits/kepler/orbteqtn.html
            //var peri  = a;                                                    //see Note 1 above
            //var A = (3/2) * Math.sqrt(mu / (2 * peri*peri*peri ) ) * (periT)  //https://en.wikipedia.org/wiki/Parabolic_trajectory#Barker.27s_equation
            //var B = Math.cbrt( A + Math.sqrt( (A*A) + 1 ) )                   //https://en.wikipedia.org/wiki/Parabolic_trajectory#Barker.27s_equation
            //var tAnomaly = 2 * arctan (B - 1/B)                               //https://en.wikipedia.org/wiki/Parabolic_trajectory#Barker.27s_equation

            //var mu2p3 = mu/(2*peri*peri*per)

            //var periT = Math.sqrt( 1/mu2p3 ) * mAnomaly
            //var periT = mAnomaly / Math.sqrt( mu2p3 )

            //var A = (3/2) * Math.sqrt( mu2p3 ) * (mAnomaly / Math.sqrt( mu2p3 ) )
            //var A = (3/2) * mAnomaly
            var A = (3/2) * mAnomaly;
            var B = Math.cbrt(  A + Math.sqrt( (A*A) + 1 )  );
            var tAnomaly = 2 * Math.atan( B - (1/B) );

            return tAnomaly;
        } // parabolic
        else if (ecc >= 1) {
            // cosh(F) = (ecc + cos(tAnomaly)) / (1+ecc*cos(tAnomaly))          //http://www.bogan.ca/orbits/kepler/orbteqtn.html
            //Using analogous method as elliptical solution
            E = calculateE();
            var tanh_tAnomaly =  Math.sqrt( (1+ecc) )* Math.sin( E/2 ) / Math.sqrt( (1-ecc) )* Math.cos( E/2 )
            var tAnomaly = 2 * Math.atanh(tanh_tAnomaly);
            return tAnomaly;
        } // hyperbolic

    }
    /** Calculate Time of Periapsis
    * @function calculatePeriT
    * @returns {number} periT - (s) Time of periapsis
    * @private
    */
    var calculatePeriT = function() {
        if (ecc < 1) {
            return Math.pow( ( (a*a*a)/(mu) ) , 0.5) * mAnomaly;
        } // circular or eliptical
        else if (ecc === 1) {
            return Math.pow( ( (2*a*a*a)/(mu) ) , 0.5) * mAnomaly;
        } // parabolic
        else if (ecc > 1) {
            return Math.pow( ( ((-a)*(-a)*(-a))/(mu) ) , 0.5) * mAnomaly;
        } // hyperbolic

    };
    /** Calculate Eccentric anomaly
    * @function calculateE
    * @returns {number} E - (rad)   Eccentric anomaly
    * @private
    */
    var calculateE = function() {
        if (ecc === 0) {
            return mAnomaly;
        } // circular
        else if (ecc < 1) {     // per guidance from Markus
            var M = mAnomaly;
            var E = M;
            var i = 0
            while (Math.abs(E - (ecc * Math.sin(E)) - M) > 0.0000000001) {
                E-= (E - ecc * Math.sin(E) - M) / (1 - ecc * Math.cos(E));
                i++;
                if (i>=1000) {throw 'took too long to determine E for '+this.id;};
            }
            return E;
        } // eliptical
        else if (ecc === 1) {
            //D = tan(tAnomaly/2);
            tAnomaly = calculateTAnomaly();
            var D = Math.tan(tAnomaly/2);
            return D;
            ;
        } // parabolic
        else if (ecc > 1) {
            var M = mAnomaly;
            //M = ecc * sinh(F) - F
            //0 = ecc * sinh(F) - F - M
            var F = M;
            var i = 0
            while (Math.abs((ecc * Math.sinh(F)) - F - M) > 0.0000000001) {
                F-= (ecc * Math.sinh(F) - F - M) / (ecc * Math.cosh(F) - 1);
                i++;
                if (i>=1000) {throw 'took too long to determine E for '+this.id;};
            }
            return F;
            ;
        } // hyperbolic

    };

    /** Update single element
    * @member {object} updateElement
    * @example
    * //updates E (eccentric anomaly)
    * this.updateElement['E']()
    * @public
    */
    this.updateElement = {
         peri        : function() {peri       = calculatePeri();      return peri      ;}
        ,apo         : function() {apo        = calculateApo();       return apo       ;}
        ,T           : function() {T          = calculateT();         return T         ;}
        ,meanMotion  : function() {meanMotion = calculateMeanMotion();return meanMotion;}
        ,tAnomaly    : function() {tAnomaly   = calculateTAnomaly();  return tAnomaly  ;}
        ,periT       : function() {periT      = calculatePeriT();     return periT     ;}
        ,E           : function() {E          = calculateE();         return E         ;}

    };
    /** Update all derivable elements
    * @function updateAllElements
    * @public
    */
    this.updateAllElements = function() {
        this.updateElement.peri();
        this.updateElement.apo();
        this.updateElement.T();
        this.updateElement.meanMotion();
        this.updateElement.tAnomaly();
        this.updateElement.periT();
        this.updateElement.E();
    };
    /** update Orbital Elements based on Cartesian Position and Velocity
    * @function keplerize
    * @param {KEPLER.Vector3} position - Vector of current position
    * @param {KEPLER.Vector3} velocity - Vector of current velocity
    * @see {@link http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf}
    * @private
    */
    var keplerize = function(mu,position,velocity) {
        var r = position.clone(); // m
        var v = velocity.clone(); // m/s

    	//This Function is meant to be used for determining orbits from points and velocities.
    	//It is primarily used for applying velocity changes and calculating resulting new orbital elements
        var ang_momentum = new KEPLER.Vector3(0,0,0);
	    ang_momentum.crossVectors(position,velocity)  // m^2/s

        var rot_omeg 	= Math.atan( ang_momentum.x / (-ang_momentum.y) ); //radians
        var rot_i 		= Math.atan( Math.sqrt(ang_momentum.x*ang_momentum.x + ang_momentum.y*ang_momentum.y) / ang_momentum.z ) //radians

    	//rotate position into orbital frame:
        var r2 = new THREE.Vector3(0,0,0);
	    r2.copy(r); // m

        var axis_omeg = new THREE.Vector3(0,0,1); //radians
        var matrix_omeg = new THREE.Matrix4().makeRotationAxis( axis_omeg, rot_omeg);
        r2.applyMatrix4(matrix_omeg);

        var axis_i = new THREE.Vector3(1,0,0);
        var matrix_i = new THREE.Matrix4().makeRotationAxis( axis_i, rot_i);
        r2.applyMatrix4(matrix_i);

        //determine argument of latitude u, where tan(u) = tan(w+v) = p2/p1
      	var arg_lat = Math.atan(r2.y/r2.x);  //radians

        // a = (GM * r) / (2GM - r*velocity_scalar^2)
        // e = SQRT(1 - (h^2 / (GM*a))

        var mu = mu;  //  m^3/s^2
        var r_scalar = r.length();  // m
        var v_scalar = v.length();  // m
        var h_scalar = ang_momentum.length(); // m^2/s
        var a = (mu * r_scalar) / (2*mu - r_scalar*(v_scalar*v_scalar));  //  m^4/s^2  / (m^3/s^2 - m*m/s*m/s) = m^4/s^2  / m^3/s^2 = m
        var ecc = Math.sqrt(1 - (h_scalar*h_scalar / (mu*a)));  //  m^2/s * m^2/s  / (m^3/s^2 * m) = m^4/s^2 / m^4/s^2 = no units

        // radial velocity = position DOT velocity / position_scalar
        var rad_v = position.dot(velocity) / r_scalar;  //  m*m/s / m = m/s

        // cos(E) = (a-r)/(ae)
        // sin(E) = (r_scalar*rad_v)/(ecc*sqrt(mu*a))
        var sin_E = (a-r_scalar)/(a*ecc);
        var cos_E = (r_scalar*rad_v)/(ecc*Math.sqrt(mu*a));

        // tan(v) = ( sqrt(1-ecc*ecc)*sin_E )/( cos_E - ecc )
        var v = Math.atan( (Math.sqrt(1-ecc*ecc)*sin_E )/( cos_E - ecc ) );  //radians

        // u = w+v = arg_lat
        // w = arg_lat-v
        var rot_w = arg_lat - v; // radians

        // E - ecc*sin(E) = M

        var E = Math.asin(sin_E)  //radians
        var M = E - ecc*sin_E;  //radians

        var elements = {	 'a'       :a
                            ,'ecc'     :ecc
                            ,'mAnomaly':mAnomaly
                            ,'rotI'    :rotI
                            ,'rotW'    :rotW
                            ,'rotOmeg' :rotOmeg
                        };
        return elements;
    }

    //Part III: Get Functions

    /** Get all orbital Elements
    * @function getElements
    * @returns {Object} - Returns an object which includes all orbital elements.
    * @public
    */
    this.getElements = function() {
        this.updateAllElements();
        var retObject = {
             a          :a
            ,ecc        :ecc
            ,mAnomaly   :mAnomaly
            ,rotI       :rotI
            ,rotW       :rotW
            ,rotOmeg    :rotOmeg
            ,mu         :mu
            ,peri       :peri
            ,apo        :apo
            ,T          :T
            ,meanMotion :meanMotion
            ,tAnomaly   :tAnomaly
            ,periT      :periT
            ,E          :E
        };
        return retObject;
    }

    /** Apply Reverse Rotations for Kepler elements -> Cartesian Elements (x,y,z)
    * Used by this.getPosition() and this.getVelocity()
    * NOTE: XY plane is the plane of reference with X+ axis = reference direction and Z+ axis = "north"
    * @function reverseRotations
    * @param {KEPLER.Vector3} vector - the vector (relative to the orbital plane) to be rotated to match the world reference
    * @returns {KEPLER.Vector3} - Returns a KEPLER.Vector3 which defines the position in the orbit in world reference frame (RELATIVE TO PRIMARY)
    * @see {@link http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf}
    * @private
    */
    var reverseRotations = function (vector) {
        //NOTE: XY plane is the (typical) plane of reference with X+ axis = reference direction and Z+ axis = "north"

        //Part I: Rotate orbit around z world-axis by angle -rotW so that periapsis lines up with reference direction
        var axisW = new KEPLER.Vector3(0,0,1);
        var matrixW = new KEPLER.Matrix4().makeRotationAxis( axisW, -rotW);
        vector.applyMatrix4(matrixW);

        //Part II: Rotate orbital plane around x world-axis by angle -rotI so that orbital plane lines up with reference plane
        var axisI = new KEPLER.Vector3(1,0,0);
        var matrixI = new KEPLER.Matrix4().makeRotationAxis( axisI, -rotI);
        vector.applyMatrix4(matrixI);

        //Part III: Rotate orbital plane around z world-axis by angle -rotOmeg so that ascending node lines up with reference direction
        var axisOmeg = new KEPLER.Vector3(0,0,1);
        var matrixOmeg = new KEPLER.Matrix4().makeRotationAxis( axisOmeg, -rotOmeg);
        vector.applyMatrix4(matrixOmeg);

        return vector;
    }
    /** Get Cartesian position (x,y,z)
    * @function getPosition
    * @returns {KEPLER.Vector3} - Returns a KEPLER.Vector3 which defines the position in the orbit (INCORPORATES PRIMARY)
    * @see {@link http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf}
    * @public
    */
    this.getPosition = function() {

        //Part I: Update Orbital Elements
        //this.updateAllElements();
        this.updateElement.E();

        //Part II: Create initial elipse
        var position = new KEPLER.Vector3(
             a*Math.cos(E) -a*ecc
            ,a*Math.sqrt(1-(ecc*ecc))*Math.sin(E)
            ,0
        );

        //Part III: Conduct rotations (reversed):
        var positionFinal = reverseRotations(position);

        //Part IV: Add position vector of primary:
        positionFinal.add(this.primary.getPosition());

        return positionFinal;
    }
    /** Get Cartesian velocity (x,y,z)
    * @function getVelocity
    * @returns {KEPLER.Vector3} - Returns a KEPLER.Vector3 which defines the position in the orbit (INCORPORATES PRIMARY)
    * @see {@link http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf}
    * @public
    */
    this.getVelocity = function() {

        //Part I: Update Orbital Elements
        //this.updateAllElements();
        this.updateElement.E();
        this.updateElement.meanMotion();

        //Part II: Create initial elipse
        var velocity = new KEPLER.Vector3(
             ( (meanMotion*a)/( 1-(ecc*Math.cos(E)) ) )*( -Math.sin(E) )
            ,( (meanMotion*a)/( 1-(ecc*Math.cos(E)) ) )*( Math.sqrt(1-(ecc*ecc))*Math.cos(E) )
            ,0
        );

        //Part III: Conduct rotations (reversed):
        var velocityFinal = reverseRotations(velocity);

        //Part IV: Add position vector of primary:
        velocityFinal.add(this.primary.getVelocity());

         return velocityFinal;
    }
    /** Create a new (clone) Orbit with the same parameters at this one, and return it.
    * @function clone
    * @returns {KEPLER.Orbit} - Returns a new KEPLER.Orbit with the same parameters as this one.
    * @example
    * //Returns orbitB is a copy of orbitB, but different objects
    * orbitA = new KEPLER.Orbit({mass:KEPLER.SOL},100e3,0,0,0,0);
    * orbitB = orbitA.clone();
    * orbitA === orbitB; //false
    * //All True:
    * for (key in Object.keys(orbitA.getElements())) {console.log(key,':',(orbitA.getElements()[key]===orbitB.getElements()[key]));};
    * @public
    */
    this.clone = function() {
        //Part I: gather Orbital Elements
        this.updateAllElements();
        var elements = this.getElements();

        //Part II: Create clone
        var clone = new KEPLER.Orbit(
             this.primary
            ,elements.a
            ,elements.ecc
            ,elements.mAnomaly
            ,elements.rotI
            ,elements.rotW
            ,elements.rotOmeg
        );
        return clone;
    }

    //Part III: Update Functions

    /** Add Time: revolve object forward in time
    * @function addTime
    * @param {number} time - the time (in seconds) to adjust the object's movement
    * @returns {KEPLER.Orbit} - Returns this KEPLER.Orbit in it's new state after the transition
    * @public
    */
    this.addTime = function(deltaTime) {
        //Adding Time can be completely accomplished with updating the mean Anomaly (mAnomaly) with a new value.
        //deltaMAnomaly = (deltaTime*meanMotion)%(2PI)
        this.updateElement.meanMotion(); // (rad/s)
        var deltaMAnomaly = ( deltaTime * meanMotion ) % (2 * KEPLER.PI);  // ( (s) * (rad/s) ) % (rad)
        mAnomaly = ( (mAnomaly+deltaMAnomaly)%(2*KEPLER.PI) + (2*KEPLER.PI) )%(2*KEPLER.PI);  // (rad), forces to always be between 0 and 2PI
        this.updateAllElements();
        return this;
    }
    /** Subtract Time: revolve object backwards in time
    * @function subTime
    * @param {number} time - the time (in seconds) to adjust the object's movement
    * @returns {KEPLER.Orbit} - Returns this KEPLER.Orbit in it's new state after the transition
    * @public
    */
    this.subTime = function(deltaTime) {
        return this.addTime(-deltaTime);
    }
    /** Add Cartesian velocity to this orbit to cause a change in orbital functions
    * @function addVelocity
    * @param {KEPLER.Vector3} deltaV - Vector to be added to the current velocity and adjust orbital elements
    * @returns {KEPLER.Orbit} - Returns a KEPLER.Vector3 which defines the position in the orbit (INCORPORATES PRIMARY)
    * @see {@link http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf}
    * @public
    */
    this.addVelocity = function(deltaV) {

        //Part I: Get Cartesian elements
        var position = this.getPosition();
        var velocity = this.getVelocity();

        //Part II: Add deltaV to velocity;
        velocity.add(deltaV);

        //Part III: Update orbital elements
        var result = keplerize(mu,position,velocity);

        a           = result.a;
        ecc         = result.ecc;
        mAnomaly    = result.mAnomaly;
        rotI        = result.rotI;
        rotW        = result.rotW;
        rotOmeg     = result.rotOmeg;

        this.updateAllElements();

        return result;
    }

} //end of KEPLER.Orbit()

/** A Class to represent an Null Orbit, representing the center and root of the system tree.
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * classdesc Orbit is a class for defining orbit parameters and characteristics useful to all AstroBodys
 * @augments KEPLER.Orbit
 * @example
 * //returns Null Orbit center of system
 * var nullOrbit = new KEPLER.NULL_ORBIT();
 * @module kepler
 */
KEPLER.NULL_ORBIT = function() {

    //mandatory to define position at point in time.
    this.primary    = {mass:1}  // Placeholder mass, cannot be 0 or NaN errors appear
    var a           = 0;        // Semi-major Axis
    var ecc         = 0;        // Eccentricity
    var mAnomaly    = 0;        // M, Mean Anomaly
    var rotI        = 0;        // angle of inclination
    var rotW        = 0;        // angle of argument of periapsis
    var rotOmeg     = 0;        // angle of longitude of ascending node

    KEPLER.Orbit.call(this,this.primary,a,ecc,mAnomaly,rotI,rotW,rotOmeg);

    /** Get Cartesian position (x,y,z)
    * @function getPosition
    * @returns {KEPLER.Vector3} - Returns a KEPLER.Vector3(0,0,0).  Always returns null vector.
    * @see {@link http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf}
    * @public
    */
    this.getPosition = function() {
        var position = new KEPLER.Vector3(0,0,0);
        return position;
    }
    /** Get Cartesian velocity (x,y,z)
    * @function getVelocity
    * @returns {KEPLER.Vector3} - Returns a KEPLER.Vector3(0,0,0).  Always returns null vector.
    * @see {@link http://microsat.sm.bmstu.ru/e-library/Ballistics/kepler.pdf}
    * @public
    */
    this.getVelocity = function() {
        var velocity = new KEPLER.Vector3(0,0,0);
         return velocity;
    }

    /** Add satellite (NULL_ORBIT, do nothing)
    * @function addSatellite
    * @param {KEPLER.AstroBody} satellite
    * @public
    */
    this.primary.addSatellite = function(satellite) {

    }
    /** Remove satellite (NULL_ORBIT, do nothing)
    * @function removeSatellite
    * @param {KEPLER.AstroBody} satellite
    * @public
    */
    this.primary.removeSatellite = function(satellite) {

    }


    this.updateAllElements();

}
KEPLER.NULL_ORBIT.prototype = Object.create(KEPLER.Orbit.prototype);

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/Spacecraft.js

/** A function for creating Spacecraft objects
 * A Spacecraft is an AstroBody which can use fuel to change its orbit.
 * @author Rotiahn / https://github.com/Rotiahn/
 * @class
 * @classdesc AstroBody is the root class for any object (such as Planets, Moons, Spacecraft)
 * @param {string} id - the ID of the Spacecraft being created.
 * @param {number} mass - the DRY mass (in kg) of the Spacecraft being created.
 * @param {number} fuelMax - the mass (in kg) of the maximum fuel that can be carried by the Spacecraft
 * @param {number} exhaustV - Engine ISP (m/s) = the effective exhaust velocity of the Spacecraft engine = Thrust (Newtons) / fuelRate (kg/s)
 * @param {KEPLER.Orbit} orbit - the Orbit object for this AstroBody.
 * @module kepler
 */
KEPLER.Spacecraft = function(id,mass,fuelMax,exhaustV,orbit) {
    //Part I: Build AstroBody
    KEPLER.AstroBody.call(this,id,mass,orbit);

    //Part II: Spacecraft Specifics

    /** Maximum amount of fuel (kg) Spacecraft can hold
    * @member {number}
    * @private
    */
    var fuelMax = fuelMax;
    /** Current amount of fuel (kg) Spacecraft is holding
    * @member {number}
    * @public
    */
    this.fuel = 0;  //Spacecraft start will empty fuelTanks
    /** Current amount of deltaV (m/s) Spacecraft is capable of achieving based on mass & fuel
    * @member {number}
    * @public
    */
    this.deltaV = 0;  //Spacecraft start will empty fuelTanks
    /** Efficiency of Engine based on Effective exhaust velocity of Spacecraft's engine
    * @member {number}
    * @private
    */
    var exhaustV = exhaustV;

    //Part III: Add Spacecraft functions

    /** Add Fuel to fuel tank
    * @function addFuel
    * @param {number} amount - Amount of fuel (kg) to add
    * @returns {boolean} - true if successful, false if not
    * @public
    */
    this.addFuel = function( amount ) {
        var currentFuel = this.fuel.value;
        if (currentFuel+amount > fuelMax) { //Check if we can hold this much fuel
            throw 'Cannot add more fuel to '+this.id+', fuel Capacity Exceeded. Fuel Tank Size: '+fuelMax+' kg';
            //return false;
        } //End fuel capacity check
        if (currentFuel+amount < 0) { //Check if we have that much fuel to lose
            throw 'Cannot subtract fuel from '+this.id+', insufficient fuel';
            //return false;
        } //End fuel availability check
        this.fuel = currentFuel + amount;
        this.updateDeltaV();
        return true;
    }
    /** Subtract fuel from fuel tank
    * @function subFuel
    * @param {number} amount - Amount of fuel (kg) to subtract
    * @returns {boolean} - true if successful, false if not
    * @public
    */
    this.subFuel = function( amount ) {
        this.addFuel( -amount );
        return true;
    }
    /** Subtract delta V from Spacecraft (i.e. subtract fuel proportional to cause a drop in available deltaV)
    * @function subDeltaV
    * @param {number} amount - Amount of deltaV (m/s) to subtract
    * @returns {boolean} - true if successful, false if not
    * @public
    */
    this.subDeltaV = function ( amount ) {
        if (this.deltaV.value-amount < 0) { //Check if we have that much deltaV to lose
            throw 'Cannot subtract deltaV from '+this.id+', insufficient deltaV';
            //return false;
        } //End deltaV availability check

        // MATH:
        // deltaV = exhaustVEff * Math.log( mass_0 / mass_1 )
        // deltaV / exhaustVEff = Math.log( mass_0 / (mass_0 - mass_delta ) )
        // e ^ (deltaV / exhaustVEff) = mass_0 / (mass_0 - mass_delta )
        // 1 / (e ^ (deltaV / exhaustVEff) ) = (mass_0 - mass_delta) / mass_0
        // mass_0 / (e ^ (deltaV / exhaustVEff) ) = mass_0 - mass_delta
        // mass_delta = mass_0 - mass_0 / (e ^ (deltaV / exhaustVEff) )
        // mass_delta = mass_0 * (1 -  (1 / (e ^ (deltaV / exhaustVEff) ) ) )

        var current_deltaV = this.deltaV; // m/s
        var exhaustVEff = this.exhaustVEff; // m/s
        var massDry = this.mass; // kg
        //var massCargo = this.cargo; // kg
        var massFuel = this.fuel; // kg
        var massTotal = massDry + massFuel; // kg
        var massDelta = massTotal * (1 - (1 / (Math.exp( amount / (exhaustVEff) ) ) ) );

        this.subFuel(massDelta);
        return true;
    }
    /** Update the delta V budget based on the current fuel and Spacecraft mass
    * @function updateDeltaV
    * @returns {boolean} - true if successful, false if not
    * @public
    */
    this.updateDeltaV = function() {
        var massDry = this.mass;
        //var massCargo = this.cargo;
        var massFuel = this.fuel;
        var massTotal = massDry + massFuel;

        var exhaustVEff = this.exhaustVEff; // m/s

        var deltaV = exhaustVEff * Math.log( massTotal / (massDry ) ); // m/s

        this.deltaV = deltaV ;  // m/s
        return true;
    }
}
KEPLER.Spacecraft.prototype = Object.create(KEPLER.AstroBody.prototype);

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/Transfer.js

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

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/Calculator/Lambert.js

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
		    //console.warn("Lambert solver exceeded 150 iterations; Breaking",duration);
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

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/Calculator/TransferSolver.js

/** A collection of Transfer Solvers
 * @author Rotiahn / https://github.com/Rotiahn/
 * @namespace kepler.transferSolver
 */
KEPLER.TransferSolver = {};

/** A function which returns a value to be tested for running functions multiple times to locate extrema using slope
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {number} minX - the minimum value for X
 * @param {number} maxX - the maximum value for X
 * @param {function({},{},number):number} testFunction - the function to use for generating values to measure slope from.  Must take testArg1, testArg2 and a number (where minX<=number<=maxX) as arguments. Must return a number.
 * @param {function(number,number):number} comparator - a function which takes two values and returns a number evaluating
 * @param {} args - arguments to be used by testFunction. Can be anything, but usually an object containing each argument to be available to testFunction
 * @returns {number} transfer - The value of testX1 reached based on the comparator.
 * @module kepler
 */
KEPLER.TransferSolver.bisectionSlopeSolver = function(minX, maxX, testFunction, comparator, args) {
    var i = 0;

    var  testX1,testX2,testValue1,testValue2,compareResult;
    do {
        testX1 = Math.ceil( (minX + maxX)/2 );
        testValue1 = testFunction(testX1,args);

        testX2 = testX1+1;
        testValue2 = testFunction(testX2,args);

        compareResult = comparator(
            testValue1
            ,testValue2
            ,function() {return testFunction(minX,args);}
            ,function() {return testFunction(maxX,args);}
        );

        //console.log(i,testX1,testX2,'|',testValue1,testValue2,'|',compareResult)

        if (compareResult > 0) {
            //compareResult is positive, value we're looking for is larger than our current testX1
            minX = testX1;
        } else if (compareResult < 0) {
            //compareResult is negative, value we're looking for is smaller than our current testX1
            maxX = testX1;
        } else {
            //compareResult is zero, set minX to be testX1 AND set maxX to be testX2  (we stumbled upon the value exactly)
            minX = testX1;
            maxX = testX2;
        }

        i++;
        if (i>100) {throw 'KEPLER.TransferSolver.bisectionSlopeSolver took too long to calculate using:\n'+testFunction;};

    } while ( maxX-minX > 1 );

    //Found Solution
    return testX1;
}
/** A function for calculating the transfer with minimum deltaV assuming launch after specific waitTime
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time, not including waitTime)
 * @param {number} waitTime - (Default:0) The amount of time (s) the solver should add before running calculation (i.e. the amount of time to delay departure time).
 * @returns {KEPLER.Transfer} transfer - The optimum transfer orbit to minimize deltaV launching now.
 * @example
 * a = KEPLER.TransferSolver.minDeltaV_LaunchSpecified(earth,mars,60*KEPLER.DAY);
 * @module kepler
 */
KEPLER.TransferSolver.minDeltaV_LaunchSpecified = function (orbit1, orbit2, waitTime = 0) {
    var object1 = orbit1.clone();
    var object2 = orbit2.clone();

    object1.addTime(waitTime);
    object2.addTime(waitTime);

    var object1Elements = object1.getElements();
    var object2Elements = object2.getElements();

    var periodSmall = Math.min(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );

    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;



    var optimumTime = KEPLER.TransferSolver.bisectionSlopeSolver(
         travelTimeMin  //minX
        ,travelTimeMax  //maxX
        ,function(x,args) {
            var object1 = args.testArg1;
            var object2 = args.testArg2;
            return new KEPLER.Transfer(object1,object2,x);
        } //testFunction
        ,function(x,y) {
            //x is Transfer(time1), y is Transfer(time2)
            var deltaV1 = x.delta_v;
            var deltaV2 = y.delta_v;

            var deltaVSlope = (deltaV2-deltaV1)/1; //When deltaVSlope = 0, we have reached an extrema.

            //when slope is positive, we want to go smaller

            return -deltaVSlope;
        }//comparator
        ,{
             testArg1: object1        //testArg1
            ,testArg2: object2        //testArg2
        } //args
    );

    var optimumTransfer = new KEPLER.Transfer(object1,object2,optimumTime);
    return optimumTransfer;
}

/** A function for calculating the optimum transfer, optimizing for minimum deltaV expenditure
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @example
 * a = KEPLER.TransferSolver.minDeltaV(earth,mars);
 * @module kepler
 */
KEPLER.TransferSolver.minDeltaV = function (orbit1, orbit2) {
    //Given a starting orbit, ending orbit, find the next instance of a transfer orbit which is the optimum deltaV transfer.
    // Allows delays in departure
    // Searches launch times based on orbital periods of bodies in question.

    //Need a mechanism for optimizing non-coplanar comparisons.
    // Idea1 -  Chunks + binary tree solver:
    //          1. Break potential launch times into X chunks, where X = (larger Period / smaller period). Chunk size = smaller period
    //          3. Define chunkBegin & chunkEnd
    //          4. Test point = (chunkBegin + chunkEnd) /2
    //          5. Find deltaV at Test Point (deltaV0)
    //          6. Find deltaV at test point+1s (deltaV1)
    //          7. Determine deltaV slope (deltaV1-deltaV0)
    //          8. If deltaV slope >0, chunkMax = Testpoint, goto 4
    //          9. If deltaV slope <0, chunkMin = Testpoint, goto 4
    //          10.If deltaV slope ~=0, Found minimum deltaV!
    //
    // Idea2 - Global Binary Tree solver (cannot account for multiple local minima)
    // Idea3 - Modified Lambert Solver?

    // Currently Using Idea1 - This method is computationally expensive.  Future TODO: implement idea3 or alternate faster solution.

    var object1 = orbit1.clone();
    var object2 = orbit2.clone();

    var object1Elements = object1.getElements();
    var object2Elements = object2.getElements();

    var periodSmall = Math.min(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );


    var chunkSize = periodSmall/8;  //Use 1/8th orbits to decrease probability that we'll end up with multiple minima per chunk
    var chunkCount = Math.ceil(periodLarge / chunkSize);  // We will include the entirety of last chunk, even if that chunk extends past periodLarge


    var departTimeMin = 0;
    var departTimeMax = chunkSize * chunkCount;
    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;


    var chunkBegin = 0;
    var chunkEnd = 0;
    var testTime1 = 0;
    var testTime2 = 0;
    var resultTransfers = {};
    //Cycle through each Chunk and determine its minima to identify chunk with preferred
    for (var i=0; i< chunkCount; i++) {
        departTimeMin = chunkBegin = Math.ceil(   (i)*(chunkSize));
        departTimeMax = chunkEnd   = Math.floor((i+1)*(chunkSize));

        object1 = orbit1.clone();
        object2 = orbit2.clone();

        //console.log(departTimeMin,departTimeMax);

        var optimumTime = KEPLER.TransferSolver.bisectionSlopeSolver(
             departTimeMin  //minX
            ,departTimeMax  //maxX
            ,function(x,args) {
                var object1 = args.testArg1;
                var object2 = args.testArg2;
                var transferX =  new KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,x); //returns KEPLER.Transfer()
                return {
                    waitTime:x
                    ,transfer:transferX
                };
            } //testFunction
            ,function(x,y,minX,maxX) {
                //x is Transfer(time1), y is Transfer(time2)
                var deltaV1 = x.transfer.delta_v;
                var deltaV2 = y.transfer.delta_v;

                var deltaVSlope = (deltaV2-deltaV1)/1; //When deltaVSlope = 0, we have reached an extrema.

                //console.log('x','|',x.duration,deltaV1);
                //console.log('y','|',minX().waitTime,x.waitTime,maxX().waitTime,'|',deltaV1,deltaV2,deltaVSlope);


                //when slope is positive, we want to go smaller

                return -deltaVSlope;
            }//comparator
            ,{
                 testArg1:object1        //testArg1
                ,testArg2:object2        //testArg2
            } //args
        );



        //minimum deltaV found for this chunk, save it to array
        resultTransfers[optimumTime] = KEPLER.TransferSolver.minDeltaV_LaunchSpecified(object1,object2,optimumTime);
        //console.log(
        //     i
        ////    ,j
        //    ,'|'
        //    ,optimumTime
        ////    ,departTimeMin
        ////    ,departTimeMax
        ////    ,'|'
        //    ,resultTransfers[optimumTime].delta_v
        ////    ,testTransfer2.delta_v
        ////    ,deltaVSlope
        //);

    }
    //All chunk minimum deltaVs found.  Now choose lowest deltaV option.  starting bestTransfer = last testTransfer1
    var bestTransfer = {
        waitTime: optimumTime //WaitTime
        ,transfer: resultTransfers[optimumTime]
    };
    //console.log(resultTransfers);
    for (chunk in resultTransfers) {
        if (resultTransfers[chunk].delta_v <= bestTransfer.transfer.delta_v) {
            bestTransfer = {
                waitTime: chunk //WaitTime
                ,transfer: resultTransfers[chunk]
            };
        }
    }

    return bestTransfer;

}

/** A function for calculating the optimum transfer, optimizing for minimum time (with fixed deltaV budget), assuming launch after specific waitTime
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time, not including waitTime)
 * @param {number} maxDeltaV - the maximum amount of delta V (m/s) the vehicle may expend for the journey
 * @example
 * a = KEPLER.TransferSolver.minTime_LaunchSpecified(earth,mars,17000,60*KEPLER.DAY);
 * @module kepler
 */
KEPLER.TransferSolver.minTime_LaunchSpecified = function (orbit1, orbit2, maxDeltaV, waitTime = 0) {
    var object1 = orbit1.clone();
    var object2 = orbit2.clone();

    object1.addTime(waitTime);
    object2.addTime(waitTime);

    var object1Elements = object1.getElements();
    var object2Elements = object2.getElements();

    var periodSmall = Math.min(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );

    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;

    var optimumTime = KEPLER.TransferSolver.bisectionSlopeSolver(
         travelTimeMin  //minX
        ,travelTimeMax  //maxX
        ,function(x,args) {
            var object1 = args.testArg1;
            var object2 = args.testArg2;
            return new KEPLER.Transfer(object1,object2,x);
        } //testFunction
        ,function(x,y,minXFunction,maxXFunction) {
            //x is Transfer(time1), y is Transfer(time2)
            var deltaV1 = x.delta_v;
            var deltaV2 = y.delta_v;

            var deltaVSlope = (deltaV2-deltaV1)/1; //When deltaVSlope = 0, we have reached an extrema.

            //console.log(x.duration,deltaV1,deltaVSlope,isNaN(deltaVSlope),deltaV1 <= maxDeltaV,-deltaVSlope<0);

            if (isNaN(deltaVSlope)) {
                //Lambert solver couldn't make this duration work, choose a longer duration
                return 1;
            } else if (deltaV2 < maxDeltaV) {
                //deltaV1 is good enough (answer is this duration or less) AND slope is positive (shorter durations will be better), can we get shorter time? go smaller!
                //this will set travelTimeMax = x;
                return -1;
            } else {
                //deltaV1 is too high. check if either minX or maxX is acceptable (tells us that previously reached acceptable answer)
                //minXValue = minXFunction();
                maxXValue = maxXFunction();
                //console.log('maxValue',maxXValue.delta_v);
                if (maxXValue.delta_v <= maxDeltaV) {
                    //previously showed that maxX is solvable, so move in that direction
                    return 1;
                } else {
                    //have not previously demonstrated a solveable answer, follow slope:
                    //when slope is positive, we want to go smaller
                    return -deltaVSlope;
                }
            }
        }//comparator
        ,{
             testArg1:object1        //testArg1
            ,testArg2:object2        //testArg2
        } //args
    );

    var optimumTransfer1 = new KEPLER.Transfer(object1,object2,optimumTime);
    var optimumTransfer2 = new KEPLER.Transfer(object1,object2,optimumTime+1);

    if (optimumTransfer1.delta_v <= optimumTransfer2.delta_v) {
        return optimumTransfer1; //NOTE: if OptimumTransfer.deltaV>= maxDeltaV, then OptimumTransfer is lowest deltaV option.
    } else {
        return optimumTransfer2; //NOTE: if OptimumTransfer.deltaV>= maxDeltaV, then OptimumTransfer is lowest deltaV option.
    }
}
/** A function for calculating the optimum transfer, optimizing for minimum time (with fixed deltaV budget), allows departure delays
 * @author Rotiahn / https://github.com/Rotiahn/
 * @param {KEPLER.Orbit} orbit1 - The initial orbit
 * @param {KEPLER.Orbit} orbit2 - The destination orbit (mAnomaly should be set to value corresponding to DEPARTURE time)
 * @param {number} maxDeltaV - the maximum amount of delta V (m/s) the vehicle may expend for the journey
 * @example
 * a = KEPLER.TransferSolver.minTime(earth,mars,60*KEPLER.DAY);
 * @module kepler
 */
KEPLER.TransferSolver.minTime = function (orbit1, orbit2, maxDeltaV) {
    var object1 = orbit1.clone();
    var object2 = orbit2.clone();

    var object1Elements = object1.getElements();
    var object2Elements = object2.getElements();

    var periodSmall = Math.min(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );
    var periodLarge = Math.max(
                             object1Elements.T  //either full orbit of departure object
                            ,object2Elements.T  //or the full orbit of target object
                            );

    var chunkSize = periodSmall/8;  //Use 1/8th orbits to decrease probability that we'll end up with multiple minima per chunk
    var chunkCount = Math.ceil(periodLarge / chunkSize);  // We will include the entirety of last chunk, even if that chunk extends past periodLarge

    var departTimeMin = 0;
    var departTimeMax = chunkSize * chunkCount;
    var travelTimeMin = 1;
    var travelTimeMax = periodLarge;


    var chunkBegin = 0;
    var chunkEnd = 0;
    var testTime1 = 0;
    var testTime2 = 0;
    var resultTransfers = {};
    //Cycle through each Chunk and determine its minima to identify chunk with preferred
    for (var i=0; i< chunkCount; i++) {
        departTimeMin = chunkBegin = Math.ceil(   (i)*(chunkSize));
        departTimeMax = chunkEnd   = Math.floor((i+1)*(chunkSize));

        object1 = orbit1.clone();
        object2 = orbit2.clone();

        var optimumTime = KEPLER.TransferSolver.bisectionSlopeSolver(
             departTimeMin  //minX
            ,departTimeMax  //maxX
            ,function(x,args) {
                var object1 = args.testArg1;
                var object2 = args.testArg2;
                var maxDeltaV = args.testArg3;
                var transferX = KEPLER.TransferSolver.minTime_LaunchSpecified(object1,object2,maxDeltaV,x); //returns KEPLER.Transfer()
                //console.log(transferX,'|',x);
                var returnObject = {
                    waitTime: x //WaitTime
                    ,transfer: transferX
                };
                //console.log(returnObject);
                return returnObject;
            } //testFunction
            ,function(x,y,minXFunction,maxXFunction) {
                //x is Transfer(time1), y is Transfer(time2)
                var totalTime1 = x.waitTime + x.transfer.duration;
                var totalTime2 = y.waitTime + y.transfer.duration;
                var deltaV1 = x.transfer.delta_v;
                var deltaV2 = y.transfer.delta_v;

                var deltaVSlope = (deltaV2-deltaV1)/1; //When deltaVSlope = 0, we have reached an extrema.
                var timeSlope = (totalTime2-totalTime1)/1; //When timeSlope = 0, we have reached an extrema.

                if (isNaN(deltaVSlope)) {
                    //Lambert solver couldn't make this waitTime work, choose a longer waitTime
                    return 1;
                } else if (deltaV1 < maxDeltaV) {
                    //deltaV1 is good enough, follow timeSlope to see if wait time should be increased or decreased
                    return -timeSlope;
                } else {
                    //deltaV1 is too high. check if either minX or maxX is acceptable (tells us that previously reached acceptable answer)
                    minXValue = minXFunction();
                    maxXValue = maxXFunction();
                    //console.log('maxValue',maxXValue);
                    if (minXValue.delta_v <= maxDeltaV) {
                        //previously showed that minX is solvable, so move in that direction
                        return -1;
                    } else if (maxXValue.delta_v <= maxDeltaV) {
                        //previously showed that maxX is solvable, so move in that direction
                        return 1;
                    } else {
                        //have not previously demonstrated a solveable answer, follow deltaV slope to try to find lower deltaV value:
                        //when slope is positive, we want to go smaller
                        return -deltaVSlope;
                    }
                }
            }//comparator
            ,{
                 testArg1:object1        //testArg1
                ,testArg2:object2        //testArg2
                ,testArg3:maxDeltaV      //testArg3
            } //args
        );


        //minimum deltaV found for this chunk, save it to array
        resultTransfers[optimumTime] = KEPLER.TransferSolver.minTime_LaunchSpecified(object1,object2,maxDeltaV,optimumTime);

        //console.log(
        //     i
        ////    ,j
        //    ,'|'
        //    ,optimumTime
        ////    ,departTimeMin
        ////    ,departTimeMax
        ////    ,'|'
        ////    ,resultTransfers[optimumTime]
        //    ,resultTransfers[optimumTime].delta_v
        ////    ,deltaVSlope
        //);

        if (resultTransfers[optimumTime].delta_v <= maxDeltaV) {
            //deltaV1 is acceptable answer in this chunk, no need to check later chunks!
            return {
                waitTime: optimumTime //WaitTime
                ,transfer: resultTransfers[optimumTime]
            };
        } else {
            //this chunk doesn't have a satisfactory answer, keep going.
        }


    }
    //All chunk minimum deltaVs found.  None of them met the minimum requirements

    return -1;
}

//File: /Volumes/Macintosh HD 2/Users/shariton/Documents/kepler.js/src/examples.js

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
     'voyager1'                             //id
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
EXAMPLE.iss = new KEPLER.Spacecraft(
     'ISS'                                  //id
    ,370131                                 //mass
    ,0                                      //fuelMax
    ,0                                      //exhaustV
    ,new KEPLER.Orbit(
        EXAMPLE.Earth                       //Primary
        ,6.759645260772543E+03*KEPLER.KM    //a
        ,2.048033237342145E-03              //ecc
        ,3.292219482993897E+02*KEPLER.DEGREE//mAnomaly
        ,5.217497644819966E+01*KEPLER.DEGREE//rotI
        ,8.611226361123934E+01*KEPLER.DEGREE//rotW
        ,2.592819760903027E+02*KEPLER.DEGREE//rotOmeg
    )
);

EXAMPLE.TransferISSToMoon = new KEPLER.Transfer(
     EXAMPLE.iss.orbit
    ,EXAMPLE.Luna.orbit
    ,3*KEPLER.DAY
)