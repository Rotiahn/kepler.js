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
