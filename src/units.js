
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



function calcDPSM(unit) {
	//damage per second per matter
	if (unit.dpsg > unit.dpsa) return (unit.dpsg / 10);
	else return (unit.dpsa / 10);
}


class Unit {
	constructor(jsonImportedUnit) {
		Object.keys(jsonImportedUnit).forEach((key) => {
			var cleanNameKey = key;
			cleanNameKey = removeSpacesCapitalsSpecialCharacters(key);
			var value = jsonImportedUnit[key];
			if (value.constructor == String) {
				if (cleanNameKey != 'emoji' && cleanNameKey != 'name' && cleanNameKey != 'videoturnaround' && cleanNameKey != 'type') {
					value = removeSpacesCapitalsSpecialCharacters(value);
				}
			}
			if (cleanNameKey == 'supply') {
				this['bandwidth'] = value;
			} else if (cleanNameKey == 'damageg') {
				this['damage'] = value;
			} else {
				this[cleanNameKey] = value;
				//calculations after dpsa for table column order purposes
				if (cleanNameKey == 'dpsa') this['dpsm'] = Math.floor(calcDPSM(this));
				else if (cleanNameKey == 'health') this['hp/100'] = Math.floor(this.health / 100);
			}
			if (value == 'splash' || value == 'small' || value == 'antibig' || value == 'big' || value == 'antiair') {
				if (this.traits == undefined) {
					this.traits = [];
				}
				this.traits.push(value);
			}
		}
		);
		//instead of 

		this['tier'] = buildingTiers[this['building']] || 0;
		this['image'] = jsonImportedUnit.slug;
		this['slug'] = jsonImportedUnit.slug;
	}
}

const units = importedUnits.reduce((obj, unit) => {
	obj[unit.slug] = new Unit(unit);
	return obj;
}, {});

const unitList = Object.values(units);


export { units, unitList };
