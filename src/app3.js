//create 3 divs called unit_view, deck_view and stats_view, and a wrapper to contain them
import { sort } from 'fast-sort';

//helper function which takes a string and removes any spaces and capitilisation or the '-' symbol or + symbol or any other symbols... just letters and numbers
function removeSpacesCapitalsSpecialCharacters(string) {
	var newString = '';
	//loop through the string
	for (var i = 0; i < string.length; i++) {
		//if the character is a letter or a number, add it to the new string
		if (string[i].match(/[a-zA-Z0-9]/)) {
			newString += string[i];
		}
	}
	//return the new string

	return newString.toLowerCase();
}

var deck1Contents = {};
var deck2Contents = {};

function addUnitToDeck(unit, deck) {
	if (deck == 'deck1') {
		decl2Conents.add(unit);
	} else {
		if (deck2Contents[unit] == undefined) {
			deck2Contents[unit] = 1;
		} else {
			deck2Contents[unit]++;
		}
	}
}

//#region views-contents-headers

const unit_view = document.createElement('div');
unit_view.id = 'unit_view-h';
unit_view.classList.add('view');
const unit_view_header = document.createElement('div');
unit_view_header.classList.add('view_header');
unit_view.appendChild(unit_view_header);
const unit_content = document.createElement('div');
unit_content.classList.add('view_content');
unit_content.id = 'unit_content';
unit_view.appendChild(unit_content);

const deck_view = document.createElement('div');
deck_view.id = 'deck_view-h';
deck_view.classList.add('view');
const deck_view_header = document.createElement('div');
deck_view_header.classList.add('view_header');
deck_view.appendChild(deck_view_header);
const deck_content = document.createElement('div');
deck_content.classList.add('view_content');
deck_content.id = 'deck_content';
deck_view.appendChild(deck_content);

const stats_view = document.createElement('div');
stats_view.id = 'stats_view-h';
stats_view.classList.add('view');
const stats_view_header = document.createElement('div');
stats_view_header.classList.add('view_header');
stats_view.appendChild(stats_view_header);
const stats_content = document.createElement('div');
stats_content.classList.add('view_content');
stats_content.id = 'stats_content';
stats_view.appendChild(stats_content);

const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
wrapper.appendChild(unit_view);
wrapper.appendChild(deck_view);
wrapper.appendChild(stats_view);
//set the wrapper width and height to the size of the window

document.body.appendChild(wrapper);

//#endregion

//#region deck-header

const deck1_button = document.createElement('button');
deck1_button.innerHTML = 'Deck 1';
deck1_button.id = 'deck1_button';
deck1_button.classList.add('header_element');
deck_view_header.appendChild(deck1_button);
const deck2_button = document.createElement('button');
deck2_button.innerHTML = 'Deck 2';
deck2_button.id = 'deck2_button';
deck2_button.classList.add('header_element');
deck_view_header.appendChild(deck2_button);

//#endregion

//#region stats-header

const stats_button = document.createElement('button');
stats_button.innerHTML = 'stats';
stats_button.id = 'deck1_button';
stats_button.classList.add('header_element');
stats_view_header.appendChild(stats_button);
const compare_button = document.createElement('button');
compare_button.innerHTML = 'compare';
compare_button.id = 'deck2_button';
compare_button.classList.add('header_element');
stats_view_header.appendChild(compare_button);

//#endregion

//#region load-units loads unit.json files

//load units.json
var jsonUnitsBase = require('./units.json');
var jsonUnitsDatamined = require('./unit_datamined.json');
var jsonUnitsZaokret = require('./Zaokret_units.json');

//#endregion

//#region unit-creation creates units from the loaded json files
//create an empty object to use as a base of the units, that has a new constructor to create a object
class Unit {
	constructor(jsonEntry) {
		Object.keys(jsonEntry).forEach((key) => {
			//if key == 'name' call the removeSpaces function to make the new variable
			var cleanNameKey = key;
			cleanNameKey = removeSpacesCapitalsSpecialCharacters(key);
			var value = jsonEntry[key];
			if (value.constructor == String) {
				value = removeSpacesCapitalsSpecialCharacters(value);
			}
			if (key == 'image') {
				value = jsonEntry.Name;
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
			var tags = [];
			if (this.attacktype != '') tags.push(this['attacktype']);
			if (this.attacktype2 != '') tags.push(this['attacktype2']);
			if (this.unittype != '') tags.push(this['unittype']);
		});
		//#tag testheader this works for testing the unit table header
		//this['testHeader'] = 'test';

		//sort each key in this alphabetically
		//this.sortObjectKeys(this);
		unitList.push(this);
		console.log('pushing unit to unit_list');
		console.log(this);
	}
}
//#endregion

//#region unit-header
//label
const sort_label = document.createElement('p');
sort_label.innerHTML = 'sort: ';
unit_view_header.appendChild(sort_label);
//create a dropdown selector for sorting
const unit_header_sort = document.createElement('select');
//add an option called test
unit_header_sort.options.add(new Option('name', 'name'));
unit_header_sort.options.add(new Option('health', 'health'));
unit_header_sort.options.add(new Option('damage', 'damage'));
unit_header_sort.options.add(new Option('speed', 'speed'));
unit_header_sort.options.add(new Option('range', 'range'));
unit_header_sort.options.add(new Option('matter', 'matter'));
unit_header_sort.options.add(new Option('energy', 'energy'));
unit_header_sort.options.add(new Option('bandwidth', 'bandwidth'));
unit_header_sort.options.add(new Option('ability', 'ability'));
unit_header_sort.options.add(new Option('building', 'building'));
unit_header_sort.options.add(new Option('tier', 'tier'));

unit_header_sort.id = 'unit_header_sort';
unit_header_sort.classList.add('header_element');
unit_view_header.appendChild(unit_header_sort);
//label
const view_label = document.createElement('p');
view_label.innerHTML = 'view: ';
unit_view_header.appendChild(view_label);
//table view button
const unit_view_table_btn = document.createElement('button');
unit_view_table_btn.innerHTML = 'table';
unit_view_table_btn.id = 'unit_view_table_btn';
unit_view_table_btn.classList.add('header_element');
unit_view_header.appendChild(unit_view_table_btn);
//card view button
const unit_view_card_btn = document.createElement('button');
unit_view_card_btn.innerHTML = 'card';
unit_view_card_btn.id = 'unit_view_card_btn';
unit_view_card_btn.classList.add('header_element');
unit_view_header.appendChild(unit_view_card_btn);
//#endregion
var unitList = [];

for (let i = 0; i < jsonUnitsBase.length; i++) {
	new Unit(jsonUnitsBase[i]);
	console.log(i);
}
function redrawUnitContent() {
	/* unit.json context Amazon Q:
[
	{
		"Name": "Blink",
		"Image": "blink",
		"Health": 2,
		"Damage": 1,
		"Speed": 3,
		"Range": 2,
		"Matter": 100,
		"Energy": 0,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "Blink",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "Air",
		"Other": ""
	},
	{
		"Name": "Blink Hunter",
		"Image": "blinkhunter",
		"Health": 2,
		"Damage": 1,
		"Speed": 2,
		"Range": 2,
		"Matter": 75,
		"Energy": 25,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "Blink",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Crab",
		"Image": "crab",
		"Health": 4,
		"Damage": 2,
		"Speed": 3,
		"Range": 1,
		"Matter": 100,
		"Energy": 0,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "Air",
		"Other": ""
	},
	{
		"Name": "Gunbot",
		"Image": "gunbot",
		"Health": 1,
		"Damage": 1,
		"Speed": 2,
		"Range": 2,
		"Matter": 50,
		"Energy": 0,
		"Bandwidth": 1,
		"Building": "Core",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "Overclock",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "Air",
		"Other": ""
	},
	{
		"Name": "Hornet",
		"Image": "hornet",
		"Health": 1,
		"Damage": 2,
		"Speed": 5,
		"Range": 2,
		"Matter": 75,
		"Energy": 25,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Hunter",
		"Image": "hunter",
		"Health": 2,
		"Damage": 1,
		"Speed": 2,
		"Range": 2,
		"Matter": 75,
		"Energy": 25,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Missilebot",
		"Image": "missilebot",
		"Health": 2,
		"Damage": 2,
		"Speed": 2,
		"Range": 2,
		"Matter": 75,
		"Energy": 25,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "Overclock",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Recall",
		"Image": "recall",
		"Health": 2,
		"Damage": 1,
		"Speed": 2,
		"Range": 2,
		"Matter": 100,
		"Energy": 0,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "Recall",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "Air",
		"Other": ""
	},
	{
		"Name": "Recall Hunter",
		"Image": "recallhunter",
		"Health": 2,
		"Damage": 2,
		"Speed": 1,
		"Range": 2,
		"Matter": 75,
		"Energy": 25,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "Recall",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Wasp",
		"Image": "wasp",
		"Health": 1,
		"Damage": 1,
		"Speed": 5,
		"Range": 1,
		"Matter": 25,
		"Energy": 0,
		"Bandwidth": 1,
		"Building": "Core",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "Air",
		"Other": ""
	},
	{
		"Name": "Beetle",
		"Image": "beetle",
		"Health": 2,
		"Damage": 1,
		"Speed": 2,
		"Range": 2,
		"Matter": 75,
		"Energy": 25,
		"Bandwidth": 2,
		"Building": "Core",
		"Attack Type": "Versatile",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Scorpion",
		"Image": "scorpion",
		"Health": 3,
		"Damage": 1,
		"Speed": 3,
		"Range": 1,
		"Matter": 50,
		"Energy": 0,
		"Bandwidth": 1,
		"Building": "Core",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "Air",
		"Other": ""
	},
	{
		"Name": "Ballista",
		"Image": "ballista",
		"Health": 2,
		"Damage": 5,
		"Speed": 2,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "High Health",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Bomber",
		"Image": "bomber",
		"Health": 1,
		"Damage": 5,
		"Speed": 5,
		"Range": 1,
		"Matter": 50,
		"Energy": 50,
		"Bandwidth": 2,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "Self Destructs",
		"Strong Against": "Core Units",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "High Health",
		"Other": ""
	},
	{
		"Name": "Crusader",
		"Image": "crusader",
		"Health": 5,
		"Damage": 4,
		"Speed": 3,
		"Range": 1,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Splash",
		"StrongAgainst 2": "",
		"Weak Against": "Burst",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Destroyer",
		"Image": "destroyer",
		"Health": 3,
		"Damage": 5,
		"Speed": 2,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Burst",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "High Health",
		"StrongAgainst 2": "",
		"Weak Against": "Core Units",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "King Crab",
		"Image": "kingcrab",
		"Health": 4,
		"Damage": 5,
		"Speed": 3,
		"Range": 1,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Splash",
		"StrongAgainst 2": "",
		"Weak Against": "Burst",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Mortar",
		"Image": "mortar",
		"Health": 4,
		"Damage": 5,
		"Speed": 2,
		"Range": 5,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "Setup",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Long Range",
		"Weak Against 2": "",
		"Other": "Long Range"
	},
	{
		"Name": "Recall Shocker",
		"Image": "recallshocker",
		"Health": 3,
		"Damage": 5,
		"Speed": 1,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "Recall",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "High Health",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Shocker",
		"Image": "shocker",
		"Health": 3,
		"Damage": 5,
		"Speed": 2,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Core Units",
		"StrongAgainst 2": "",
		"Weak Against": "High Health",
		"Weak Against 2": "",
		"Other": "Shock Splash"
	},
	{
		"Name": "Turret",
		"Image": "",
		"Health": 4,
		"Damage": 2,
		"Speed": 1,
		"Range": 4,
		"Matter": 100,
		"Energy": 50,
		"Bandwidth": 0,
		"Building": "Foundry",
		"Attack Type": "Versatile",
		"Attack Type 2": "",
		"Unit Type": "Base defense",
		"Ability": "",
		"Strong Against": "Harassment",
		"StrongAgainst 2": "",
		"Weak Against": "Long Range",
		"Weak Against 2": "",
		"Other": "Placed"
	},
	{
		"Name": "Raider",
		"Image": "",
		"Health": 3,
		"Damage": 5,
		"Speed": 4,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Worker",
		"Attack Type 2": "Workers",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "",
		"Weak Against 2": "",
		"Other": "Only attacks workers"
	},
	{
		"Name": "Heavy Hunter",
		"Image": "",
		"Health": 4,
		"Damage": 4,
		"Speed": 3,
		"Range": 3,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Swift Shocker",
		"Image": "swiftshocker",
		"Health": 2,
		"Damage": 5,
		"Speed": 4,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Core Units",
		"StrongAgainst 2": "",
		"Weak Against": "High Health",
		"Weak Against 2": "",
		"Other": "Shock Splash"
	},
	{
		"Name": "Mammoth",
		"Image": "",
		"Health": 5,
		"Damage": 3,
		"Speed": 3,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Starforge",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Splash",
		"StrongAgainst 2": "",
		"Weak Against": "Burst",
		"Weak Against 2": "",
		"Other": "Durable"
	},
	{
		"Name": "Heavy Turret",
		"Image": "heavyturret",
		"Health": 5,
		"Damage": 4,
		"Speed": 1,
		"Range": 4,
		"Matter": 200,
		"Energy": 100,
		"Bandwidth": 0,
		"Building": "Starforge",
		"Attack Type": "Versatile",
		"Attack Type 2": "",
		"Unit Type": "Base defense",
		"Ability": "",
		"Strong Against": "Harassment",
		"StrongAgainst 2": "",
		"Weak Against": "Long Range",
		"Weak Against 2": "",
		"Other": "Placed"
	},
	{
		"Name": "Stinger",
		"Image": "stinger",
		"Health": 3,
		"Damage": 5,
		"Speed": 5,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Starforge",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "",
		"Other": "Strong With Melee"
	},
	{
		"Name": "Advanced Recall",
		"Image": "advancedrecall",
		"Health": 1,
		"Damage": 3,
		"Speed": 2,
		"Range": 2,
		"Matter": 50,
		"Energy": 50,
		"Bandwidth": 2,
		"Building": "Starforge",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "Recall",
		"Strong Against": "Ground",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Airship",
		"Image": "airship",
		"Health": 4,
		"Damage": 4,
		"Speed": 3,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Starforge",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "",
		"Weak Against 2": "",
		"Other": "Air2Air Specialist"
	},
	{
		"Name": "Falcon",
		"Image": "falcon",
		"Health": 4,
		"Damage": 3,
		"Speed": 1,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Starforge",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "Ground",
		"StrongAgainst 2": "",
		"Weak Against": "Anti-Air",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Dragonfly",
		"Image": "dragonfly",
		"Health": 4,
		"Damage": 3,
		"Speed": 4,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Starforge",
		"Attack Type": "Versatile",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Anti-Air",
		"Weak Against 2": "",
		"Other": "Mobile Harassment"
	},
	{
		"Name": "Butterfly",
		"Image": "butterfly",
		"Health": 1,
		"Damage": 5,
		"Speed": 3,
		"Range": 2,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Starforge",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "Ground",
		"StrongAgainst 2": "",
		"Weak Against": "Anti-Air",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Predator",
		"Image": "predator",
		"Health": 2,
		"Damage": 5,
		"Speed": 2,
		"Range": 5,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Advanced Foundry",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground",
		"Weak Against 2": "",
		"Other": "Long Range"
	},
	{
		"Name": "Assaultbot",
		"Image": "",
		"Health": 1,
		"Damage": 2,
		"Speed": 2,
		"Range": 2,
		"Matter": 50,
		"Energy": 0,
		"Bandwidth": 1,
		"Building": "Advanced Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Ground",
		"StrongAgainst 2": "",
		"Weak Against": "Splash",
		"Weak Against 2": "",
		"Other": ""
	},
	{
		"Name": "Behemoth",
		"Image": "",
		"Health": 5,
		"Damage": 4,
		"Speed": 3,
		"Range": 2,
		"Matter": 250,
		"Energy": 0,
		"Bandwidth": 5,
		"Building": "Advanced Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Splash",
		"StrongAgainst 2": "",
		"Weak Against": "Burst",
		"Weak Against 2": "",
		"Other": "Durable"
	},
	{
		"Name": "Sniper",
		"Image": "sniper",
		"Health": 2,
		"Damage": 4,
		"Speed": 1,
		"Range": 5,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Advanced Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Slow Units",
		"StrongAgainst 2": "",
		"Weak Against": "Fast Units",
		"Weak Against 2": "",
		"Other": "Long Range"
	},
	{
		"Name": "Heavy Ballista",
		"Image": "heavyballista",
		"Health": 4,
		"Damage": 5,
		"Speed": 2,
		"Range": 2,
		"Matter": 250,
		"Energy": 250,
		"Bandwidth": 10,
		"Building": "Advanced Foundry",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "Splash",
		"Unit Type": "Ground",
		"Ability": "",
		"Strong Against": "Core Units",
		"StrongAgainst 2": "",
		"Weak Against": "High Health",
		"Weak Against 2": "",
		"Other": "High Bandwidth"
	},
	{
		"Name": "Valkyrie",
		"Image": "valkyrie",
		"Health": 4,
		"Damage": 5,
		"Speed": 3,
		"Range": 3,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Advanced Starforge",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "Air",
		"StrongAgainst 2": "",
		"Weak Against": "Ground Anti-Air",
		"Weak Against 2": "",
		"Other": "Air2Air Specialist"
	},
	{
		"Name": "Locust",
		"Image": "locust",
		"Health": 1,
		"Damage": 2,
		"Speed": 4,
		"Range": 2,
		"Matter": 50,
		"Energy": 50,
		"Bandwidth": 2,
		"Building": "Advanced Starforge",
		"Attack Type": "Versatile",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "",
		"StrongAgainst 2": "",
		"Weak Against": "Anti-Air",
		"Weak Against 2": "",
		"Other": "Mobile Harassment"
	},
	{
		"Name": "Katbus",
		"Image": "katbus",
		"Health": 5,
		"Damage": 5,
		"Speed": 2,
		"Range": 2,
		"Matter": 250,
		"Energy": 250,
		"Bandwidth": 10,
		"Building": "Advanced Starforge",
		"Attack Type": "Anti-Ground",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "Ground",
		"StrongAgainst 2": "Splash",
		"Weak Against": "Anti-Air",
		"Weak Against 2": "",
		"Other": "High Bandwidth"
	},
	{
		"Name": "Bulwark",
		"Image": "bulwark",
		"Health": 5,
		"Damage": 5,
		"Speed": 1,
		"Range": 2,
		"Matter": 250,
		"Energy": 250,
		"Bandwidth": 10,
		"Building": "Advanced Starforge",
		"Attack Type": "Versatile",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Strong Against": "Ground",
		"StrongAgainst 2": "",
		"Weak Against": "Anti-Air",
		"Weak Against 2": "",
		"Other": "High Bandwidth"
	}
]
*/

	/* unit_datamined.json context Amazon Q:
[
	{
		"Id": 1,
		"Name": "Gunbot",
		"Health": 600,
		"Speed": 6.3,
		"BaseAttack": 50,
		"AttackSpeed": 0.7,
		"PrimaryCost": 50,
		"SecondaryCost": 0,
		"Supply": 1,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 10,
		"HealthPerPrimary": 12,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 50, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 1, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 2,
		"Name": "Wasp",
		"Health": 500,
		"Speed": 13.16,
		"BaseAttack": 40,
		"AttackSpeed": 0.5,
		"PrimaryCost": 25,
		"SecondaryCost": 0,
		"Supply": 1,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 0.2,
		"HealthPerPrimary": 20,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 40, "DamageType": 0 },
			{ "Labels": [23], "Damage": -15, "DamageType": 0 },
			{ "Labels": [25], "Damage": 15, "DamageType": 0 },
			{ "Labels": [19], "Damage": -10, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 6,
		"Name": "MissileBot",
		"Health": 1000,
		"Speed": 6.3,
		"BaseAttack": 80,
		"AttackSpeed": 0.8,
		"PrimaryCost": 75,
		"SecondaryCost": 25,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.9,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 10,
		"HealthPerPrimary": 13.33,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 80, "DamageType": 0 },
			{ "Labels": [2], "Damage": 48, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 8,
		"Name": "Bomber",
		"Health": 600,
		"Speed": 13.16,
		"BaseAttack": 250,
		"AttackSpeed": 0,
		"PrimaryCost": 50,
		"SecondaryCost": 50,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 4.5,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 0.2,
		"HealthPerPrimary": 12,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 250, "DamageType": 0 },
			{ "Labels": [22], "Damage": 200, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 9,
		"Name": "Mortar",
		"Health": 2400,
		"Speed": 6.3,
		"BaseAttack": 600,
		"AttackSpeed": 1.3,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.5,
		"SplashRadius": 2,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 22,
		"HealthPerPrimary": 19.2,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 600, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 1, "AimingTurnSpeed": 360, "AimingReturnDelay": 1 }
	},
	{
		"Id": 11,
		"Name": "Dragonfly",
		"Health": 2200,
		"Speed": 11.2,
		"BaseAttack": 170,
		"AttackSpeed": 0.75,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.1,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 6,
		"HealthPerPrimary": 17.6,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1, 2], "Damage": 170, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 13,
		"Name": "Falcon",
		"Health": 2900,
		"Speed": 5.24,
		"BaseAttack": 220,
		"AttackSpeed": 0.7,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.2,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 10,
		"HealthPerPrimary": 23.2,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 220, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 300, "HasAimingRotation": 1, "AimingTurnSpeed": 900, "AimingReturnDelay": 1 }
	},
	{
		"Id": 14,
		"Name": "Predator",
		"Health": 1250,
		"Speed": 6.3,
		"BaseAttack": 100,
		"AttackSpeed": 2.6,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.5,
		"SplashRadius": 2.5,
		"TechTier": 2,
		"TechBuilding": 1,
		"Range": 22,
		"HealthPerPrimary": 10,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 100, "DamageType": 0 },
			{ "Labels": [2], "Damage": 400, "DamageType": 0 },
			{ "Labels": [26], "Damage": 1200, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 1, "AimingTurnSpeed": 300, "AimingReturnDelay": 1.5 }
	},
	{
		"Id": 17,
		"Name": "Crusader",
		"Health": 7500,
		"Speed": 8.26,
		"BaseAttack": 280,
		"AttackSpeed": 0.65,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 2,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 2,
		"HealthPerPrimary": 60,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 27, "Label": "Uber Ground" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 280, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 20,
		"Name": "Turret",
		"Health": 2600,
		"Speed": 0,
		"BaseAttack": 170,
		"AttackSpeed": 0.9,
		"PrimaryCost": 100,
		"SecondaryCost": 50,
		"Supply": 0,
		"VisionRange": 24,
		"Radius": 0.5,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 15,
		"HealthPerPrimary": 26,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 8, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 170, "DamageType": 0 },
			{ "Labels": [29], "Damage": 1300, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 0, "HasAimingRotation": 1, "AimingTurnSpeed": 600, "AimingReturnDelay": 3 }
	},
	{
		"Id": 24,
		"Name": "Beetle",
		"Health": 1200,
		"Speed": 7.88,
		"BaseAttack": 170,
		"AttackSpeed": 1.5,
		"PrimaryCost": 75,
		"SecondaryCost": 25,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.95,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 10,
		"HealthPerPrimary": 16,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1, 2], "Damage": 170, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 800, "HasAimingRotation": 1, "AimingTurnSpeed": 800, "AimingReturnDelay": 1 }
	},
	{
		"Id": 25,
		"Name": "Hornet",
		"Health": 650,
		"Speed": 13.16,
		"BaseAttack": 18,
		"AttackSpeed": 0.2,
		"PrimaryCost": 75,
		"SecondaryCost": 25,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 1,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 10,
		"HealthPerPrimary": 8.67,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 3, "Label": "" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 18, "DamageType": 0 },
			{ "Labels": [2], "Damage": 18, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1600, "HasAimingRotation": 1, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 27,
		"Name": "Scorpion",
		"Health": 1300,
		"Speed": 9.44,
		"BaseAttack": 120,
		"AttackSpeed": 1.25,
		"PrimaryCost": 50,
		"SecondaryCost": 0,
		"Supply": 1,
		"VisionRange": 24,
		"Radius": 0.9,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 0.2,
		"HealthPerPrimary": 26,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 120, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 28,
		"Name": "Raider",
		"Health": 1300,
		"Speed": 13.16,
		"BaseAttack": 600,
		"AttackSpeed": 0.4,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 36,
		"Radius": 1.2,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 8,
		"HealthPerPrimary": 10.4,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 20, "Label": "" },
			{ "Id": 29, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [19], "Damage": 600, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 600, "HasAimingRotation": 1, "AimingTurnSpeed": 900, "AimingReturnDelay": 1 }
	},
	{
		"Id": 29,
		"Name": "Katbus",
		"Health": 11000,
		"Speed": 7.88,
		"BaseAttack": 150,
		"AttackSpeed": 0.25,
		"PrimaryCost": 250,
		"SecondaryCost": 250,
		"Supply": 10,
		"VisionRange": 24,
		"Radius": 2.2,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 2,
		"Range": 8,
		"HealthPerPrimary": 44,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 16, "Label": "" },
			{ "Id": 26, "Label": "Uber Air" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 150, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 100, "HasAimingRotation": 1, "AimingTurnSpeed": 300, "AimingReturnDelay": 1 }
	},
	{
		"Id": 30,
		"Name": "Valkyrie",
		"Health": 2200,
		"Speed": 9.44,
		"BaseAttack": 100,
		"AttackSpeed": 0.65,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.3,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 2,
		"Range": 12,
		"HealthPerPrimary": 17.6,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 100, "DamageType": 0 },
			{ "Labels": [2], "Damage": 275, "DamageType": 0 },
			{ "Labels": [26], "Damage": 180, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 400, "HasAimingRotation": 1, "AimingTurnSpeed": 800, "AimingReturnDelay": 1 }
	},
	{
		"Id": 32,
		"Name": "Sniper",
		"Health": 1000,
		"Speed": 5.24,
		"BaseAttack": 700,
		"AttackSpeed": 1.8,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 1,
		"Range": 23,
		"HealthPerPrimary": 8,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 700, "DamageType": 0 },
			{ "Labels": [27], "Damage": -350, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 1, "AimingTurnSpeed": 300, "AimingReturnDelay": 1.6 }
	},
	{
		"Id": 34,
		"Name": "Recall",
		"Health": 1200,
		"Speed": 6.3,
		"BaseAttack": 170,
		"AttackSpeed": 1.15,
		"PrimaryCost": 100,
		"SecondaryCost": 0,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.9,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 8,
		"HealthPerPrimary": 12,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" },
			{ "Id": 25, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 170, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 35,
		"Name": "BlinkHunter",
		"Health": 1000,
		"Speed": 7.88,
		"BaseAttack": 95,
		"AttackSpeed": 1.25,
		"PrimaryCost": 75,
		"SecondaryCost": 25,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 10,
		"HealthPerPrimary": 13.33,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 95, "DamageType": 0 },
			{ "Labels": [2], "Damage": 65, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 37,
		"Name": "Advancedbot",
		"Health": 650,
		"Speed": 6.3,
		"BaseAttack": 50,
		"AttackSpeed": 0.4,
		"PrimaryCost": 50,
		"SecondaryCost": 0,
		"Supply": 1,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 2,
		"Range": 10,
		"HealthPerPrimary": 13,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 50, "DamageType": 0 },
			{ "Labels": [2], "Damage": 15, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 38,
		"Name": "HeavyHunter",
		"Health": 2500,
		"Speed": 9.44,
		"BaseAttack": 300,
		"AttackSpeed": 1.25,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.5,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 14,
		"HealthPerPrimary": 20,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 300, "DamageType": 0 },
			{ "Labels": [2], "Damage": 450, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 600, "HasAimingRotation": 1, "AimingTurnSpeed": 600, "AimingReturnDelay": 2 }
	},
	{
		"Id": 39,
		"Name": "Assaultbot",
		"Health": 650,
		"Speed": 6.3,
		"BaseAttack": 70,
		"AttackSpeed": 0.4,
		"PrimaryCost": 50,
		"SecondaryCost": 0,
		"Supply": 1,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 1,
		"Range": 10,
		"HealthPerPrimary": 13,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 70, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 900, "HasAimingRotation": 1, "AimingTurnSpeed": 500, "AimingReturnDelay": 1.5 }
	},
	{
		"Id": 40,
		"Name": "RecallHunter",
		"Health": 1000,
		"Speed": 5.24,
		"BaseAttack": 140,
		"AttackSpeed": 1.25,
		"PrimaryCost": 75,
		"SecondaryCost": 25,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.9,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 10,
		"HealthPerPrimary": 13.33,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 22, "Label": "" },
			{ "Id": 25, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 140, "DamageType": 0 },
			{ "Labels": [2], "Damage": 60, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 41,
		"Name": "Shocker",
		"Health": 1400,
		"Speed": 6.3,
		"BaseAttack": 600,
		"AttackSpeed": 2.6,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.7,
		"SplashRadius": 2.5,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 10,
		"HealthPerPrimary": 11.2,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 600, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 200, "HasAimingRotation": 1, "AimingTurnSpeed": 800, "AimingReturnDelay": 2 }
	},
	{
		"Id": 42,
		"Name": "Blink",
		"Health": 1200,
		"Speed": 8.26,
		"BaseAttack": 120,
		"AttackSpeed": 1.15,
		"PrimaryCost": 100,
		"SecondaryCost": 0,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.9,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 8,
		"HealthPerPrimary": 12,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 120, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 47,
		"Name": "Bulwark",
		"Health": 6000,
		"Speed": 5.24,
		"BaseAttack": 280,
		"AttackSpeed": 0.5,
		"PrimaryCost": 250,
		"SecondaryCost": 250,
		"Supply": 10,
		"VisionRange": 24,
		"Radius": 2.2,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 2,
		"Range": 10,
		"HealthPerPrimary": 24,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 26, "Label": "Uber Air" }
		],
		"DamageBonuses": [{ "Labels": [1, 2], "Damage": 280, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 100, "HasAimingRotation": 1, "AimingTurnSpeed": 300, "AimingReturnDelay": 1 }
	},
	{
		"Id": 48,
		"Name": "Kraken",
		"Health": 95000,
		"Speed": 6.3,
		"BaseAttack": 1000,
		"AttackSpeed": 0.35,
		"PrimaryCost": 3000,
		"SecondaryCost": 3000,
		"Supply": 80,
		"VisionRange": 24,
		"Radius": 3,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 2,
		"Range": 12,
		"HealthPerPrimary": 31.67,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 3, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" },
			{ "Id": 2, "Label": "Air" },
			{ "Id": 26, "Label": "Uber Air" }
		],
		"DamageBonuses": [{ "Labels": [1, 2], "Damage": 1000, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 70, "HasAimingRotation": 1, "AimingTurnSpeed": 1080, "AimingReturnDelay": 0.1 }
	},
	{
		"Id": 49,
		"Name": "Artillery",
		"Health": 1400,
		"Speed": 5.24,
		"BaseAttack": 600,
		"AttackSpeed": 2.8,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.4,
		"SplashRadius": 2.5,
		"TechTier": 2,
		"TechBuilding": 2,
		"Range": 18,
		"HealthPerPrimary": 11.2,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 600, "DamageType": 0 },
			{ "Labels": [27], "Damage": -300, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 1, "AimingTurnSpeed": 600, "AimingReturnDelay": 1.6 }
	},
	{
		"Id": 51,
		"Name": "Mammoth",
		"Health": 7000,
		"Speed": 8.26,
		"BaseAttack": 280,
		"AttackSpeed": 1,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.7,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 6,
		"HealthPerPrimary": 56,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 27, "Label": "Uber Ground" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 280, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 800, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 52,
		"Name": "AdvancedBlink",
		"Health": 2400,
		"Speed": 8.26,
		"BaseAttack": 160,
		"AttackSpeed": 0.85,
		"PrimaryCost": 50,
		"SecondaryCost": 50,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 1.1,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 1,
		"Range": 8,
		"HealthPerPrimary": 48,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1, 2], "Damage": 160, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 900, "HasAimingRotation": 0, "AimingTurnSpeed": 800, "AimingReturnDelay": 1 }
	},
	{
		"Id": 53,
		"Name": "HeavyTurret",
		"Health": 5200,
		"Speed": 0,
		"BaseAttack": 340,
		"AttackSpeed": 0.9,
		"PrimaryCost": 200,
		"SecondaryCost": 100,
		"Supply": 0,
		"VisionRange": 24,
		"Radius": 0.5,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 17,
		"HealthPerPrimary": 26,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 8, "Label": "" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 340, "DamageType": 0 },
			{ "Labels": [29], "Damage": 1300, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 0, "HasAimingRotation": 1, "AimingTurnSpeed": 400, "AimingReturnDelay": 3 }
	},
	{
		"Id": 54,
		"Name": "Locust",
		"Health": 600,
		"Speed": 11.2,
		"BaseAttack": 160,
		"AttackSpeed": 0.85,
		"PrimaryCost": 50,
		"SecondaryCost": 50,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.8,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 2,
		"Range": 6,
		"HealthPerPrimary": 12,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 16, "Label": "" },
			{ "Id": 15, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1, 2], "Damage": 160, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 57,
		"Name": "Behemoth",
		"Health": 7000,
		"Speed": 8.26,
		"BaseAttack": 280,
		"AttackSpeed": 0.8,
		"PrimaryCost": 250,
		"SecondaryCost": 0,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.7,
		"SplashRadius": 0,
		"TechTier": 2,
		"TechBuilding": 1,
		"Range": 6,
		"HealthPerPrimary": 28,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 27, "Label": "Uber Ground" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 280, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 230, "HasAimingRotation": 1, "AimingTurnSpeed": 416, "AimingReturnDelay": 1 }
	},
	{
		"Id": 58,
		"Name": "Destroyer",
		"Health": 1300,
		"Speed": 6.3,
		"BaseAttack": 700,
		"AttackSpeed": 3,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.5,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 12,
		"HealthPerPrimary": 10.4,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 700, "DamageType": 0 },
			{ "Labels": [27], "Damage": 4800, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 600, "HasAimingRotation": 1, "AimingTurnSpeed": 400, "AimingReturnDelay": 1.5 }
	},
	{
		"Id": 61,
		"Name": "AdvancedRecall",
		"Health": 600,
		"Speed": 6.3,
		"BaseAttack": 115,
		"AttackSpeed": 0.4,
		"PrimaryCost": 50,
		"SecondaryCost": 50,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.9,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 10,
		"HealthPerPrimary": 12,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 25, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 115, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 64,
		"Name": "SwiftShocker",
		"Health": 1000,
		"Speed": 11.2,
		"BaseAttack": 105,
		"AttackSpeed": 0.5,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.5,
		"SplashRadius": 2.5,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 8,
		"HealthPerPrimary": 8,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 105, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 800, "HasAimingRotation": 1, "AimingTurnSpeed": 200, "AimingReturnDelay": 1 }
	},
	{
		"Id": 68,
		"Name": "RecallShocker",
		"Health": 1800,
		"Speed": 4,
		"BaseAttack": 600,
		"AttackSpeed": 3,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.9,
		"SplashRadius": 2.5,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 10,
		"HealthPerPrimary": 14.4,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 25, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 600, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 200, "HasAimingRotation": 1, "AimingTurnSpeed": 700, "AimingReturnDelay": 2 }
	},
	{
		"Id": 70,
		"Name": "Stinger",
		"Health": 1300,
		"Speed": 13.16,
		"BaseAttack": 120,
		"AttackSpeed": 0.25,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.35,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 6,
		"HealthPerPrimary": 10.4,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 120, "DamageType": 0 },
			{ "Labels": [23], "Damage": -30, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 1080, "HasAimingRotation": 1, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 72,
		"Name": "Airship",
		"Health": 2200,
		"Speed": 8.26,
		"BaseAttack": 100,
		"AttackSpeed": 0.85,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.25,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 10,
		"HealthPerPrimary": 17.6,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 100, "DamageType": 0 },
			{ "Labels": [2], "Damage": 275, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 500, "HasAimingRotation": 0, "AimingTurnSpeed": 300, "AimingReturnDelay": 0.25 }
	},
	{
		"Id": 73,
		"Name": "Butterfly",
		"Health": 700,
		"Speed": 8.26,
		"BaseAttack": 220,
		"AttackSpeed": 0.45,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1,
		"SplashRadius": 0,
		"TechTier": 1,
		"TechBuilding": 2,
		"Range": 8,
		"HealthPerPrimary": 5.6,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 2, "Label": "Air" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 220, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 900, "HasAimingRotation": 1, "AimingTurnSpeed": 600, "AimingReturnDelay": 1.5 }
	},
	{
		"Id": 74,
		"Name": "Hunter",
		"Health": 1000,
		"Speed": 7.88,
		"BaseAttack": 120,
		"AttackSpeed": 1.65,
		"PrimaryCost": 75,
		"SecondaryCost": 25,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 0.9,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 10,
		"HealthPerPrimary": 13.33,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 15, "Label": "" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1, 2], "Damage": 120, "DamageType": 0 },
			{ "Labels": [2], "Damage": 60, "DamageType": 0 }
		],
		"Rotation": { "TurnSpeed": 600, "HasAimingRotation": 1, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 75,
		"Name": "Crab",
		"Health": 2200,
		"Speed": 9.44,
		"BaseAttack": 200,
		"AttackSpeed": 1.25,
		"PrimaryCost": 100,
		"SecondaryCost": 0,
		"Supply": 2,
		"VisionRange": 24,
		"Radius": 1.3,
		"SplashRadius": 0,
		"TechTier": 0,
		"TechBuilding": 0,
		"Range": 0.2,
		"HealthPerPrimary": 22,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 22, "Label": "" }
		],
		"DamageBonuses": [{ "Labels": [1], "Damage": 200, "DamageType": 0 }],
		"Rotation": { "TurnSpeed": 1400, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	},
	{
		"Id": 76,
		"Name": "Ballista",
		"Health": 1000,
		"Speed": 6.3,
		"BaseAttack": 100,
		"AttackSpeed": 0.5,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.8,
		"SplashRadius": 2.5,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 10,
		"HealthPerPrimary": 8,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 100, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 200, "HasAimingRotation": 1, "AimingTurnSpeed": 800, "AimingReturnDelay": 2 }
	},
	{
		"Id": 77,
		"Name": "HeavyBallista",
		"Health": 3600,
		"Speed": 6.3,
		"BaseAttack": 600,
		"AttackSpeed": 0.7,
		"PrimaryCost": 250,
		"SecondaryCost": 250,
		"Supply": 10,
		"VisionRange": 24,
		"Radius": 2.1,
		"SplashRadius": 2.5,
		"TechTier": 2,
		"TechBuilding": 1,
		"Range": 10,
		"HealthPerPrimary": 14.4,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 600, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 200, "HasAimingRotation": 1, "AimingTurnSpeed": 800, "AimingReturnDelay": 2 }
	},
	{
		"Id": 80,
		"Name": "KingCrab",
		"Health": 3500,
		"Speed": 8.26,
		"BaseAttack": 350,
		"AttackSpeed": 0.5,
		"PrimaryCost": 125,
		"SecondaryCost": 125,
		"Supply": 5,
		"VisionRange": 24,
		"Radius": 1.9,
		"SplashRadius": 1,
		"TechTier": 1,
		"TechBuilding": 1,
		"Range": 2,
		"HealthPerPrimary": 28,
		"TargetFilter": 0,
		"Labels": [
			{ "Id": 1, "Label": "Ground" },
			{ "Id": 16, "Label": "" },
			{ "Id": 27, "Label": "Uber Ground" }
		],
		"DamageBonuses": [
			{ "Labels": [1], "Damage": 350, "DamageType": 0 },
			{ "Labels": [19], "Damage": -100, "DamageType": 0 },
			{ "Labels": [28], "Damage": -0.2, "DamageType": 1 }
		],
		"Rotation": { "TurnSpeed": 700, "HasAimingRotation": 0, "AimingTurnSpeed": 1080, "AimingReturnDelay": 1 }
	}
]

*/

	/* unit_zaokret.json context Amazon Q:
[
	{
		"costBandwidth": 2,
		"costMatter": 100,
		"costEnergy": 0,
		"name": "Crab",
		"statDamage": 2,
		"statHealth": 4,
		"statRange": 1,
		"statSpeed": 3,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": null,
		"unitTag": "Anti-Ground Melee Ground Unit",
		"unitTagArray": ["Anti-Ground", "Melee", "Ground"],
		"slug": "crab",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/crab.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/crab.mp4",
		"website": "https://www.playbattleaces.com/units/crab",
		"image": "https://cdn.playbattleaces.com/images/icons/units/crab.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 75,
		"costEnergy": 25,
		"name": "Hunter",
		"statDamage": 1,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": null,
		"unitTag": "Anti-Air Ground Unit",
		"unitTagArray": ["Anti-Air", "Ground"],
		"slug": "hunter",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/hunter.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/hunter.mp4",
		"website": "https://www.playbattleaces.com/units/hunter",
		"image": "https://cdn.playbattleaces.com/images/icons/units/hunter.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 100,
		"costEnergy": 0,
		"name": "Recall",
		"statDamage": 1,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": "Recall",
		"unitTag": "Anti-Ground Ground Unit",
		"unitTagArray": ["Anti-Ground", "Ground"],
		"slug": "recall",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/recall.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/recall.mp4",
		"website": "https://www.playbattleaces.com/units/recall",
		"image": "https://cdn.playbattleaces.com/images/icons/units/recall.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 75,
		"costEnergy": 25,
		"name": "Recall Hunter",
		"statDamage": 2,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 1,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": "Recall",
		"unitTag": "Anti-Air Ground Unit",
		"unitTagArray": ["Anti-Air", "Ground"],
		"slug": "recallhunter",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/recallhunter.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/recallhunter.mp4",
		"website": "https://www.playbattleaces.com/units/recallhunter",
		"image": "https://cdn.playbattleaces.com/images/icons/units/recallhunter.png"
	},
	{
		"costBandwidth": 1,
		"costMatter": 50,
		"costEnergy": 0,
		"name": "Scorpion",
		"statDamage": 1,
		"statHealth": 3,
		"statRange": 1,
		"statSpeed": 3,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": null,
		"unitTag": "Anti-Ground Melee Ground Unit",
		"unitTagArray": ["Anti-Ground", "Melee", "Ground"],
		"slug": "scorpion",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/scorpion.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/scorpion.mp4",
		"website": "https://www.playbattleaces.com/units/scorpion",
		"image": "https://cdn.playbattleaces.com/images/icons/units/scorpion.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 75,
		"costEnergy": 25,
		"name": "Beetle",
		"statDamage": 1,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": null,
		"unitTag": "Versatile Ground Unit",
		"unitTagArray": ["Versatile", "Ground"],
		"slug": "beetle",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/beetle.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/beetle.mp4",
		"website": "https://www.playbattleaces.com/units/beetle",
		"image": "https://cdn.playbattleaces.com/images/icons/units/beetle.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 100,
		"costEnergy": 0,
		"name": "Blink",
		"statDamage": 1,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 3,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": "Blink",
		"unitTag": "Anti-Ground Ground Unit",
		"unitTagArray": ["Anti-Ground", "Ground"],
		"slug": "blink",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/blink.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/blink.mp4",
		"website": "https://www.playbattleaces.com/units/blink",
		"image": "https://cdn.playbattleaces.com/images/icons/units/blink.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 75,
		"costEnergy": 25,
		"name": "Blink Hunter",
		"statDamage": 1,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": "Blink",
		"unitTag": "Anti-Air Ground Unit",
		"unitTagArray": ["Anti-Air", "Ground"],
		"slug": "blinkhunter",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/blinkhunter.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/blinkhunter.mp4",
		"website": "https://www.playbattleaces.com/units/blinkhunter",
		"image": "https://cdn.playbattleaces.com/images/icons/units/blinkhunter.png"
	},
	{
		"costBandwidth": 1,
		"costMatter": 50,
		"costEnergy": 0,
		"name": "Gunbot",
		"statDamage": 1,
		"statHealth": 1,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": "Overclock",
		"unitTag": "Anti-Ground Ground Unit",
		"unitTagArray": ["Anti-Ground", "Ground"],
		"slug": "gunbot",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/gunbot.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/gunbot.mp4",
		"website": "https://www.playbattleaces.com/units/gunbot",
		"image": "https://cdn.playbattleaces.com/images/icons/units/gunbot.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 75,
		"costEnergy": 25,
		"name": "MissileBot",
		"statDamage": 2,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": "Overclock",
		"unitTag": "Anti-Air Ground Unit",
		"unitTagArray": ["Anti-Air", "Ground"],
		"slug": "missilebot",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/missilebot.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/missilebot.mp4",
		"website": "https://www.playbattleaces.com/units/missilebot",
		"image": "https://cdn.playbattleaces.com/images/icons/units/missilebot.png"
	},
	{
		"costBandwidth": 1,
		"costMatter": 25,
		"costEnergy": 0,
		"name": "Wasp",
		"statDamage": 1,
		"statHealth": 1,
		"statRange": 1,
		"statSpeed": 5,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": null,
		"unitTag": "Anti-Ground Melee Ground Unit",
		"unitTagArray": ["Anti-Ground", "Melee", "Ground"],
		"slug": "wasp",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/wasp.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/wasp.mp4",
		"website": "https://www.playbattleaces.com/units/wasp",
		"image": "https://cdn.playbattleaces.com/images/icons/units/wasp.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 75,
		"costEnergy": 25,
		"name": "Hornet",
		"statDamage": 2,
		"statHealth": 1,
		"statRange": 2,
		"statSpeed": 5,
		"techTier": "Core",
		"techTierId": 0,
		"unitAbility": null,
		"unitTag": "Anti-Air Ground Unit",
		"unitTagArray": ["Anti-Air", "Ground"],
		"slug": "hornet",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/hornet.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/hornet.mp4",
		"website": "https://www.playbattleaces.com/units/hornet",
		"image": "https://cdn.playbattleaces.com/images/icons/units/hornet.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Ballista",
		"statDamage": 5,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Ground Splash Ground Unit\n",
		"unitTagArray": ["Anti-Ground", "Splash", "Ground"],
		"slug": "ballista",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/ballista.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/ballista.mp4",
		"website": "https://www.playbattleaces.com/units/ballista",
		"image": "https://cdn.playbattleaces.com/images/icons/units/ballista.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "King Crab",
		"statDamage": 5,
		"statHealth": 4,
		"statRange": 1,
		"statSpeed": 3,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Ground Durable Melee Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Durable", "Melee", "Splash", "Ground"],
		"slug": "kingcrab",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/kingcrab.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/kingcrab.mp4",
		"website": "https://www.playbattleaces.com/units/kingcrab",
		"image": "https://cdn.playbattleaces.com/images/icons/units/kingcrab.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Crusader",
		"statDamage": 4,
		"statHealth": 5,
		"statRange": 1,
		"statSpeed": 3,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Ground Durable Melee Ground Unit",
		"unitTagArray": ["Anti-Ground", "Durable", "Melee", "Ground"],
		"slug": "crusader",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/crusader.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/crusader.mp4",
		"website": "https://www.playbattleaces.com/units/crusader",
		"image": "https://cdn.playbattleaces.com/images/icons/units/crusader.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 50,
		"costEnergy": 50,
		"name": "Bomber",
		"statDamage": 5,
		"statHealth": 1,
		"statRange": 1,
		"statSpeed": 5,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Ground Disposable Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Disposable", "Splash", "Ground"],
		"slug": "bomber",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/bomber.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/bomber.mp4",
		"website": "https://www.playbattleaces.com/units/bomber",
		"image": "https://cdn.playbattleaces.com/images/icons/units/bomber.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Shocker",
		"statDamage": 5,
		"statHealth": 3,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Ground Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Splash", "Ground"],
		"slug": "shocker",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/shocker.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/shocker.mp4",
		"website": "https://www.playbattleaces.com/units/shocker",
		"image": "https://cdn.playbattleaces.com/images/icons/units/shocker.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Recall Shocker",
		"statDamage": 5,
		"statHealth": 3,
		"statRange": 2,
		"statSpeed": 1,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": "Recall",
		"unitTag": "Anti-Ground Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Splash", "Ground"],
		"slug": "recallshocker",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/recallshocker.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/recallshocker.mp4",
		"website": "https://www.playbattleaces.com/units/recallshocker",
		"image": "https://cdn.playbattleaces.com/images/icons/units/recallshocker.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Mortar",
		"statDamage": 5,
		"statHealth": 4,
		"statRange": 5,
		"statSpeed": 2,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": "Setup",
		"unitTag": "Anti-Ground Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Splash", "Ground"],
		"slug": "mortar",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/mortar.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/mortar.mp4",
		"website": "https://www.playbattleaces.com/units/mortar",
		"image": "https://cdn.playbattleaces.com/images/icons/units/mortar.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Swift Shocker",
		"statDamage": 5,
		"statHealth": 2,
		"statRange": 2,
		"statSpeed": 4,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Ground Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Splash", "Ground"],
		"slug": "swiftshocker",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/swiftshocker.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/swiftshocker.mp4",
		"website": "https://www.playbattleaces.com/units/swiftshocker",
		"image": "https://cdn.playbattleaces.com/images/icons/units/swiftshocker.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Heavy Hunter",
		"statDamage": 4,
		"statHealth": 4,
		"statRange": 3,
		"statSpeed": 3,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Air Ground Unit",
		"unitTagArray": ["Anti-Air", "Ground"],
		"slug": "heavyhunter",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/heavyhunter.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/heavyhunter.mp4",
		"website": "https://www.playbattleaces.com/units/heavyhunter",
		"image": "https://cdn.playbattleaces.com/images/icons/units/heavyhunter.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Destroyer",
		"statDamage": 5,
		"statHealth": 3,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Ground Burst Damage Ground Unit",
		"unitTagArray": ["Anti-Ground", "Burst", "Ground"],
		"slug": "destroyer",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/destroyer.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/destroyer.mp4",
		"website": "https://www.playbattleaces.com/units/destroyer",
		"image": "https://cdn.playbattleaces.com/images/icons/units/destroyer.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Raider",
		"statDamage": 5,
		"statHealth": 3,
		"statRange": 2,
		"statSpeed": 5,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Anti-Worker Ground Unit",
		"unitTagArray": ["Anti-Worker", "Ground"],
		"slug": "raider",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/raider.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/raider.mp4",
		"website": "https://www.playbattleaces.com/units/raider",
		"image": "https://cdn.playbattleaces.com/images/icons/units/raider.png"
	},
	{
		"costBandwidth": 0,
		"costMatter": 100,
		"costEnergy": 50,
		"name": "Turret",
		"statDamage": 2,
		"statHealth": 4,
		"statRange": 4,
		"statSpeed": 0,
		"techTier": "Foundry",
		"techTierId": 1,
		"unitAbility": null,
		"unitTag": "Versatile Base Defense",
		"unitTagArray": ["Versatile", "Base-Defense"],
		"slug": "turret",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/turret.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/turret.mp4",
		"website": "https://www.playbattleaces.com/units/turret",
		"image": "https://cdn.playbattleaces.com/images/icons/units/turret.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Butterfly",
		"statDamage": 5,
		"statHealth": 1,
		"statRange": 2,
		"statSpeed": 3,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": null,
		"unitTag": "Anti-Ground Air Unit",
		"unitTagArray": ["Anti-Ground", "Air"],
		"slug": "butterfly",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/butterfly.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/butterfly.mp4",
		"website": "https://www.playbattleaces.com/units/butterfly",
		"image": "https://cdn.playbattleaces.com/images/icons/units/butterfly.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Dragonfly",
		"statDamage": 3,
		"statHealth": 4,
		"statRange": 2,
		"statSpeed": 4,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": null,
		"unitTag": "Versatile Air Unit",
		"unitTagArray": ["Versatile", "Air"],
		"slug": "dragonfly",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/dragonfly.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/dragonfly.mp4",
		"website": "https://www.playbattleaces.com/units/dragonfly",
		"image": "https://cdn.playbattleaces.com/images/icons/units/dragonfly.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Falcon",
		"statDamage": 3,
		"statHealth": 4,
		"statRange": 2,
		"statSpeed": 1,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": null,
		"unitTag": "Anti-Ground Air Unit",
		"unitTagArray": ["Anti-Ground", "Air"],
		"slug": "falcon",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/falcon.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/falcon.mp4",
		"website": "https://www.playbattleaces.com/units/falcon",
		"image": "https://cdn.playbattleaces.com/images/icons/units/falcon.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Airship",
		"statDamage": 4,
		"statHealth": 4,
		"statRange": 2,
		"statSpeed": 3,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": null,
		"unitTag": "Anti-Air Air Unit",
		"unitTagArray": ["Anti-Air", "Air"],
		"slug": "airship",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/airship.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/airship.mp4",
		"website": "https://www.playbattleaces.com/units/airship",
		"image": "https://cdn.playbattleaces.com/images/icons/units/airship.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 50,
		"costEnergy": 50,
		"name": "Advanced Recall",
		"statDamage": 3,
		"statHealth": 1,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": "Recall",
		"unitTag": "Anti-Ground Ground Unit",
		"unitTagArray": ["Anti-Ground", "Ground"],
		"slug": "advancedrecall",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/advancedrecall.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/advancedrecall.mp4",
		"website": "https://www.playbattleaces.com/units/advancedrecall",
		"image": "https://cdn.playbattleaces.com/images/icons/units/advancedrecall.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Mammoth",
		"statDamage": 3,
		"statHealth": 5,
		"statRange": 2,
		"statSpeed": 3,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": null,
		"unitTag": "Anti-Ground Durable Ground Unit",
		"unitTagArray": ["Anti-Ground", "Durable", "Ground"],
		"slug": "mammoth",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/mammoth.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/mammoth.mp4",
		"website": "https://www.playbattleaces.com/units/mammoth",
		"image": "https://cdn.playbattleaces.com/images/icons/units/mammoth.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Stinger",
		"statDamage": 5,
		"statHealth": 3,
		"statRange": 2,
		"statSpeed": 5,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": null,
		"unitTag": "Anti-Ground Fast Ground Unit",
		"unitTagArray": ["Anti-Ground", "Fast", "Ground"],
		"slug": "stinger",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/stinger.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/stinger.mp4",
		"website": "https://www.playbattleaces.com/units/stinger",
		"image": "https://cdn.playbattleaces.com/images/icons/units/stinger.png"
	},
	{
		"costBandwidth": 0,
		"costMatter": 200,
		"costEnergy": 100,
		"name": "Heavy Turret",
		"statDamage": 4,
		"statHealth": 5,
		"statRange": 4,
		"statSpeed": 0,
		"techTier": "Starforge",
		"techTierId": 2,
		"unitAbility": null,
		"unitTag": "Versatile Base Defense",
		"unitTagArray": ["Versatile", "Base-Defense"],
		"slug": "heavyturret",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/heavyturret.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/heavyturret.mp4",
		"website": "https://www.playbattleaces.com/units/heavyturret",
		"image": "https://cdn.playbattleaces.com/images/icons/units/heavyturret.png"
	},
	{
		"costBandwidth": 10,
		"costMatter": 250,
		"costEnergy": 250,
		"name": "Heavy Ballista",
		"statDamage": 5,
		"statHealth": 4,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Advanced Foundry",
		"techTierId": 3,
		"unitAbility": null,
		"unitTag": "Anti-Ground Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Splash", "Ground"],
		"slug": "heavyballista",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/heavyballista.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/heavyballista.mp4",
		"website": "https://www.playbattleaces.com/units/heavyballista",
		"image": "https://cdn.playbattleaces.com/images/icons/units/heavyballista.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Predator",
		"statDamage": 5,
		"statHealth": 2,
		"statRange": 5,
		"statSpeed": 2,
		"techTier": "Advanced Foundry",
		"techTierId": 3,
		"unitAbility": null,
		"unitTag": "Anti-Air Splash Ground Unit",
		"unitTagArray": ["Anti-Air", "Splash", "Ground"],
		"slug": "predator",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/predator.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/predator.mp4",
		"website": "https://www.playbattleaces.com/units/predator",
		"image": "https://cdn.playbattleaces.com/images/icons/units/predator.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Sniper",
		"statDamage": 4,
		"statHealth": 2,
		"statRange": 5,
		"statSpeed": 1,
		"techTier": "Advanced Foundry",
		"techTierId": 3,
		"unitAbility": null,
		"unitTag": "Versatile Long Range Ground Unit",
		"unitTagArray": ["Versatile", "Long", "Range", "Ground"],
		"slug": "sniper",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/sniper.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/sniper.mp4",
		"website": "https://www.playbattleaces.com/units/sniper",
		"image": "https://cdn.playbattleaces.com/images/icons/units/sniper.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 50,
		"costEnergy": 50,
		"name": "Advanced Blink",
		"statDamage": 2,
		"statHealth": 4,
		"statRange": 2,
		"statSpeed": 3,
		"techTier": "Advanced Foundry",
		"techTierId": 3,
		"unitAbility": "Blink",
		"unitTag": "Versatile Ground Unit",
		"unitTagArray": ["Versatile", "Ground"],
		"slug": "advancedblink",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/advancedblink.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/advancedblink.mp4",
		"website": "https://www.playbattleaces.com/units/advancedblink",
		"image": "https://cdn.playbattleaces.com/images/icons/units/advancedblink.png"
	},
	{
		"costBandwidth": 1,
		"costMatter": 50,
		"costEnergy": 0,
		"name": "Assaultbot",
		"statDamage": 2,
		"statHealth": 1,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Advanced Foundry",
		"techTierId": 3,
		"unitAbility": "Overclock",
		"unitTag": "Anti-Ground Ground Unit",
		"unitTagArray": ["Anti-Ground", "Ground"],
		"slug": "assaultbot",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/assaultbot.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/assaultbot.mp4",
		"website": "https://www.playbattleaces.com/units/assaultbot",
		"image": "https://cdn.playbattleaces.com/images/icons/units/assaultbot.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 250,
		"costEnergy": 0,
		"name": "Behemoth",
		"statDamage": 4,
		"statHealth": 5,
		"statRange": 2,
		"statSpeed": 3,
		"techTier": "Advanced Foundry",
		"techTierId": 3,
		"unitAbility": null,
		"unitTag": "Anti-Ground Durable Ground Unit",
		"unitTagArray": ["Anti-Ground", "Durable", "Ground"],
		"slug": "behemoth",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/behemoth.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/behemoth.mp4",
		"website": "https://www.playbattleaces.com/units/behemoth",
		"image": "https://cdn.playbattleaces.com/images/icons/units/behemoth.png"
	},
	{
		"costBandwidth": 10,
		"costMatter": 250,
		"costEnergy": 250,
		"name": "Bulwark",
		"statDamage": 5,
		"statHealth": 5,
		"statRange": 2,
		"statSpeed": 1,
		"techTier": "Advanced Starforge",
		"techTierId": 4,
		"unitAbility": null,
		"unitTag": "Versatile Durable Air Unit",
		"unitTagArray": ["Versatile", "Durable", "Air"],
		"slug": "bulwark",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/bulwark.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/bulwark.mp4",
		"website": "https://www.playbattleaces.com/units/bulwark",
		"image": "https://cdn.playbattleaces.com/images/icons/units/bulwark.png"
	},
	{
		"costBandwidth": 10,
		"costMatter": 250,
		"costEnergy": 250,
		"name": "Katbus",
		"statDamage": 5,
		"statHealth": 5,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Advanced Starforge",
		"techTierId": 4,
		"unitAbility": null,
		"unitTag": "Anti-Ground Durable Air Unit",
		"unitTagArray": ["Anti-Ground", "Durable", "Air"],
		"slug": "katbus",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/katbus.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/katbus.mp4",
		"website": "https://www.playbattleaces.com/units/katbus",
		"image": "https://cdn.playbattleaces.com/images/icons/units/katbus.png"
	},
	{
		"costBandwidth": 2,
		"costMatter": 50,
		"costEnergy": 50,
		"name": "Locust",
		"statDamage": 2,
		"statHealth": 1,
		"statRange": 2,
		"statSpeed": 4,
		"techTier": "Advanced Starforge",
		"techTierId": 4,
		"unitAbility": null,
		"unitTag": "Versatile Air Unit",
		"unitTagArray": ["Versatile", "Air"],
		"slug": "locust",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/locust.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/locust.mp4",
		"website": "https://www.playbattleaces.com/units/locust",
		"image": "https://cdn.playbattleaces.com/images/icons/units/locust.png"
	},
	{
		"costBandwidth": 80,
		"costMatter": 3000,
		"costEnergy": 3000,
		"name": "Kraken",
		"statDamage": 5,
		"statHealth": 5,
		"statRange": 3,
		"statSpeed": 2,
		"techTier": "Advanced Starforge",
		"techTierId": 4,
		"unitAbility": null,
		"unitTag": "Versatile Monstrous Air Unit",
		"unitTagArray": ["Versatile", "Monstrous", "Air"],
		"slug": "kraken",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/kraken.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/kraken.mp4",
		"website": "https://www.playbattleaces.com/units/kraken",
		"image": "https://cdn.playbattleaces.com/images/icons/units/kraken.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Valkyrie",
		"statDamage": 5,
		"statHealth": 4,
		"statRange": 3,
		"statSpeed": 3,
		"techTier": "Advanced Starforge",
		"techTierId": 4,
		"unitAbility": null,
		"unitTag": "Anti-Air Air Unit",
		"unitTagArray": ["Anti-Air", "Air"],
		"slug": "valkyrie",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/valkyrie.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/valkyrie.mp4",
		"website": "https://www.playbattleaces.com/units/valkyrie",
		"image": "https://cdn.playbattleaces.com/images/icons/units/valkyrie.png"
	},
	{
		"costBandwidth": 5,
		"costMatter": 125,
		"costEnergy": 125,
		"name": "Artillery",
		"statDamage": 5,
		"statHealth": 3,
		"statRange": 4,
		"statSpeed": 1,
		"techTier": "Advanced Starforge",
		"techTierId": 4,
		"unitAbility": null,
		"unitTag": "Anti-Ground Splash Ground Unit",
		"unitTagArray": ["Anti-Ground", "Splash", "Ground"],
		"slug": "artillery",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/artillery.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/artillery.mp4",
		"website": "https://www.playbattleaces.com/units/artillery",
		"image": "https://cdn.playbattleaces.com/images/icons/units/artillery.png"
	},
	{
		"costBandwidth": 1,
		"costMatter": 50,
		"costEnergy": 0,
		"name": "Advancedbot",
		"statDamage": 2,
		"statHealth": 1,
		"statRange": 2,
		"statSpeed": 2,
		"techTier": "Advanced Starforge",
		"techTierId": 4,
		"unitAbility": "Overclock",
		"unitTag": "Versatile Ground Unit",
		"unitTagArray": ["Versatile", "Ground"],
		"slug": "advancedbot",
		"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/advancedbot.mp4",
		"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/advancedbot.mp4",
		"website": "https://www.playbattleaces.com/units/advancedbot",
		"image": "https://cdn.playbattleaces.com/images/icons/units/advancedbot.png"
	}
]


*/

	//for each object in unitsJson_base create a new unit passing the object
	console.log('Redrawing Unit Content\n-----------------');
	console.log(unitList);

	//create a table element
	var unit_table = document.createElement('table');
	unit_table.id = 'unit_table';
	unit_table.classList.add('unit_table');
	//add table head
	var unit_table_head = document.createElement('thead');
	unit_table.appendChild(unit_table_head);
	//add table body
	var unit_table_body = document.createElement('tbody');
	unit_table.appendChild(unit_table_body);
	//create table header and add it to the table head
	var unit_table_header = document.createElement('th');
	unit_table_header.innerHTML = 'add';
	unit_table_head.appendChild(unit_table_header);

	//##tag unit-content-table-loop
	//this is the unit content table loop
	for (let i = 0; i < unitList.length; i++) {
		//create a table row element
		var unit_table_row = document.createElement('tr');
		unit_table_row.id = 'unit_table_row_' + i;
		unit_table_row.classList.add('unit_table_row');
		//
		//for the first row list the nake of each key as a header
		//if i == 0 then create a table header element
		//##tag unit-table-header element
		if (i == 0) {
			for (const [key, value] of Object.entries(unitList[i])) {
				if (key == 'attackrate' || key == 'slug' || key == 'videoturnaround' || key == 'videogameplay' || key == 'website' || key == 'tier') {
				} else {
					unit_table_header = document.createElement('th');
					//add some images to certain headers
					if (key == 'health' || key == 'damage' || key == 'damagea' || key == 'speed' || key == 'range' || key == 'strongtags' || key == 'weaktags') {
						var img = document.createElement('img');
						img.src = 'images/stats/' + key + '.png';
						img.classList.add('unit_table_header_image');
						img.setAttribute('alt', key);
						img.setAttribute('title', key);
						unit_table_header.appendChild(img);
					} else if (key == 'dpsg') {
						var img = document.createElement('img');
						img.src = 'images/stats/' + 'damage' + '.png';
						img.classList.add('unit_table_header_image');
						img.setAttribute('alt', 'ground dps');
						img.setAttribute('title', 'ground dps');
						unit_table_header.appendChild(img);
						unit_table_header.innerHTML += '/s';
					} else if (key == 'dpsa') {
						var img = document.createElement('img');
						img.src = 'images/stats/' + 'damagea' + '.png';
						img.classList.add('unit_table_header_image');
						img.setAttribute('alt', 'air dps');
						img.setAttribute('title', ' dps');
						unit_table_header.appendChild(img);
						unit_table_header.innerHTML += '/s';
					} else if (key == 'matter' || key == 'energy' || key == 'bandwidth') {
						var img = document.createElement('img');
						img.src = 'images/resources/' + key + '.svg';
						img.classList.add('unit_table_header_image');
						img.setAttribute('alt', key);
						img.setAttribute('title', key);
						unit_table_header.appendChild(img);
					} else if (key == 'splash' || key == 'small' || key == 'antibig' || key == 'big' || key == 'antiair') {
						var img = document.createElement('img');
						img.src = 'images/traits/' + key + '.png';
						img.classList.add('unit_table_header_image');
						img.setAttribute('alt', key);
						img.setAttribute('title', key);
						unit_table_header.appendChild(img);
					} else if (key == 'image') {
						key == 'tier';
						unit_table_header.innerHTML = 'image';
						//no header name for images
					} else if (key == 'ability') {
						unit_table_header.innerHTML = 'skill';
						//no header name for images
					} else if (key == 'tier') {
						//no header name for attacktype2
					} else if (key == 'strongagainst') {
						//no header name for strongagainst2
					} else if (key == 'weakagainst') {
						//no header name for weakagainst2
					} else if (key == 'strongagainst2') {
						//no header name for strongagainst2
					} else if (key == 'weakagainst2') {
						//no header name for weakagainst2
					} else if (key == 'manufacturer') {
						unit_table_header.innerHTML = 'manf.';
						//no header name for weakagainst2
					} else if (key == 'other') {
					} else if (key == 'building') {
						unit_table_header.innerHTML = 'tech';
					} else {
						unit_table_header.innerHTML = key;
					}

					if (key != 'attacktype' && key != 'attacktype2' && key != 'unittype') unit_table_head.appendChild(unit_table_header);
				}
			}
		}

		//create a table cell element for each unit property
		//add the unit property to the table cell
		//for each key in the current unit

		//the first cell of each row, we will add a button to add the unit to the deck
		var unit_table_cell = document.createElement('td');
		unit_table_cell.id = 'unit_table_cell_' + i;
		//add the unit property to the table cell
		var div = document.createElement('div');
		//div.innerHTML = unitList[i].name;
		unit_table_cell.appendChild(div);

		//#tag table_add_unit_button
		//add the button
		var table_add_unit_button = document.createElement('button');
		//add text to the button
		table_add_unit_button.innerHTML = '+';
		//add the button to the cell
		unit_table_cell.appendChild(table_add_unit_button);

		table_add_unit_button.onclick = function () {
			console.log('Adding unit to deck: ' + unitList[i].name);
			console.log(unitList[i]);
			//add the unit name to the unit_deck_input text box
			unit_deck_input.value += unitList[i].name + '\n';
			//addToDeck(unitList[i]);
		};

		//add the cell to the row
		unit_table_row.appendChild(unit_table_cell);

		function addToTable(key, value) {}

		for (var [key, value] of Object.entries(unitList[i])) {
			if (
				key == 'unittype' ||
				key == 'attacktype' ||
				key == 'attacktype2' ||
				key == 'strongagainst' ||
				key == 'weakagainst' ||
				key == 'strongagainst2' ||
				key == 'weakagainst2' ||
				key == 'other' ||
				key == 'attackrate' ||
				key == 'tier'
			) {
			} else {
				console.log(`${key}: ${value}`);
				var div = document.createElement('div');
				//div.innerHTML = key + ': ' + value;
				//unit_table_cell.appendChild(div)
				var unit_table_cell = document.createElement('td');
				unit_table_cell.id = 'unit_table_cell_' + i;
				unit_table_cell.appendChild(div);

				if (
					key == 'unittype' ||
					key == 'attacktype' ||
					key == 'attacktype2' ||
					key == 'other' ||
					key == 'attackrate' ||
					key == 'slug' ||
					key == 'videoturnaround' ||
					key == 'videogameplay' ||
					key == 'website'
				) {
				} else {
					unit_table_cell.classList.add('unit_table_cell');
					unit_table_row.appendChild(unit_table_cell);
				}
				if (key == 'image') {
					var img = document.createElement('img');
					img.id = 'img_unit_table_image_' + i;
					img.src = 'images/units/' + value + '.png';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unitTableImage');
					div.appendChild(img);
				} else if (key == 'building') {
					var img = document.createElement('img');
					img.id = 'img_unit_table_building_' + i;
					img.src = 'images/techtiers/' + value + '.svg';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unitTableImage');
					div.appendChild(img);
				} else if (key == 'ability') {
					if (value != '') {
						var img = document.createElement('img');
						img.id = 'img_unit_table_ability_' + i;
						img.src = 'images/abilities/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unitTableImage');
						div.appendChild(img);
					}
				} else if (key == 'manufacturer') {
					if (value != '') {
						var img = document.createElement('img');
						img.id = 'img_unit_table_manuf_' + i;
						img.src = 'images/manuf/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unitTableImage');
						div.appendChild(img);
					}
				} else if (key == 'ground') {
					div.innerHTML = 'gnd';
				} else if (key == 'splash' || key == 'small' || key == 'antibig' || key == 'big' || key == 'antiair') {
					if (value != '') {
						var img = document.createElement('img');
						img.src = 'images/traits/' + key + '.png';
						img.classList.add('unit_table_header_image');
						img.setAttribute('alt', key);
						img.setAttribute('title', key);
						div.appendChild(img);
					}
				} else {
					if (value != 0) div.innerHTML = value;
				}

				if (key == 'health' || key == 'damage' || key == 'speed' || key == 'range') {
					unit_table_cell.classList.add('unit_table_cell_stats');
				}
			}
		}
		//div.innerHTML = unitList[i].name;
		//unit_table_cell.add(div);

		//create a table body element
		unit_table_body.appendChild(unit_table_row);
	}

	//re-arrange table by the following header values
	//add, skill, image, name, health, damage, speed, range, matter, energy, bandwidth, tech, tier, tags, strongtags, weaktags
	// for each column in the table, check its name and move it to the correct position

	/* fast-sort example for context (Amazon Q):
 import { sort } from 'fast-sort';

  // Sort flat arrays
  const ascSorted = sort([1,4,2]).asc(); // => [1, 2, 4]
  const descSorted = sort([1, 4, 2]).desc(); // => [4, 2, 1]

  // Sort users (array of objects) by firstName in descending order
  const sorted = sort(users).desc(u => u.firstName);

  // Sort users in ascending order by firstName and lastName
  const sorted = sort(users).asc([
    u => u.firstName,
    u => u.lastName
  ]);

  // Sort users ascending by firstName and descending by city
  const sorted = sort(users).by([
    { asc: u => u.firstName },
    { desc: u => u.address.city }
  ]);

  // Sort based on computed property
  const sorted = sort(repositories).desc(r => r.openIssues + r.closedIssues);

  // Sort using string for object key
  // Only available for root object properties
  const sorted = sort(users).asc('firstName');
  */

	// try and sort the list using fast-sort

	/*
//for each unit in the unit_list create a table row element
for (let i = 0; i < unitList.length; i++) {
	var unit = unitList[i];
	var unit_table_row = document.createElement('tr');
	unit_table_row.id = 'unit_table_row_' + i;
	unit_table_row.className = 'unit_table_row';

	//create a table cell element for each unit property
	var unit_table_cell = document.createElement('td');
	unit_table_cell.id = 'unit_table_cell_' + i;
	//add the unit property to the table cell

	//for each key in unit,
	for (const [key, value] of Object.entries(unit)) {
		//console.log('hello world');
		console.log(`${key}: ${value}`);
		var unit_table_div = document.createElement('td');
		unit_table_div.id = 'unit_table_div_' + i + '_' + key;
		unit_table_div.innerHTML = `value`;
		unit_table_cell.appendChild(unit_table_div);
	}

	unit_table.appendChild(unit_table_row);
}
	*/

	//for each unit in unit_datamined

	//attach the unit_table to the unit_content div
	unit_content.appendChild(unit_table);
}
redrawUnitContent();
//#endregion

//#region change-sort

//create a text input box
var unit_deck_input = document.createElement('input');

function redrawDeckContent() {
	deck_content.appendChild(unit_deck_input);
}
redrawDeckContent();

//on unit_deck_input update
unit_deck_input.onchange = function () {
	console.log('unit_deck_input');
	//update the unit_content.innerHTML to the new sort by option
	deck_content.innerHTML = '';
	redrawDeckContent();
};

unit_header_sort.onchange = function () {
	//update the unit_content.innerHTML to the new sort by option
	//unit_content.innerHTML = unit_header_sort.value;
	//sort the units by the new option
	//new function for sorting units
	console.log(unit_header_sort.value);

	//sort units
	function sortUnits(value, unitlist) {
		// Sort users (array of objects) by firstName in descending order
		var sorted = sort(unitlist).desc((u) => u[value]);
		//sort the units by the new option
		//new function for sorting units
		unitList = sorted;
	}
	sortUnits(unit_header_sort.value, unitList);
	//update the unit_content.innerHTML to the new sort by option
	unit_content.innerHTML = '';
	redrawUnitContent();
};

//#endregion

//#region window-resize

//create a function that runs when the window is resized
function resize() {
	console.log('resized');
	//get the width and height of the window
	const width = window.innerWidth;
	const height = window.innerHeight;
	if (width > height) {
		unit_view.id = 'unit_view-h';
		deck_view.id = 'deck_view-h';
		stats_view.id = 'stats_view-h';
	} else {
		unit_view.id = 'unit_view-v';
		deck_view.id = 'deck_view-v';
		stats_view.id = 'stats_view-v';
	}
}
window.addEventListener('resize', resize);
resize();
//#endregion

//create a un

//#endregion

console.log(wrapper);
