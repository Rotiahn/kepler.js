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
    var a           = a;
    var ecc         = ecc;
    var mAnomaly    = mAnomaly;
    var rotI        = rotI;
    var rotW        = rotW;
    var rotOmeg     = rotOmeg;

    //mandatory additional for defining position over time:
    var mu          = KEPLER.G * this.primary.mass;

    //derivable
    var peri        = 0;
    var apo         = 0;
    var T           = 0;
    var meanMotion  = 0;
  //var tAnomaly    = 0; // (rad)   True anomaly, nu                    ;
    var periT       = 0;
  //var E           = 0; // (rad)   Eccentric anomaly                   ;

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
        else if (ecc = 1) {
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
    /** Calculate Time of Periapsis
    * @function calculatePeriT
    * @returns {number} periT - (s) Time of periapsis
    * @private
    */
    var calculatePeriT = function() {
        if (ecc < 1) {
            return Math.pow( ( (a*a*a)/(mu) ) , 0.5) * mAnomaly;
        } // circular or eliptical
        else if (ecc = 1) {
            return Math.pow( ( (2*a*a*a)/(mu) ) , 0.5) * mAnomaly;
        } // parabolic
        else if (ecc >= 1) {
            return Math.pow( ( ((-a)*(-a)*(-a))/(mu) ) , 0.5) * mAnomaly;
        } // hyperbolic

    };

    /** Update all derivable elements
    * @function updateElements
    * @public
    */
    this.updateElements = function() {
        peri        = calculatePeri();
        apo         = calculateApo();
        T           = calculateT();
        meanMotion  = calculateMeanMotion();
        periT       = calculatePeriT();
    };


    //get functions

    /** Get all orbital Elements
    * @function getElements
    * @returns {Object} - Returns an object which includes all orbital elements.
    * @public
    */
    this.getElements = function() {
        this.updateElements();
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
            ,periT      :periT
        };
        return retObject;
    }

} //end of KEPLER.Orbit()

//KEPLER.NULL_ORBIT = new KEPLER.Orbit({mass:0},0,0,0,0,0);