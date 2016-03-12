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
