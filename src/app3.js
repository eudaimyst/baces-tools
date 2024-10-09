//create 3 divs called unit_view, deck_view and stats_view, and a wrapper to contain them
import { sort } from 'fast-sort';
import Chart from 'chart.js/auto';

//load units.json

//#tag load-unit-json
var jsonUnitsBase = require('./units.json');
var unitList = [];

var lastSortValue = 'name';

//#region unit-definition creates units from json entry
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
			var cleanValue = removeSpacesCapitalsSpecialCharacters(value)
			if (value.constructor == String) {
				if (cleanNameKey != 'emoji' && cleanNameKey != 'name' && cleanNameKey != 'videoturnaround') {
					value = cleanValue;
				}
			}
			if (key == 'image') {
				value = removeSpacesCapitalsSpecialCharacters(jsonEntry.Name);
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


for (let i = 0; i < jsonUnitsBase.length; i++) {
	new Unit(jsonUnitsBase[i]);
	console.log(i);
}

//#endregion

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

//#endregion



//# left sidebar (burger menu on vertical)
const sidebar = document.createElement('div');
sidebar.id = 'sidebar';
//add a button to the sidebar to toggle the sidebar
const toggleSidebarButton = document.createElement('button');
toggleSidebarButton.innerHTML = '🍔';
toggleSidebarButton.id = 'toggleSidebarButton';
sidebar.classList.add('sidebar_inactive');
sidebar.appendChild(toggleSidebarButton);
var sidebarActive = true;
const sidebar_title_div = document.createElement('div');
sidebar_title_div.id = 'sidebar_title_div';
sidebar_title_div.innerHTML = 'BAces_Tools';
const sidebar_footer_div = document.createElement('div');
sidebar_footer_div.classList.add('sidebar_footer_div')
const sidebar_footer_contents = document.createElement('div');
sidebar_footer_div.appendChild(sidebar_footer_contents);
sidebar_footer_contents.innerHTML = "<b>BAces_Tools has no affiliation with Uncapped Games";
const sidebar_footer_contents2 = document.createElement('div');
sidebar_footer_div.appendChild(sidebar_footer_contents2);
sidebar_footer_contents2.innerHTML = "All rights to any content displayed remain the property of Uncapped Games.";
const sidebar_footer_contents3 = document.createElement('div');
sidebar_footer_div.appendChild(sidebar_footer_contents3);
sidebar_footer_contents3.innerHTML = "No warranties or guarantees are provided regarding the accuracy or completeness of the game data displayed. This toolkit is provided ‘as is’ and is for informational purposes only. Use of this toolkit does not grant any rights to the underlying intellectual property or game content of Battle Aces, which remains with its respective owner.";
sidebar_footer_contents3.style.fontSize = '8px';
//sidebar_footer_div.innerHTML = '<b></b>.<br> <br>';
function sideBarRedraw() {
	//if the sidebar is inactive, reduce the width to 50px, otherwise restore it to 200px
	if (sidebarActive) {
		sidebar.style.width = '200px';
		wrapper.style.marginLeft = '200px';
		sidebar.appendChild(sidebar_title_div);
		sidebar.appendChild(sidebar_footer_div);
	} else {
		sidebar.style.width = '50px';
		wrapper.style.marginLeft = '50px';
		//if children exist
		if (sidebar.children.length > 0) {
			sidebar.removeChild(sidebar_title_div);
			sidebar.removeChild(sidebar_footer_div);
		}
	}
}
sideBarRedraw()
toggleSidebarButton.addEventListener('click', () => {
	//toggle the sidebarToggle variable
	sidebarActive = !sidebarActive;
	sideBarRedraw();
});

document.body.appendChild(sidebar);
document.body.appendChild(wrapper);


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

//#region deck-content section of the deck view, includes: addUnitToDeck

//create a text input box
var deck_stats_div = document.createElement('div');
deck_stats_div.classList.add('deck_stats_div');
//create a table with 2 columns and 4 rows
var deck_stats_table = document.createElement('table');
deck_stats_table.classList.add('deck_stats_table');
var deck_stats_table2 = document.createElement('table');
deck_stats_table2.classList.add('deck_stats_table');
var stat_categories = ['energy', 'matter', 'bandwidth', 'health', 'speed', 'range', 'damage', 'ability', 'traits', 'manufacturer']
var stat_category_cells = {} //stores the cells for each stat category to be updated

for (var i = 0; i < stat_categories.length; i++) {
	//only every second category create a new row
	var tr
	if (i < 7) {
		if (i % 2 == 0) tr = document.createElement('tr');
	}
	else {
		tr = document.createElement('tr');
	}
	for (var j = 0; j < 2; j++) {
		var td = document.createElement('td');
		td.classList.add('deck_stats_td');
		if (j == 1) {
			stat_category_cells[stat_categories[i]] = td
		}
		else {
			td.innerHTML = stat_categories[i];
		}
		tr.appendChild(td);
	}
	if (i < 7) {
		deck_stats_table.appendChild(tr);
	}
	else {
		deck_stats_table2.appendChild(tr);
	}
}
deck_stats_div.appendChild(deck_stats_table);
deck_stats_div.appendChild(deck_stats_table2);

stat_category_cells.range.innerHTML = 'test';


var deck_text_div = document.createElement('div');

//#tag deckSlots div for unit deck slots
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

	//when div is mouseover, make it turn black, then return after mouseover
	div.addEventListener('mouseover', function () {
		this.style.backgroundColor = 'black';
	});

	//if the mouse is clicked
	div.addEventListener('click', function () {
		var slotNumber = this.id.slice(-1);
		// remove the unit from the deck array
		console.log(slotNumber + ' clicked - removed ' + deck1Contents[slotNumber].name + ' from deck');
		var deck = decks[0];
		console.log(deck)
		delete deck[slotNumber];
		console.log(deck)
		redrawDeckContent(0);
	});

	div.addEventListener('mouseout', function () {
		this.style.backgroundColor = '';
	});

	unit_deck_slots_div.appendChild(div);
}

deck_stats_div.appendChild(deck_text_div);
deck_content.appendChild(deck_stats_div);

function calculateDeckStats() {
	var deck = decks[currentDeck];
	var stats = {
		energy: 0,
		matter: 0,
		bandwidth: 0,
		health: 0,
		speed: 0,
		range: 0,
		damage: 0,
		ability: [],
		type: [],
		traits: [],
		manufacturer: []
	};
	for (var i = 0; i < deck.length; i++) {
		if (deck[i] != undefined) {
			for (var key in stats) {
				if (deck[i][key] != undefined) {
					if (key == 'ability' || key == 'type' || key == 'traits' || key == 'manufacturer') {
						stats[key].push(deck[i][key]);
					}
					else stats[key] += deck[i][key];
				}
			}
		}
	}
	//stat_category_cells.range.innerHTML = 'test'
	//for each stat set stat_category_cells['statname'].innerHTML to the correct stat
	//console.log(stats);
	for (var key in stats) {
		if (stat_category_cells[key] != undefined) {
			stat_category_cells[key].innerHTML = '';
			if (key == 'ability') {
				for (var i = 0; i < stats[key].length; i++) {
					if (stats[key][i] != undefined && (stats[key][i] != '')) {
						var img = document.createElement('img');
						img.src = 'images/abilities/' + stats[key][i] + '.png';
						img.setAttribute('alt', stats[key][i]);
						img.setAttribute('title', stats[key][i]);
						img.classList.add('unit_table_image_small');
						stat_category_cells[key].appendChild(img);
					}
				}
			}
			else if (key == 'traits') {
				for (var i = 0; i < stats[key].length; i++) {
					if (stats[key][i] != undefined && (stats[key][i] != '')) {
						var img = document.createElement('img');

						//we need to seperate traits if there are multiple
						if (stats[key][i].length > 1) {
							console.log(stats[key][i]);
							for (var j = 0; j < stats[key][i].length; j++) {
								img = document.createElement('img');
								img.src = 'images/traits/' + stats[key][i][j] + '.png';
								img.setAttribute('alt', stats[key][i][j]);
								img.setAttribute('title', stats[key][i][j]);
								img.classList.add('unit_table_image_small');
								stat_category_cells[key].appendChild(img);
							}
						}
						else {
							if (stats[key][i] != 'none') {
								img.src = 'images/traits/' + stats[key][i] + '.png';
								img.setAttribute('alt', stats[key][i]);
								img.setAttribute('title', stats[key][i]);
								img.classList.add('unit_table_image_small');
								stat_category_cells[key].appendChild(img);
							}
						}

						/*
						stat_category_cells[key].sort(function (a, b) {
							return a.alt.localeCompare(b.alt);
						})
						
						*/
						//sort children of stat_category_cells[key]


						var sortedChildren = Array.from(stat_category_cells[key].children).sort(function (a, b) {
							return a.alt.localeCompare(b.alt);
						});
						stat_category_cells[key].innerHTML = '';
						sortedChildren.forEach(function (child) {
							stat_category_cells[key].appendChild(child);
						});

					}
				}
			}
			else if (key == 'manufacturer') {
				for (var i = 0; i < stats[key].length; i++) {
					if (stats[key][i] != undefined && stats[key][i] != '') {
						var img = document.createElement('img');
						img.src = 'images/manuf/' + stats[key][i] + '.png';
						img.setAttribute('alt', stats[key][i]);
						img.setAttribute('title', stats[key][i]);
						img.classList.add('unit_table_image_small');
						stat_category_cells[key].appendChild(img);
					}

					//sort children of stat_category_cells[key]


					var sortedChildren = Array.from(stat_category_cells[key].children).sort(function (a, b) {
						return a.alt.localeCompare(b.alt);
					});
					stat_category_cells[key].innerHTML = '';
					sortedChildren.forEach(function (child) {
						stat_category_cells[key].appendChild(child);
					});
				}
			}
			else if (key == 'type' || key == 'traits' || key == 'manufacturer') { }
			else stat_category_cells[key].innerHTML = stats[key];
		}
	}
	return stats;
}


function redrawDeckContent(deckID) {
	calculateDeckStats();
	//iterate through deckslots
	//deck_stats.innerHTML = 'deck stats:\nhello';
	var deck = decks[deckID];
	deck_text_div.innerHTML = ''
	//for each deck1slot
	deck1Slots.forEach((slot, i) => {
		slot.firstElementChild.src = 'images/techtiers/' + slotBuildings[i] + '.png';
	});
	deck.forEach((unit, i) => {
		deck_text_div.innerHTML += unit.emoji + ' ';
		//slot.innerHTML = deck[index].name;
		deck1Slots[i].firstElementChild.src = 'images/units/' + unit.name + '.png';
	});

}

//on unit_deck_input update
deck_text_div.onchange = function () {
	console.log('unit_deck_input');
	redrawDeckContent();
};



function addUnitToDeck(unit, deckID) {
	var deck = decks[deckID];
	console.log('Adding unit to deck ' + deckID + ': ' + unit.name);
	//console.log(unit);about:blank#blocked
	//add the unit name to the unit_deck_input text box
	//unit_deck_input.value += unit.name + '\n';
	//addToDeck(unitList[i]);
	var decklen = 0
	var exists = false
	//for each value in deck add +1 to decklen
	deck.forEach((u) => {
		console.log(u.name);
		if (u != undefined) {
			decklen++;
		}
		if (u.name == unit.name) {
			console.log('unit not added, already in deck');
			exists = true;
		}
	});
	if (!exists && decklen < 8) {

		//loop through deck and find if deck slotbuildings[i] matches the current units building
		for (var i = 0; i < 8; i++) {
			if (deck[i] == undefined) {
				if (slotBuildings[i] == unit.building) {
					deck[i] = unit;
					break;
				}
				else if (slotBuildings[i] == 'wildfoundry' && (unit.building == 'foundry' || unit.building == 'advancedfoundry')) {
					deck[i] = unit;
					break;
				}
				else if (slotBuildings[i] == 'wildstarforge' && (unit.building == 'starforge' || unit.building == 'advancedstarforge')) {
					deck[i] = unit;
					break;
				}
			}
		}

		//deck.push(unit);
	}
	else console.log('deck limit reached');
	console.log(decklen + '/8');
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

//#region unit-div-header
//label
const sort_label = document.createElement('p');
sort_label.innerHTML = 'sort: ';
unit_view_header.appendChild(sort_label);
//create a dropdown selector for sorting
const unit_header_sort = document.createElement('select');
//add an option called test
unit_header_sort.options.add(new Option('name', 'name'));
unit_header_sort.options.add(new Option('health', 'health'));
unit_header_sort.options.add(new Option('type', 'type'));
unit_header_sort.options.add(new Option('damage', 'damage'));
unit_header_sort.options.add(new Option('air damage', 'damagea'));
unit_header_sort.options.add(new Option('dps', 'dpsg'));
unit_header_sort.options.add(new Option('air dps', 'dpsa'));
unit_header_sort.options.add(new Option('speed', 'speed'));
unit_header_sort.options.add(new Option('range', 'range'));
unit_header_sort.options.add(new Option('matter', 'matter'));
unit_header_sort.options.add(new Option('energy', 'energy'));
unit_header_sort.options.add(new Option('bandwidth', 'bandwidth'));
unit_header_sort.options.add(new Option('skill', 'ability'));
unit_header_sort.options.add(new Option('tech', 'building'));
unit_header_sort.options.add(new Option('tier', 'tier'));
unit_header_sort.options.add(new Option('big', 'big'));
unit_header_sort.options.add(new Option('small', 'small'));
unit_header_sort.options.add(new Option('antibig', 'antibig'));
unit_header_sort.options.add(new Option('splash', 'splash'));
unit_header_sort.options.add(new Option('antiair', 'antiair'));
unit_header_sort.options.add(new Option('manufacturer', 'manufacturer'));
sortUnits(unit_header_sort.value, unitList);

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

//#region redrawUnitContent expensive function: draws unit content div, iterates unitList for display
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
			key == 'emoji' ||
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
		unit_table_row.id = unitList[i].name;
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
		unit_table_cell.id = unitList[i].name;
		//add the unit property to the table cell
		var div = document.createElement('div');
		//div.innerHTML = unitList[i].name;
		unit_table_cell.appendChild(div);
		unit_table_cell.classList.add('unit_table_cell');

		//#tag table_add_unit_button
		//add the button
		var table_add_unit_button = document.createElement('button');
		//add text to the button
		table_add_unit_button.innerHTML = '+';
		table_add_unit_button.classList.add('table_add_unit_button')
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
				key == 'emoji' ||
				key == 'website'
			) {
			} else {
				//console.log(`${key}: ${value}`);
				var div = document.createElement('div');
				//div.innerHTML = key + ': ' + value;
				//unit_table_cell.appendChild(div)
				var unit_table_cell = document.createElement('td');
				unit_table_cell.id = unitList[i].name;
				div.id = unitList[i].name;
				unit_table_cell.appendChild(div);
				div.addEventListener('mouseover', unitMouseOver);
				unit_table_cell.addEventListener('mouseover', unitMouseOver);


				unit_table_cell.classList.add('unit_table_cell');
				//if i is an alternate number
				if (i % 2 == 0) {
					unit_table_cell.classList.add('unit_table_cell_alt');
				}

				unit_table_row.appendChild(unit_table_cell);

				if (key == 'image') {
					var img = document.createElement('img');
					img.src = 'images/units/' + value + '.png';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unit_table_image');
					div.appendChild(img);
				} else if (key == 'building') {
					var img = document.createElement('img');
					img.src = 'images/techtiers/' + value + '.svg';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unit_table_image_small');
					div.appendChild(img);
				} else if (key == 'ability') {
					if (value != '') {
						var img = document.createElement('img');
						img.src = 'images/abilities/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unit_table_image_small');
						div.appendChild(img);
					}
				} else if (key == 'manufacturer') {
					if (value != '') {
						var img = document.createElement('img');
						img.src = 'images/manuf/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unit_table_image_small');
						div.appendChild(img);
					}
				} else if (key == 'traits') {
					value.forEach(trait => {
						if (trait != 'none') {
							var img = document.createElement('img');
							img.src = 'images/traits/' + trait + '.png';
							img.classList.add('unit_table_image_small');
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
					if (key == 'name') {
						//div.classList.add('unit_table_name_cell');

					}
					if (value != 0) div.innerHTML = value;
				}

				if (key == 'health' || key == 'damage' || key == 'speed' || key == 'range') {
					unit_table_cell.classList.add('unit_table_cell_stats');
				}
				//if div has a child add mousover to child
				else if (div.children.length > 0) {
					//for each child
					for (let j = 0; j < div.children.length; j++) {
						//div.children[j].addEventListener('mouseover', statRedrawMouseOver); --per cell mouseover
						div.children[j].id = unitList[i].name;
					}
				};
			}
		}
		//div.innerHTML = unitList[i].name;
		//unit_table_cell.add(div);

		//create a table body element
		unit_table_body.appendChild(unit_table_row);
	}

	//attach the unit_table to the unit_content div
	unit_content.appendChild(unit_table);

}

redrawUnitContent(); //upon loading the page we redraw the UnitContentDiv once to initialise it

//#endregion

//#region change-sort

//sort units
function sortUnits(value, unitlist) {
	// Sort users (array of objects) by firstName in descending order
	var sorted = undefined;
	if (value == 'name' || value == 'manufacturer') {
		sorted = sort(unitlist).asc((u) => u[value]);
	}
	else {
		sorted = sort(unitlist).desc((u) => u[value]);
	}
	unitList = sorted;

	//sort the units by the new option
	//new function for sorting units
	unitList = sorted;
	lastSortValue = value;
}


unit_header_sort.onchange = function () {
	//update the unit_content.innerHTML to the new sort by option
	//unit_content.innerHTML = unit_header_sort.value;
	//sort the units by the new option
	//new function for sorting units
	console.log(unit_header_sort.value);
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


//console.log(wrapper);





//const ctx = document.getElementById('myChart');

//find the min and max value of each stat for all units in the unit list
var minValues = [];
var maxValues = [];
for (var i = 0; i < unitList.length; i++) {
	for (var [key, value] of Object.entries(unitList[i])) {
		if (key == 'health' || key == 'damage' || key == 'damagea' || key == 'speed' || key == 'range' || key == 'dpsg' || key == 'dpsa') {
			if (minValues[key] == undefined || value <= minValues[key]) {
				minValues[key] = value;
				if (key == 'speed') console.log(key, minValues[key]);
			}
			if (maxValues[key] == undefined || value > maxValues[key]) {
				maxValues[key] = value;
			}
		}
	}
}

var unitNames = [];
var unitHealth = []
//for each unit in unitList add its name to unitNames


function simpleSort(list, key, sortedArray) {

	var sortedList = []

	sort(list).asc((u) => u[key]).forEach(function (unit) {
		var sortObject = {};
		sortObject.label = unit['name']
		sortObject.data = unit[key];
		sortedArray.push(unit[key])
		sortedList.push(unit.name);
	});
	return sortedList;
}


//#region stats-content



//#endregion



var sortedUnitData = {
	health: [],
	damage: [],
	damagea: [],
	speed: [],
	range: [],
	dpsg: [],
	dpsa: [],
}
var unitStatColors = {
	health: '#48F07D',
	damage: '#EF4C48',
	damagea: '#EF4C48',
	speed: '#F0CA2E',
	range: '#E68B40',
	dpsg: '#484CEF',
	dpsa: '#484CEF',
}
var sortData = {
	health: simpleSort(unitList, 'health', sortedUnitData.health),
	damage: simpleSort(unitList, 'damage', sortedUnitData.damage),
	damagea: simpleSort(unitList, 'damagea', sortedUnitData.damagea),
	speed: simpleSort(unitList, 'speed', sortedUnitData.speed),
	range: simpleSort(unitList, 'range', sortedUnitData.range),
	dpsg: simpleSort(unitList, 'dpsg', sortedUnitData.dpsg),
	dpsa: simpleSort(unitList, 'dpsa', sortedUnitData.dpsa),
}

function sortColors(unitName, data, label) {
	var sortedColors = []
	//for each unit in sortedunitHealth, add a color based on whether it is before or after the unit with the unit name
	//if it is before, add the color 'red', otherwise add the color 'black'
	//add the color to the sortedColors array
	var color;
	color = unitStatColors[label];
	data.forEach(function (unit) {
		sortedColors.push(color)
		if (unit == unitName) { //once we reaach the name of the unit we set color to black which pushes the rest of the units as black bars
			color = 'black'
		}
	});
	return sortedColors
}

var currentUnit = 'crusader';




var statsChartContainer = document.createElement('div');
statsChartContainer.id = 'statsChartContainer';
stats_content.appendChild(statsChartContainer);
var statsUnitName = document.createElement('div');
statsUnitName.id = 'statsUnitName';
statsUnitName.innerHTML = 'Unit Name';
stats_content.appendChild(statsUnitName);

var chartDivs = []
var barCharts = []

//video element
var video = document.createElement('video');
//video source is the units videoTurnaround key
video.src = unitList[1].videoturnaround;
//set video to repeat
video.loop = true;
//crop the right 30% of the video


video.id = 'unitVideo';
stats_content.appendChild(video);

//#tag barChart definition
function drawBarChart(label) {

	var chartDiv = document.createElement('div');
	chartDivs.push(chartDiv);
	chartDiv.classList.add('chartDiv');
	statsChartContainer.appendChild(chartDiv);
	var barChart = document.createElement('canvas');
	//set barchart width to 100px
	//barChart.width = 100;
	barChart.classList.add('barchart');
	chartDiv.appendChild(barChart);

	//create an img element of the relevant label icon
	var img = document.createElement('img');
	img.src = 'images/stats/' + label + '.png';
	img.id = 'unitStatsImg';
	chartDiv.appendChild(img);


	var chart = new Chart(barChart, {
		type: 'bar',
		data: {
			//labels: [unitList[1].name],
			//make a label for each unit in the unit lists name
			labels: sortData[label],
			datasets: [{
				label: label,
				//data: [12, 19, 3, 5, 2, 3],
				data: sortedUnitData[label],
				backgroundColor: sortColors(currentUnit, sortData[label], label),
				borderWidth: 0
			}]
		},
		options: {
			plugins: {
				tooltip: {
					enabled: false
				},
				legend: {
					display: false
				},
			},
			animation: false,
			scales: {
				//use the max value as the scale for each label from the minValues using the same keys as the data
				//use chartjs knowledge to accomplish this
				y: {
					grid: {
						display: false,
					},
					ticks: {
						display: false,
						suggestedMin: function () {
							return minValues[label];
						},
					},
					max: function () {
						if (label == 'health') return 13000;
						else if (label == 'dpsg') return 1800;
						else if (label == 'dpsa') return 800;
						else return maxValues[label];
					},
					min: function () {
						if (label == 'speed') return 3;
						else return minValues[label];
					},
				},
				x: {
					grid: {
						display: false,
					},
					ticks: {
						display: false,
					},
					display: false,
				}
			}
		}
	});

	barCharts[label] = chart;

}


function drawAllBarCharts() {
	//instead of having each in strings, do it for each key in sorted unit data
	for (var [key, value] of Object.entries(sortedUnitData)) {
		//console.log(key);
		drawBarChart(key);
	}
}
drawAllBarCharts();

var oldE = null
function unitMouseOver(e) {
	//if we are
	if (e.target.id == oldE) return;
	oldE = e.target.id;
	//console.log(e.target.id);
	//get the unit name from the cells parent (which is the row), using the name table header
	currentUnit = e.target.id;
	statsUnitName.innerHTML = e.target.id;

	//get the unit from unit list by its name
	var unit = unitList.find(unit => unit.name === e.target.id);
	//update the video source
	video.src = unit.videoturnaround;
	console.log(unit.videoturnaround);
	video.play();

	//update the data in the bar charts based on the unit id
	//update the chart
	//update the colors in the bar charts based on the unit id
	function updateChart(chart, label) {
		chart.data.datasets[0].data = sortedUnitData[label];
		chart.data.datasets[0].backgroundColor = sortColors(e.target.id, sortData[label], label);
		chart.update();
	}
	//update the charts
	for (var [key, value] of Object.entries(sortedUnitData)) {
		//console.log(key);
		//video.src = unitList.find(unit => unit.name === e.target.id).videoturnaround;
		//video.play();
		updateChart(barCharts[key], key);
	}
	/**
	updateChart(barCharts['health'], 'health');
	updateChart(barCharts['damage'], 'damage');
	updateChart(barCharts['speed'], 'speed');
	updateChart(barCharts['range'], 'range');
	*/



}

/*
deprecated, we now add the listener to the cell when its created
//when a cell in the unit table is mouseover get the unit name from the cell and print to console
var unit_table = document.getElementsByClassName('unit_table_name_cell');
for (var i = 0; i < unit_table.length; i++) {
	unit_table[i].addEventListener('mouseover', statRedrawMouseOver);
}
	*/

