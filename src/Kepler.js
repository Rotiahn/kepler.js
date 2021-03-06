/** A library for handling orbital mechanics math and calculations
 * @author Rotiahn / https://github.com/Rotiahn/
 * @namespace kepler
 */

var KEPLER = { VERSION: '0.1.0' };


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
