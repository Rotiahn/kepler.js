/** A Class
 * @author Rotiahn / https://github.com/Rotiahn/
 * @module kepler
 */

KEPLER.Orbit = function(primary,a,ecc,mAnomaly,rotI,rotW,rotOmeg) {
	//This is an object which represents an orbit for an AstroBody

    //Part I: Initialization values:

    //Part Ia: System level inputs:
        this.primary = primary; //Astrobody

    //Part Ib: Orbital Elements

    //mandatory to define position at point in time.
    var a           = a;        // (m)     Semi-major axis, a                  ; circular: a=radius,   eliptical: a>0,     parabolic: a=infinity,  hyperbolic: a<0
    var ecc         = ecc;      // ()      Eccentricity, e                     ; circular: ecc=0,      eliptical: 0<ecc<1, parabolic: ecc=1,       hyperbolic: e>1
    var mAnomaly    = mAnomaly; // (rad)   Mean anomaly, M                     ;
    var rotI        = rotI;     // (rad)   Inclination w.r.t xy-plane, i       ;
    var rotW        = rotW;     // (rad)   Argument of Perifocus, w            ;
    var rotOmeg     = rotOmeg;  // (rad)   Longitude of Ascending Node, OMEGA  ;

    //mandatory additional for defining position over time:
    var mu          = KEPLER.G * this.primary.mass;

    //derivable
    var peri        = 0; // (m)     Periapsis distance, q               ;
    var apo         = 0; // (m)     Apoapsis distance                   ;
    var T           = 0; // (s)     Sidereal orbit period               ;
    var meanMotion  = 0; // (rad/s) Mean motion, n                      ;
  //var tAnomaly    = 0; // (rad)   True anomaly, nu                    ;
    var periT       = 0; // (s)     Time of periapsis                   ;
  //var E           = 0; // (rad)   Eccentric anomaly                   ;

    //NOTES:
    //1. By definition, a (semi-major axis) is undefined for parabolic orbits.
    //  However, by convention we are using a=q in order to make the code simpler


    //calculate deriveable elements functions
    //Source: http://www.bogan.ca/orbits/kepler/orbteqtn.html
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
    var calculateApo = function() {
        if (ecc < 1) {
            return (1 + ecc) * a;
        } // circular or eliptical
        else if (ecc >= 1) {
            return Infinity;
        } // parabolic or hyperbolic
    };
    var calculateT = function() {
        if (ecc < 1) {
            return 2 * KEPLER.PI * Math.pow( ( (a*a*a)/(mu) ) , 0.5);
        } // circular or eliptical
        else if (ecc >= 1) {
            return Infinity;
        } // parabolic or hyperbolic

    };
    var calculateMeanMotion = function() {
        if (ecc < 1) {
            return Math.pow( ( (a*a*a)/(mu) ) , -0.5);
        } // circular or eliptical
        else if (ecc >= 1) {
            return Infinity;
        } // parabolic or hyperbolic

    };
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

    this.updateElements = function() {
        peri        = calculatePeri();
        apo         = calculateApo();
        T           = calculateT();
        meanMotion  = calculateMeanMotion();
        periT       = calculatePeriT();
    };


    //get functions
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

KEPLER.AstroBody = function(mass) {

    this.mass = mass;       // (kg)

}//end of Astro_Body() definition
