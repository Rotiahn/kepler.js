/** A Class
 * @author Rotiahn / https://github.com/Rotiahn/
 * @module kepler
 */

 KEPLER.AstroBody = function() {
	//Any Astronomical body will be a subset of this class.
	//This class should not be called directly; it defines characteristics that all other objects need.

	//Part I: Initialization values:
	this.initialize = function() {
        //Part Ia: Orbital Elements

        //mandatory
        var a           = 0; // (m)     Semi-major axis, a                  ; circular: a=radius,   eliptical: a>0,     parabolic: a=infinity,  hyperbolic: a<0
        var ecc         = 0; // ()      Eccentricity, e                     ; circular: ecc=0,      eliptical: 0<ecc<1, parabolic: ecc=1,       hyperbolic: e>1
        var mAnomaly    = 0; // (rad)   Mean anomaly, M                     ;
        var rotI        = 0; // (rad)   Inclination w.r.t xy-plane, i       ;
        var rotW        = 0; // (rad)   Argument of Perifocus, w            ;
        var rotOmeg     = 0; // (rad)   Longitude of Ascending Node, OMEGA  ;

        //deriveable
        var peri        = 0; // (m)     Periapsis distance, q               ;
        var apo         = 0; // (m)     Apoapsis distance                   ;
        var n           = 0; // (rad/s) Mean motion, n                      ;
        var tAnomaly    = 0; // (rad)   True anomaly, nu                    ;
        var tSidereal   = 0; // (s)     Sidereal orbit period               ;
        var periT       = 0; // (s)     Time of periapsis                   ;


    }

}//end of Astro_Body() definition
