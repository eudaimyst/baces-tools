/* eslint-disable no-redeclare */
//create 3 divs called unit_view, deck_view and stats_view, and a wrapper to contain them
import { sort } from 'fast-sort';
import Chart from 'chart.js/auto';
import jsonUnitsBase from './units.json';
import { sidebar } from './menu';



//#region unit-definition creates units from json entry
//create an empty object to use as a base of the units, that has a new constructor to create a object
class Unit {
	constructor(jsonEntry) {
		Object.keys(jsonEntry).forEach((key) => {
			var cleanNameKey = key;
			cleanNameKey = removeSpacesCapitalsSpecialCharacters(key);
			var value = jsonEntry[key];
			var cleanValue = removeSpacesCapitalsSpecialCharacters(value)
			if (value.constructor == String) {
				if (cleanNameKey != 'emoji' && cleanNameKey != 'name' && cleanNameKey != 'videoturnaround' && cleanNameKey != 'type') {
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
	}
}

var unitList = [];
for (let i = 0; i < jsonUnitsBase.length; i++) {
	unitList.push(new Unit(jsonUnitsBase[i]));;
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
//decks contain the unit objects
var decks = []
var deck1Contents = [];
var deck2Contents = [];
decks.push(deck1Contents, deck2Contents);
//decks slots contain the elements (divs) that are used to display the units in the deck
var deckSlots = [];
var deck1Slots = [];
var deck2Slots = [];
deckSlots.push(deck1Slots, deck2Slots);

var slotBuildings = ['core', 'foundry', 'advancedfoundry', 'wildfoundry', 'core', 'starforge', 'advancedstarforge', 'wildstarforge'];
var slotBuildingFilters = ['core', 'foundry', 'advancedfoundry', 'foundry', 'core', 'starforge', 'advancedstarforge', 'starforge'];

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
const app = document.createElement('div');
app.id = 'app';
wrapper.appendChild(sidebar);
wrapper.appendChild(app);
app.appendChild(unit_view);
app.appendChild(deck_view);
app.appendChild(stats_view);

//#endregion



document.body.appendChild(wrapper);


//#region deck-header section of the deck view

const deck1_button = document.createElement('button');
deck1_button.innerHTML = 'Deck 1';
deck1_button.id = 'deck1_button';
deck1_button.classList.add('header_element');
deck_view_header.appendChild(deck1_button);
//when deck 1 is pressed it should set current deck to 0
deck1_button.addEventListener('click', function () {
	currentDeck = 0;
	deck1_button.classList.add('selected');
	deck2_button.classList.remove('selected');
});
const deck2_button = document.createElement('button');
deck2_button.innerHTML = 'Deck 2';
deck2_button.id = 'deck2_button';
deck2_button.classList.add('header_element');
deck_view_header.appendChild(deck2_button);
//when deck 2 is pressed it should set current deck to 1
deck2_button.addEventListener('click', function () {
	currentDeck = 1;
	deck2_button.classList.add('selected');
	deck1_button.classList.remove('selected');
});
deck1_button.classList.add('selected');

//#endregion

//#region deck-content section of the deck view, includes: addUnitToDeck

//#tag deck-container 
//create a function that uses the code below to allow for calling a function to create new deck containers
function createNewDeckContainer() {
	var deckContainer = document.createElement('div');
	deckContainer.classList.add('deckContainer');
	deck_content.appendChild(deckContainer);
	return deckContainer;
}
var deckContainer = createNewDeckContainer();

var deck2Container = createNewDeckContainer();
deck2Container.classList.add('deck2Container');
//#tag slot-container 


//#tag deckSlots divs for units
function createDeckSlots(container, deckID) {

	var deckSlotContainer = document.createElement('div');
	deckSlotContainer.classList.add('deckSlotContainer');
	container.appendChild(deckSlotContainer);
	//create 8 square divs
	for (var i = 0; i < 8; i++) {
		var div = document.createElement('div');
		deckSlots[deckID][i] = div
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
			var slotNumber = this.id.slice(-1);
			var deck = decks[0];
			if (deck[slotNumber]) {
				console.log(slotNumber + ' mouseOver - ' + deck[slotNumber].name);
				//trigger the mouseover event
				//get the unit from the unitlist by the unit name
				var unit = unitList.find(unit => unit.name === deck[slotNumber].name);
				unitMouseOverAndTapped(unit);
			}
		});

		//if the mouse is clicked
		div.addEventListener('click', function () {
			var slotNumber = this.id.slice(-1);
			var deck = decks[deckID];
			// remove the unit from the deck array
			if (deck[slotNumber]) {
				console.log(slotNumber + ' clicked - removed ' + deck[slotNumber].name + ' from deck # ' + deckID);
				delete deck[slotNumber];
				deckSlots[deckID][slotNumber].classList.remove('unit_deck1_slot_div_filled');
				deckSlots[deckID][slotNumber].classList.remove('unit_deck2_slot_div_filled');
				updateChartData();
			}
			else {
				console.log(slotBuildings[slotNumber] + ' clicked, setting filter');
				//setFilter(slotBuildings[i]);
				//set the filter input box to the name of the building
				unit_filter_input.value = slotBuildingFilters[slotNumber];
				//run the unit_filter input changed event
				unit_filter_input.dispatchEvent(new Event('input'));
			}
			redrawDeckContent(0);
			redrawDeckContent(1);
		});

		div.addEventListener('mouseout', function () {
			this.style.backgroundColor = '';
		});

		deckSlotContainer.appendChild(div);
	}

}
createDeckSlots(deckContainer, 0);
createDeckSlots(deck2Container, 1);

//#tag stats-container 

function createDeckStats(container) {

	//create a text input box
	var deck_stats_div = document.createElement('div');
	deck_stats_div.classList.add('deck_stats_div');
	//create a table with 2 columns and 4 rows
	var deck_stats_table = document.createElement('table');
	deck_stats_table.classList.add('deck_stats_table');
	var deck_stats_table2 = document.createElement('table');
	deck_stats_table2.classList.add('deck_stats_table');
	var stat_categories = ['matter', 'energy', 'bandwidth', 'health', 'speed', 'range', 'damage', 'ability', 'traits', 'manufacturer']
	var stat_category_cells = {} //stores the cells for each stat category to be updated

	for (var i = 0; i < stat_categories.length; i++) {
		//only every third category create a new row
		var tr
		if (i % 3 == 0) tr = document.createElement('tr');



		for (var j = 0; j < 2; j++) {
			var td = document.createElement('td');
			td.classList.add('deck_stats_td');
			if (j == 1) {
				stat_category_cells[stat_categories[i]] = td
				td.id = 'stat_category_cell_' + stat_categories[i];
				td.classList.add('deck_stats_td_right');
				td.innerHTML = '';
			}
			else {
				//td.innerHTML = stat_categories[i];
				//instead of just setting the text, draw the stat image
				if (i < 7) {
					var img = document.createElement('img');
					if (stat_categories[i] == 'energy' || stat_categories[i] == 'matter' || stat_categories[i] == 'bandwidth') img.src = 'images/resources/' + stat_categories[i] + '.svg';
					else img.src = 'images/stats/' + stat_categories[i] + '.png';
					img.classList.add('deck_stats_img');
					td.appendChild(img);
				}
				else {
					tr = document.createElement('tr');
					if (i % 2 == 0) tr = document.createElement('tr');
					if (stat_categories[i] == 'manufacturer') td.innerHTML = 'manf.'
					else td.innerHTML = stat_categories[i];
				}
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

	//stat_category_cells.range.innerHTML = 'test';

	var deckEmojiText = document.createElement('div');

	//on unit_deck_input update
	deckEmojiText.onchange = function () {
		console.log('unit_deck_input');
		redrawDeckContent();
	};

	deck_stats_div.appendChild(deckEmojiText);
	container.appendChild(deck_stats_div);

	return stat_category_cells;
}

var stat_category_cells = []
var stat_category_cells1 = createDeckStats(deckContainer);
var stat_category_cells2 = createDeckStats(deck2Container);
stat_category_cells.push(stat_category_cells1)
stat_category_cells.push(stat_category_cells2)

console.log("STAT CATEGORY CELLS");
console.log(stat_category_cells);

//create 1 div to hold all the unit deck slots



function calculateDeckStats(deckID) {
	var deck = decks[deckID];
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
			console.log(deck[i]);
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
		if (stat_category_cells[deckID][key] != undefined) {
			stat_category_cells[deckID][key].innerHTML = '';
			if (key == 'ability') {
				for (var i = 0; i < stats[key].length; i++) {
					if (stats[key][i] != undefined && (stats[key][i] != '')) {
						var img = document.createElement('img');
						img.src = 'images/abilities/' + stats[key][i] + '.png';
						img.setAttribute('alt', stats[key][i]);
						img.setAttribute('title', stats[key][i]);
						img.classList.add('unit_table_image_small');
						stat_category_cells[deckID][key].appendChild(img);
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
								stat_category_cells[deckID][key].appendChild(img);
							}
						}
						else {
							if (stats[key][i] != 'none') {
								img.src = 'images/traits/' + stats[key][i] + '.png';
								img.setAttribute('alt', stats[key][i]);
								img.setAttribute('title', stats[key][i]);
								img.classList.add('unit_table_image_small');
								stat_category_cells[deckID][key].appendChild(img);
							}
						}

						/*
						stat_category_cells[key].sort(function (a, b) {
							return a.alt.localeCompare(b.alt);
						})
						
						*/
						//sort children of stat_category_cells[key]


						var sortedChildren = Array.from(stat_category_cells[deckID][key].children).sort(function (a, b) {
							return a.alt.localeCompare(b.alt);
						});
						stat_category_cells[deckID][key].innerHTML = '';
						sortedChildren.forEach(function (child) {
							stat_category_cells[deckID][key].appendChild(child);
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
						stat_category_cells[deckID][key].appendChild(img);
					}

					//sort children of stat_category_cells[key]


					var sortedChildren = Array.from(stat_category_cells[deckID][key].children).sort(function (a, b) {
						return a.alt.localeCompare(b.alt);
					});
					stat_category_cells[deckID][key].innerHTML = '';
					sortedChildren.forEach(function (child) {
						stat_category_cells[deckID][key].appendChild(child);
					});
				}
			}
			else stat_category_cells[deckID][key].innerHTML = stats[key];
		}
	}
	return stats;
}


function redrawDeckContent(deckID) {
	calculateDeckStats(deckID);
	//iterate through deckslots
	//deck_stats.innerHTML = 'deck stats:\nhello';
	var deck = decks[deckID];
	//deckEmojiText.innerHTML = ''
	//for each deck1slot
	deckSlots[deckID].forEach((slot, i) => {
		slot.firstElementChild.src = 'images/techtiers/' + slotBuildings[i] + '.png';
	});
	deck.forEach((unit, i) => {
		//deckEmojiText.innerHTML += unit.emoji + ' ';
		//slot.innerHTML = deck[index].name;
		deckSlots[deckID][i].firstElementChild.src = 'images/units/' + unit.image + '.png';
	});

}




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
		var deckClass = 'unit_deck1_slot_div_filled';
		if (deckID == 1) deckClass = 'unit_deck2_slot_div_filled';
		//loop through deck and find if deck slotbuildings[i] matches the current units building
		for (var i = 0; i < 8; i++) {
			if (deck[i] == undefined) {
				if (slotBuildings[i] == unit.building) {
					deck[i] = unit;

					deckSlots[deckID][i].classList.add(deckClass);
					break;
				}
				else if (slotBuildings[i] == 'wildfoundry' && (unit.building == 'foundry' || unit.building == 'advancedfoundry')) {
					deck[i] = unit;
					deckSlots[deckID][i].classList.add(deckClass);
					break;
				}
				else if (slotBuildings[i] == 'wildstarforge' && (unit.building == 'starforge' || unit.building == 'advancedstarforge')) {
					deck[i] = unit;
					deckSlots[deckID][i].classList.add(deckClass);
					break;
				}
			}
		}

		//deck.push(unit);
	}
	else console.log('deck limit reached');
	console.log(decklen + '/8');
	redrawDeckContent(deckID);
	updateChartData();
}

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

//filter input box
const unit_filter_input = document.createElement('input');
unit_filter_input.type = 'text';
unit_filter_input.id = 'unit_filter_input';
unit_filter_input.placeholder = 'filter';
unit_filter_input.classList.add('header_element');
unit_view_header.appendChild(unit_filter_input);

//filter clear button that clears the filter
const unit_filter_clear_btn = document.createElement('button');
unit_filter_clear_btn.innerHTML = 'clear';
unit_filter_clear_btn.id = 'unit_filter_clear_btn';
unit_filter_clear_btn.classList.add('header_element');
unit_view_header.appendChild(unit_filter_clear_btn);
unit_filter_clear_btn.onclick = function () {
	//clear the filter
	unit_filter_input.value = '';
	//run the unit_filter input changed event
	unit_filter_input.dispatchEvent(new Event('input'));
}

/**
 *
itbuttonbutton
main.js:734 boo!
main.js:732 COMPARING column 0 of row 2 to 
main.js:733 divdivbuttonclasstableaddunitbuttonbutton
main.js:734 boo!
main.js:732 COMPARING column 0 of row 3 to 
main.js:733 divdivbuttonclasstableaddunitbuttonbutton
main.js:734 boo!
main.js:732 COMPARING column 0 of row 4 to 
main.js:733 divdivbuttonclasstableaddunitbuttonbutton
main.js:734 boo!
main.js:732 COMPARING column 0 of row 5 to 
main.js:733 divdivbuttonclasstableaddunitbuttonbutton
main.js:734 boo!
main.js:732 COMPARING column 0 of row 6 to 
main.js:733 divdivbuttonclasstableaddunitbuttonbutton
main.js:734 boo!

Amazon Q use this
above is the console output, of the below code, instead of searching the text fo the innerHTML. I want to compare with the unit from the unitList to see if the filter text matches any of the unit data
 *
 * @param {*} filter
 */
function setFilter(filter) {
	filter = removeSpacesCapitalsSpecialCharacters(filter);
	console.log('Filter set to ' + filter);
	for (var i = 0; i < unitList.length; i++) {
		if (removeSpacesCapitalsSpecialCharacters(unitList[i].name).includes(filter) ||
			removeSpacesCapitalsSpecialCharacters(unitList[i].building).includes(filter) ||
			removeSpacesCapitalsSpecialCharacters(unitList[i].type).includes(filter) ||
			removeSpacesCapitalsSpecialCharacters(unitList[i].traits).includes(filter) ||
			removeSpacesCapitalsSpecialCharacters(unitList[i].manufacturer).includes(filter) ||
			unitList[i].ability.toLowerCase().includes(filter)
		) {
			//unit_content_div.children[i].style.display = 'block';
			//search the unit unit_table and hide the units which do not have values of strings which match the filter
			var table = document.getElementById('unit_table');
			var rows = table.getElementsByTagName('tr');
			for (var j = 0; j < rows.length; j++) {
				var found = false;

				found = removeSpacesCapitalsSpecialCharacters(rows[j].innerHTML).includes(removeSpacesCapitalsSpecialCharacters(filter));
				if (found) {
					rows[j].style.display = '';
				} else {
					rows[j].style.display = 'none';
				}
			}

		}
		else {
			//document.getElementById('unit_table').getElementsByTagName('tr')[i].getElementsByTagName('td').classList.Add('filterHidden');
			document.getElementById('unit_table').getElementsByTagName('tr')[i].style.display = 'none';
		}
	}
}

unit_filter_input.oninput = function () {
	setFilter(unit_filter_input.value);
};


//#endregion

//#region redrawUnitContent expensive function: draws unit content div, iterates unitList for display
function redrawUnitContent() {

	const excludeKeys = ['attackrate', 'tier', 'splash', 'small', 'big', 'antiair', 'antibig', 'slug', 'videoturnaround', 'videogameplay', 'emoji', 'website'];

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
	for (const [key] of Object.entries(unitList[1])) {
		if (!excludeKeys.includes(key)) {
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
			if (!excludeKeys.includes(key)) {
				var div = document.createElement('div');
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

				var img = document.createElement('img');
				if (key == 'image') {
					img.src = 'images/units/' + value + '.png';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unit_table_image');
					div.appendChild(img);
				} else if (key == 'building') {
					img.src = 'images/techtiers/' + value + '.svg';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unit_table_image_small');
					div.appendChild(img);
				} else if (key == 'ability') {
					if (value != '') {
						img.src = 'images/abilities/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unit_table_image_small');
						div.appendChild(img);
					}
				} else if (key == 'manufacturer') {
					if (value != '') {
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

for (const unit in unitList) {
	for (var [key, value] of Object.entries(unit)) {
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



//#region stats-header
var statsMode = 0 //0 = unit, 1 = compare
const stats_button = document.createElement('button');
stats_button.innerHTML = 'unit';
stats_button.id = 'stats_button';
stats_button.classList.add('header_element');
stats_view_header.appendChild(stats_button);
//when button is pressed set current mode to unit
stats_button.addEventListener('click', function () {
	statsMode = 0
	stats_button.classList.add('selected');
	compare_button.classList.remove('selected');
	refreshStatsContent()
});
const compare_button = document.createElement('button');
compare_button.innerHTML = 'compare';
compare_button.id = 'compare_button';
compare_button.classList.add('header_element');
stats_view_header.appendChild(compare_button);
//when deck 2 is pressed it should set current deck to 1
compare_button.addEventListener('click', function () {
	statsMode = 1;
	stats_button.classList.remove('selected');
	compare_button.classList.add('selected');
	refreshStatsContent()
});
stats_button.classList.add('selected');

//#endregion
//#region stats-content


var sortedUnitData = {
	health: [],
	damage: [],
	damagea: [],
	speed: [],
	range: [],
	dpsg: [],
	dpsa: [],
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

function sortColors(unitName, data) {
	var sortedColors = []
	var color = 'white';
	//color = unitStatColors[label];
	data.forEach(function (unit) {
		sortedColors.push(color)
		if (unit == unitName) { //once we reaach the name of the unit we set color to black which pushes the rest of the units as black bars
			color = 'black'
		}
	});
	return sortedColors
}

var currentUnit = 'crusader';

console.log('sorterd unit data')
console.log('------------------------------')
console.log(sortedUnitData)


var statsChartContainer = document.createElement('div');
statsChartContainer.id = 'statsChartContainer';
stats_content.appendChild(statsChartContainer);

var statsUnitRankDiv = document.createElement('div');
statsUnitRankDiv.id = 'statsUnitRankDiv';
statsChartContainer.appendChild(statsUnitRankDiv);
statsUnitRankDiv.innerHTML = 'Rank';

var statsUnitBottomContainer = document.createElement('div');
statsUnitBottomContainer.id = 'statsUnitBottomContainer';
statsUnitBottomContainer.innerHTML = '';
stats_content.appendChild(statsUnitBottomContainer);

var statsUnitName = document.createElement('div');
statsUnitName.id = 'statsUnitName';
statsUnitName.innerHTML = currentUnit.name;
statsUnitBottomContainer.appendChild(statsUnitName);

//using stats and matter div below as a template, make a function that creates such divs for other unit stats

function createStatsUnitDiv(label) {
	var statsUnitDiv = document.createElement('div');
	statsUnitDiv.classList.add('statsUnitResourceContainer');
	var statsUnitImg = document.createElement('img');
	statsUnitImg.classList.add('unitStatsResourceImg');
	//set the src of the img to the relevant label icon
	statsUnitImg.src = 'images/resources/' + removeSpacesCapitalsSpecialCharacters(label) + '.svg';
	//add the img to the matterDiv
	statsUnitDiv.appendChild(statsUnitImg);
	//add a text value to energy div for the units energy value
	var statsUnitValue = document.createElement('div');
	statsUnitValue.id = 'statsUnit' + label + 'Value';
	statsUnitValue.classList.add('unitStatsResourceValue');
	statsUnitDiv.appendChild(statsUnitValue);
	return statsUnitDiv;
}

var statsUnitMatterDiv = createStatsUnitDiv('Matter');
var statsUnitEnergyDiv = createStatsUnitDiv('Energy');
var statsUnitBandwidthDiv = createStatsUnitDiv('Bandwidth');



statsUnitBottomContainer.appendChild(statsUnitMatterDiv);
statsUnitBottomContainer.appendChild(statsUnitEnergyDiv);
statsUnitBottomContainer.appendChild(statsUnitBandwidthDiv);

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
	for (var [key] of Object.entries(sortedUnitData)) {
		//console.log(key);
		drawBarChart(key);
	}
}
drawAllBarCharts();

function updateRank(label, unit) {
	var rank = sortedUnitData[label].length - sortedUnitData[label].lastIndexOf(unit[label]);
	//if unit has no airdps ignore it its rank
	//console.log(unit);
	if ((label == 'dpsa' && unit['dpsa'] == '0') || (label == 'damagea' && unit['damagea'] == '0')) {
		statsUnitRankDiv.innerHTML += '<br><br>';
	}
	else {
		statsUnitRankDiv.innerHTML += '<span style="color:' + 'white' + '">' + unit[label] + '<br>' + rank + '<sup>' + getRankSuffix(rank) + '</sup></span><BR>';
	}

}
//write a function to add 'st', 'nd', 'rd', 'th' to the rank based on the rank number
function getRankSuffix(rank) {
	//if rank ends in 1
	if (rank == 11 || rank == 12 || rank == 13) return 'th';
	else if (rank % 10 == 1) return 'st';
	//if rank ends in 2
	else if (rank % 10 == 2) return 'nd';
	//if rank ends in 3
	else if (rank % 10 == 3) return 'rd';
	else return 'th';
}

//create a function which returns a colour on a gradient scale from red to green based on the value
function getColour(value, min, max) {
	//set defaults for min and max to 0 and 50
	//if min and max are not provided, use the min and max values of the data
	if (min == undefined) min = Math.min(...sortedUnitData);
	var red = Math.round((value - min) * 255 / (max - min));
	var green = 255 - red;
	var color = 'rgb(' + red + ', ' + green + ', 0)';
	return color;
}

console.log(getColour(.5, 0, 1));

var unitStats = ['health', 'damage', 'damagea', 'speed', 'range', 'dpsg', 'dpsa'];
var unitMouseOverAndTappedPrev = null;
function unitMouseOverAndTapped(unit) {
	if (statsMode != 0) return;
	if (unitMouseOverAndTappedPrev == unit) {
		//skip this if it's the same unit, to prevent duplicate loadings of the video for same unit
		return;
	}
	unitMouseOverAndTappedPrev = unit;
	//console.log(e.target.id);
	//get the unit name from the cells parent (which is the row), using the name table header


	//statsUnitName.innerHTML = e.target.id + '   ' + unit.matter + ' ' + unit.energy;
	//do the same as above, but add the matter and energy images before the values
	statsUnitName.innerHTML = unit.name;
	//get the div by its id
	statsUnitMatterDiv.children[1].innerHTML = unit.matter;
	statsUnitEnergyDiv.children[1].innerHTML = unit.energy;
	statsUnitBandwidthDiv.children[1].innerHTML = unit.bandwidth;
	//statsUnitEnergyValue.innerHTML = unit.energy;
	//statsUnitMatterValue.innerHTML = unit.matter;
	//create an img element of the relevant label icon
	//add the img to the statsUnitName

	//get the unit from unit list by its name
	//update the video source
	video.src = unit.videoturnaround;
	console.log(unit.videoturnaround);
	video.play();

	//update the data in the bar charts based on the unit id
	//update the chart
	//update the colors in the bar charts based on the unit id
	function updateChart(chart, label) {
		chart.data.datasets[0].data = sortedUnitData[label];
		chart.data.datasets[0].backgroundColor = sortColors(unit.name, sortData[label], label);
		chart.update();
	}
	//update the charts
	for (var [key] of Object.entries(sortedUnitData)) {
		updateChart(barCharts[key], key);
	}

	//update the rank for each stat
	//update the ranks for each label for each unit stat
	//update the ranks for each label for each unit stat
	statsUnitRankDiv.innerHTML = '';
	unitStats.forEach(function (label) {
		updateRank(label, unit);
	});

	/**
	updateChart(barCharts['health'], 'health');
	updateChart(barCharts['damage'], 'damage');
	updateChart(barCharts['speed'], 'speed');
	updateChart(barCharts['range'], 'range');
	*/

}

var comparisonChartContainer = document.createElement('div');
comparisonChartContainer.id = 'comparisonChartContainer';
comparisonChartContainer.innerHTML = '';






var unitDeckStats = [];
//get the unit deck stats from the deck div

//add the correct format for unitDeckStats to be chartJS data
console.log(unitDeckStats);

//create an example star chart in chartjs
//const DATA_COUNT = 7;
//const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };
var starchartUnitStats = ['health', 'damage', 'damagea', 'speed', 'range'];
var starchartMinMax = {
	health: [5350, 48000],
	damage: [520, 3800],
	damagea: [0, 2000],
	speed: [30, 93],
	range: [13, 134]
}
var starchartUnitData = [];
const data = {
	labels: starchartUnitStats,
	datasets: [
		{
			data: [0, 0, 0, 0, 0],
			borderColor: 'green',
			backgroundColor: 'darkgreen',
		},
	]
};
const data2 = {
	labels: starchartUnitStats,
	datasets: [
		{
			data: [0, 0, 0, 0, 0],
			borderColor: 'red',
			backgroundColor: 'darkred',
		},
	]
};
starchartUnitData.push(data);
starchartUnitData.push(data2);
var canvases = []
var starcharts = []
function createStarchart(id) {
	canvases[id] = document.createElement('canvas');
	canvases[id].id = 'starchart' + id;
	comparisonChartContainer.appendChild(canvases[id]);

	starcharts.push(new Chart(canvases[id], {
		type: 'radar',
		labels: 'test',
		data: starchartUnitData[id],
		options: {
			elements: {
				line: {
					borderWidth: 3

				},
			},
			plugins: {
				// Accessing labels and making them images
				tooltip: {
					enabled: false
				},
				legend: {
					display: false
				},
			},
			scales: {
				r: {
					min: 0,
					max: 1,
					ticks: {
						display: false,
					},
				},
			}
		}
	}));
}
createStarchart(0);
createStarchart(1);

function doScaling(deckID, input, min, max) { //given an input value, and a minimum and maximum, return a float such that  then the value is at the minimum value 0 is the returned value and when the value is at the maximum value 1 is the max
	var sf = (.125) * decks[deckID].length; //scale factor\
	var deckLength = 0
	//iterate through deck if slot not empty add to legnth var
	for (var i = 0; i < decks[deckID].length; i++) {
		if (decks[deckID][i] != undefined) deckLength++;
	}
	console.log('deck ' + deckID + ' length:' + deckLength)
	console.log('SF: ' + sf);
	var _min = min * sf
	var _max = max * sf
	var value = (input - _min) / (_max - _min);
	console.log(input, min, max, value);
	if (value < 0) value = 0;
	return value;
}

var deck1StatTotals = [0, 0, 0, 0, 0];
var deck2StatTotals = [0, 0, 0, 0, 0];
function scaleDeckTotals(d, deckID) {
	//deck count scale factor
	starchartUnitStats.forEach(function (stat, index) {
		var min = starchartMinMax[stat][0];
		var max = starchartMinMax[stat][1];
		console.log(deckID + 'this one: ' + stat + ': ' + d[index]);
		d[index] = doScaling(deckID, d[index], min, max);
	});
}


function updateDeckStatTotals(d, deckID) {
	//for each label in unitStats, add the total of values of the stats for each unit in the deck
	console.log('totals array: ' + d)
	console.log('deck ' + deckID)
	console.log(decks[deckID]);
	starchartUnitStats.forEach(function (label) {
		var total = 0;
		decks[deckID].forEach(function (unit) {
			total += parseFloat(unit[label]);
		});
		d.push(total);
	});
}

function updateChartData() {
	deck1StatTotals = [];
	deck2StatTotals = [];
	updateDeckStatTotals(deck1StatTotals, 0);
	updateDeckStatTotals(deck2StatTotals, 1);
	scaleDeckTotals(deck1StatTotals, 0);
	scaleDeckTotals(deck2StatTotals, 1);
	starcharts[0].data.datasets[0].data = deck1StatTotals;
	starcharts[1].data.datasets[0].data = deck2StatTotals;
	starcharts[0].update();
	starcharts[1].update();
}


function refreshStatsContent() {
	while (stats_content.firstChild) {
		stats_content.removeChild(stats_content.firstChild);
	};
	if (statsMode == 0) {
		stats_content.appendChild(video);
		video.play();
		stats_content.appendChild(statsUnitBottomContainer);
		stats_content.appendChild(statsChartContainer);
	}
	if (statsMode == 1) {
		updateChartData();
		stats_content.appendChild(comparisonChartContainer);
		//updateComparisonChart();
		//remove all children from stats_content

	}
}

refreshStatsContent()
//#endregion

var oldE = null
function unitMouseOver(e) {
	//if we are
	if (e.target.id == oldE) return;
	oldE = e.target.id;
	var unit = unitList.find(unit => unit.name === e.target.id);
	//console.log(e.target.id);
	currentUnit = e.target.id;
	unitMouseOverAndTapped(unit);
}
unitMouseOverAndTapped(unitList[0]);

/*
deprecated, we now add the listener to the cell when its created
//when a cell in the unit table is mouseover get the unit name from the cell and print to console
var unit_table = document.getElementsByClassName('unit_table_name_cell');
for (var i = 0; i < unit_table.length; i++) {
	unit_table[i].addEventListener('mouseover', statRedrawMouseOver);
}
	*/



