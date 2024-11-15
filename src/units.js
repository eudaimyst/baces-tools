
import importedUnits from './units.json';



function removeSpacesCapitalsSpecialCharacters(inputString) {
	return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}


const buildingTiers = {
	'core': 1,
	'foundry': 2,
	'starforge': 2,
	'advancedfoundry': 3,
	'advancedstarforge': 3,
}



function simpleDmg(unit) {
	//damage per second per matter
	if (unit.dpsa) {
		if (unit.dpsa > unit.dpsg) return (Math.round(unit.dpsa / 10));
	}
	return (Math.round(unit.dpsg / 10))
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

const keyOrder = ['image', 'name', 'type', 'building', 'matter', 'energy', 'bandwidth', 'health', 'hp/100', 'speed', 'range', 'simpledamage', 'damage', 'damagea', 'dps', 'dpsa', 'ability', 'traits', 'manufacturer']

class Unit {
	constructor(jsonImportedUnit) {
		Object.keys(jsonImportedUnit).forEach((key) => {
			var cleanNameKey = removeSpacesCapitalsSpecialCharacters(key);
			var value = jsonImportedUnit[key];
			if (value == null) return;
			if (value.constructor == String) {
				if (cleanNameKey != 'emoji' && cleanNameKey != 'videoturnaround' && cleanNameKey != 'website') {
					value = removeSpacesCapitalsSpecialCharacters(value);
				}
			}
			if (cleanNameKey == 'supply') {
				this['bandwidth'] = value;
			} else if (cleanNameKey == 'damageg') {
				this['damage'] = value;
			}
			else {
				this[cleanNameKey] = value
				//calculations after dpsa for table column order purposes
				if (cleanNameKey == 'health') this['hp/100'] = Math.floor(this.health / 100);
			}
			if (value == 'splash' || value == 'small' || value == 'antibig' || value == 'big' || value == 'antiair') {
				if (this.traits == undefined) {
					this.traits = [];
				}
				this.traits.push(value);
			}
		});

		//after all has been imported, add the missing stats
		//for each key
		for (let key of Object.keys(this)) {
			if (key == 'target1' && this[key] == 'air') {
				this['damagea'] = Math.floor(this.multi1 * this.damage)
			} else if (key == 'target2' && this[key] == 'air') {
				this['damagea'] = Math.floor(this.multi2 * this.damage)
			} else if (key == 'target3' && this[key] == 'air') {
				this['damagea'] = Math.floor(this.multi3 * this.damage)
			}
		}

		this['tier'] = buildingTiers[this['building']] || 0;
		this['image'] = jsonImportedUnit.slug;
		this['slug'] = jsonImportedUnit.slug;
		this['traitcounters'] = []
		this['traitcounteredby'] = []
		//calculate traits this unit counters and traits that counter this unit
		if (this.traits) {
			//for each trait
			for (let trait of this.traits) {
				if (traitCounters[trait]) this.traitcounters.push(traitCounters[trait]);
				if (trait == 'antiair') this.traitcounters.push('air');
				if (traitCounteredBy[trait]) this.traitcounteredby.push(traitCounteredBy[trait]);
				//if traitCounteredBy does not include air
			}

			if (this.dpsa < 10) this.traitcounteredby.push('air');
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
			console.log('adding', key, unit[key])
			console.log(unit)
			if (unit[key]) {
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


export { units, unitList };
