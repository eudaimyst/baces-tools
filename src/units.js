
import importedUnits from './units.json';
import { cleanText } from './utils';


const buildingTiers = {
	'core': 1,
	'foundry': 2,
	'starforge': 2,
	'advancedfoundry': 3,
	'advancedstarforge': 3,
}

const traitCounters = {
	big: 'splash',
	splash: 'small',
	small: 'antibig',
	antibig: 'big',
}

const traitCounteredBy = {
	big: 'antibig',
	splash: 'big',
	small: 'splash',
	antibig: 'small',
}

const keyOrder = ['image', 'name', 'type', 'building', 'matter', 'energy', 'bandwidth', 'health', 'hp/100', 'speed', 'simplespeed', 'range', 'simpledamage', 'damage', 'dps', 'damagea', 'dpsa', 'ability', 'traits', 'manufacturer']

class Unit {
	constructor(jsonImportedUnit) {
		Object.keys(jsonImportedUnit).forEach((key) => {
			var cleanNameKey = cleanText(key);
			var value = jsonImportedUnit[key];
			if (!value) {
				if (cleanNameKey == 'ability') {
					this[cleanNameKey] = ' ';
					return;
				}
				this[cleanNameKey] = '0';
				return;
			}
			if (value.constructor == String) {
				if (cleanNameKey != 'emoji' && cleanNameKey != 'videoturnaround' && cleanNameKey != 'website' && cleanNameKey != 'speed') {
					value = cleanText(value);
				}
			}
			if (cleanNameKey == 'supply') {
				this.bandwidth = value;
			}
			else {
				this[cleanNameKey] = value
				//calculations after dpsa for table column order purposes
				if (cleanNameKey == 'health') this['hp/100'] = Math.floor(this.health / 100);
			}
			if (cleanNameKey == 'splash' || cleanNameKey == 'small' || cleanNameKey == 'antibig' || cleanNameKey == 'big' || cleanNameKey == 'antiair')
				if (value == 'splash' || value == 'small' || value == 'antibig' || value == 'big' || value == 'antiair') {
					if (this.traits == undefined) {
						this.traits = [];
					}
					this.traits.push(value);
				}

		});

		//after all has been imported, add the missing stats
		//for each key
		if (this.name == 'advancedblink') this.damagea = Math.floor(this.damage * .5)
		else {
			//console.log('testair1 ' + this.name)
			var found = false
			for (let key of Object.keys(this)) {
				if (key == 'target1' && (this[key] == 'air' || this[key] == 'bigair' || this.antiair == 'antiair')) {
					this.damagea = Math.round(this.damage + (this.multi1 * this.damage) || this.damage)
					found = true;
				} else if (key == 'target2' && (this[key] == 'air' || this[key] == 'bigair' || this.antiair == 'antiair')) {
					this.damagea = Math.round(this.damage + (this.multi2 * this.damage) || this.damage)
					found = true;
				} else if (key == 'target3' && (this[key] == 'air' || this[key] == 'bigair' || this.antiair == 'antiair')) {
					this.damagea = Math.round(this.damage + (this.multi3 * this.damage) || this.damage)
					found = true;
				}
			}
			//console.log('testair1 ' + found + this['damagea'])
			if (!found) {
				if (this.antiair == 'antiair') this.damagea = this.damage;
				else this.damagea = 0;
			}
		}
		//console.log('testAIR', this['name'], this['dpsa'])

		//calculate dps (damage / attackrate), dpsa (damagea / attackrate)

		this.dps = Math.round(Number(this.damage) / Number(this.attackrate)) || 0;

		if (this.damagea > 0) {
			this.dpsa = Math.round(Number(this.damagea) / this.attackrate);
		}
		else this.dpsa = 0;
		if (this.name == 'bomber') this.dps = this.damage;

		this.simplespeed = Math.round(this.speed) || '0';
		this.speed = Math.round((this.speed) * 10) / 10;

		var simpDam
		if (this.dpsa > this.dps) simpDam = Math.round(this.dpsa / 10);
		else simpDam = (Math.round(this.dps / 10))
		//console.log('testing simpledamage ' + this.name + this.dps + simpDam);
		//console.log(this.dpsa, this.dpsg);
		if (this.name == 'bomber') this.simpledamage = this.damage / 10;
		else this.simpledamage = simpDam;

		this.tier = buildingTiers[this.building] || 0;
		this.image = jsonImportedUnit.slug;
		this.slug = jsonImportedUnit.slug;
		this.traitcounters = []
		this.traitcounteredby = []
		//calculate traits this unit counters and traits that counter this unit
		if (this.traits) {
			//for each trait
			for (let trait of this.traits) {
				if (traitCounters[trait]) this.traitcounters.push(traitCounters[trait]);
				if (trait == 'antiair') this.traitcounters.push('air');
				if (traitCounteredBy[trait]) this.traitcounteredby.push(traitCounteredBy[trait]);
				//if traitCounteredBy does not include air
			}

			if (this.dpsa == 10) this.traitcounteredby.push('air');
			if (this.type == 'Air') this.traitcounteredby.push('antiair');
		}
	}
};


//to order the keys correctly using the keyOrder we create a new object using the data of the unit
class UnitOrdered {
	constructor(unit) {
		//for each key in keyOrder
		for (let key of keyOrder) {
			//if the unit has the key
			//console.log('adding', key, unit[key])
			//console.log(unit)
			if (unit[key]) {
				//add the key and value to the new object
				this[key] = unit[key];
			}
			else {
				this[key] = 0;
			}
		}
		//for each key in unit
		for (let key of Object.keys(unit)) {
			//if the key is not in keyOrder
			if (!keyOrder.includes(key)) {
				//add the key and value to the new object
				this[key] = unit[key];
			}
		}

	}
}




const units = importedUnits.reduce((obj, unit) => {
	var tempUnit = new Unit(unit); //pre sorted units
	obj[unit.slug] = new UnitOrdered(tempUnit);
	return obj;
}, {});

const unitList = Object.values(units);



var currentUnit = unitList[0];
function getCurrentUnit() {
	return currentUnit;
}
function setCurrentUnit(unit) {
	currentUnit = unit;
}

export { units, unitList, getCurrentUnit, setCurrentUnit };
