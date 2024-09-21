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

//#tag define-deck-contents
var decks = []
var deck1Contents = [];
var deck2Contents = [];
var deck1Slots = [];
var deck2Slots = [];
var slotBuildings = ['core', 'foundry', 'advancedfoundry', 'wildfoundry', 'core', 'starforge', 'advancedstarforge', 'wildstarforge']
decks.push(deck1Contents, deck2Contents);

var currentDeck = 0; //currentDeck defaults to 1 until deck 2 is selected



//#region views-contents-headers definitions for all 3 views

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

//#region deck-header section of the deck view

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

//#region deck-content section of the deck view

//create a text input box
var unit_deck_input = document.createElement('input');


//create 1 div to hold all the unit deck slots
var unit_deck_slots_div = document.createElement('div');
unit_deck_slots_div.classList.add('unit_deck_slots_div');
deck_content.appendChild(unit_deck_slots_div);
//create 8 square divs
for (var i = 0; i < 8; i++) {
	var div = document.createElement('div');
	deck1Slots[i] = div
	div.classList.add('unit_deck_slot_div');
	div.id = 'unit_deck_slot_div' + i;

	var img = document.createElement('img');
	img.id = 'deckSlotImage' + i;
	img.src = 'images/techtiers/' + slotBuildings[i] + '.png';
	img.setAttribute('alt', 'deck slot' + i);
	img.setAttribute('title', 'deck slot' + i);
	img.classList.add('deckSlotImage');
	div.appendChild(img);
	console.log("hello console" + i);
	console.log(div.firstElementChild);

	unit_deck_slots_div.appendChild(div);
}

deck_content.appendChild(unit_deck_input);

function redrawDeckContent(deckID) {
	//iterate through deckslots
	var deck = decks[deckID];
	deck1Slots.forEach((slot, index) => {
		if (deck[index] == undefined) {

		}
		else {
			//slot.innerHTML = deck[index].name;
			slot.firstElementChild.src = 'images/units/' + deck[index].name + '.png';
		}
	});

}
redrawDeckContent(1);

//on unit_deck_input update
unit_deck_input.onchange = function () {
	console.log('unit_deck_input');
	redrawDeckContent();
};



function addUnitToDeck(unit, deckID) {
	var deck = decks[deckID];
	console.log('Adding unit to deck ' + deckID + ': ' + unit.name);
	//console.log(unit);about:blank#blocked
	//add the unit name to the unit_deck_input text box
	unit_deck_input.value += unit.name + '\n';
	//addToDeck(unitList[i]);
	if (deck.length < 8) deck.push(unit);
	else console.log('deck limit reached');
	console.log(deck.length + '/8');
	redrawDeckContent(deckID);
}


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
		const keyLen = Object.keys(jsonEntry).length;
		var count = 0
		Object.keys(jsonEntry).forEach((key) => {
			count++;
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

//#region unit-div-header-element
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
unit_header_sort.options.add(new Option('air damage', 'damagea'));
unit_header_sort.options.add(new Option('dps', 'dpsg'));
unit_header_sort.options.add(new Option('air dps', 'dpsa'));
unit_header_sort.options.add(new Option('speed', 'speed'));
unit_header_sort.options.add(new Option('range', 'range'));
unit_header_sort.options.add(new Option('matter', 'matter'));
unit_header_sort.options.add(new Option('energy', 'energy'));
unit_header_sort.options.add(new Option('bandwidth', 'bandwidth'));
unit_header_sort.options.add(new Option('ability', 'ability'));
unit_header_sort.options.add(new Option('building', 'building'));
unit_header_sort.options.add(new Option('tier', 'tier'));
unit_header_sort.options.add(new Option('big', 'big'));
unit_header_sort.options.add(new Option('small', 'small'));
unit_header_sort.options.add(new Option('antibig', 'antibig'));
unit_header_sort.options.add(new Option('splash', 'splash'));
unit_header_sort.options.add(new Option('antiair', 'antiair'));

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

//#region redrawUnitContent is an expensive function which draws the unit content div, including looping through each unit to load its data for display
function redrawUnitContent() {

	//for each object in unitsJson_base create a new unit passing the object
	console.log('Redrawing Unit Content\n-----------------');
	console.log(unitList);

	//create a table element
	var unit_table = document.createElement('table');
	unit_table.id = 'unit_table';
	unit_table.classList.add('unit_table');
	//add table head
	var unit_table_head = document.createElement('thead');
	unit_table_head.id = 'unit_table_head'
	unit_table.appendChild(unit_table_head);
	//add table body
	var unit_table_body = document.createElement('tbody');
	unit_table.appendChild(unit_table_body);
	//create table header and add it to the table head
	var unit_table_header = document.createElement('th');
	unit_table_header.id = 'unit_table_header'
	unit_table_header.innerHTML = 'add';
	unit_table_head.appendChild(unit_table_header);

	//##tag unit-content-table-loop
	for (const [key, value] of Object.entries(unitList[1])) {
		if (
			key == 'attackrate' ||
			key == 'tier' ||
			key == 'splash' ||
			key == 'small' ||
			key == 'big' ||
			key == 'antiair' ||
			key == 'antibig' ||
			key == 'slug' ||
			key == 'videoturnaround' ||
			key == 'videogameplay' ||
			key == 'website'
		) {
		} else {
			unit_table_header = document.createElement('th');
			//add some images to certain headers
			if (key == 'health' || key == 'damage' || key == 'damagea' || key == 'speed' || key == 'range') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + key + '.png';
				img.classList.add('unit_table_header_image');
				if (key == 'damagea') {
					img.setAttribute('alt', 'air damage');
					img.setAttribute('title', 'air damage');
				}
				else {
					img.setAttribute('alt', key);
					img.setAttribute('title', key);
				}
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
				img.setAttribute('title', ' air dps');
				unit_table_header.appendChild(img);
				unit_table_header.innerHTML += '/s';
			} else if (key == 'matter' || key == 'energy' || key == 'bandwidth') {
				var img = document.createElement('img');
				img.src = 'images/resources/' + key + '.svg';
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
			} else if (key == 'manufacturer') {
				unit_table_header.innerHTML = 'manf.';
			} else if (key == 'building') {
				unit_table_header.innerHTML = 'tech';
			} else {
				unit_table_header.innerHTML = key;
			}

			if (key != 'attacktype' && key != 'attacktype2' && key != 'unittype') unit_table_head.appendChild(unit_table_header);
		}
	}

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
			addUnitToDeck(unitList[i], currentDeck);
		};

		//add the cell to the row
		unit_table_row.appendChild(unit_table_cell);

		for (var [key, value] of Object.entries(unitList[i])) {
			if (
				key == 'attackrate' ||
				key == 'tier' ||
				key == 'splash' ||
				key == 'small' ||
				key == 'big' ||
				key == 'antiair' ||
				key == 'antibig' ||
				key == 'slug' ||
				key == 'videoturnaround' ||
				key == 'videogameplay' ||
				key == 'website'
			) {
			} else {
				console.log(`${key}: ${value}`);
				var div = document.createElement('div');
				//div.innerHTML = key + ': ' + value;
				//unit_table_cell.appendChild(div)
				var unit_table_cell = document.createElement('td');
				unit_table_cell.id = 'unit_table_cell_' + i;
				unit_table_cell.appendChild(div);

				unit_table_cell.classList.add('unit_table_cell');
				unit_table_row.appendChild(unit_table_cell);

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
				} else if (key == 'splash' || key == 'small' || key == 'antibig' || key == 'big' || key == 'antiair') {
					if (value != '') {
						var img = document.createElement('img');
						img.src = 'images/traits/' + key + '.png';
						img.classList.add('unit_table_header_image');
						img.setAttribute('alt', key);
						img.setAttribute('title', key);
						div.appendChild(img);
					}
				} else if (key == 'traits') {
					value.forEach(trait => {
						if (trait != 'none') {
							var img = document.createElement('img');
							img.src = 'images/traits/' + trait + '.png';
							img.classList.add('unit_table_image_traits');
							img.setAttribute('alt', trait);
							img.setAttribute('title', trait);
							div.appendChild(img);
						}
						else {
							div.innerHTML = value;
						}
					});
					unit_table_cell.classList.add('unit_table_cell_traits');
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

redrawUnitContent(); //upon loading the page we redraw the UnitContentDiv once to initialise it

//#endregion

//#region change-sort


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


console.log(wrapper);
