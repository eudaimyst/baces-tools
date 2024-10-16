
import importedUnits from './units.json';



function removeSpacesCapitalsSpecialCharacters(inputString) {
	return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
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
			}
			if (this['building'] == 'core') this['tier'] = '1';
			else if (this['building'] == 'foundry' || this['building'] == 'starforge') this['tier'] = '2';
			else if (this['building'] == 'advancedfoundry' || this['building'] == 'advancedstarforge') this['tier'] = '3';
			else this['tier'] = '0';
			if (value == 'splash' || value == 'small' || value == 'antibig' || value == 'big' || value == 'antiair') {

				if (this.traits == undefined) {
					this.traits = [];
				}
				this.traits.push(value);
			}
			if (cleanNameKey == 'antiair') {
				if (this.traits == undefined) {
					this.traits = [];
					this.traits.push('none');
				}
			}
		}
    );
    this['image'] = jsonImportedUnit.slug;
    this['slug'] = jsonImportedUnit.slug;
	}
}

const units = importedUnits.reduce((obj, unit) => {
        obj[unit.slug] = new Unit(unit);
        return obj;
    }, {});

const unitList = Object.values(units);


export {units, unitList};