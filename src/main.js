/* eslint-disable no-redeclare */
//create 3 divs called unit_view, deck_view and stats_view, and a wrapper to contain them
import { sort } from 'fast-sort';
import Chart from 'chart.js/auto';
import { sidebar, updateBG } from './menu';
import { deck_view, addUnitToDeck, currentDeck, decks, decksInit } from './views/deckView';
import { locale } from './locale';
import { units } from './units';
import { myLog } from './utils'


var unitList = Object.values(units);

const minValues = [];
const maxValues = [];

//for each unit in unitlist
for (var unit of unitList) {
	myLog(unit);
	for (var [key, value] of Object.entries(unit)) {
		if (key == 'health' || key == 'damage' || key == 'damagea' || key == 'speed' || key == 'range' || key == 'dps' || key == 'dpsa') {
			if (minValues[key] == undefined || value <= minValues[key]) {
				minValues[key] = value;
				//if (key == 'speed') myLog(key, minValues[key]);
			}
			if (maxValues[key] == undefined || value > maxValues[key]) {

				if (key == 'health') maxValues[key] = 13000;
				else if (key == 'dps') maxValues[key] = 1800;
				else if (key == 'dpsa') maxValues[key] = 800;
				else maxValues[key] = value;
			}
		}
	}
}
myLog('minvalues', minValues);
myLog('maxvalues', maxValues);

var statsUnit = ['health', 'speed', 'range', 'damage', 'dps', 'damagea', 'dpsa'];

//helper function which takes a string and removes any spaces and capitilisation or the '-' symbol or + symbol or any other symbols... just letters and numbers
function removeSpacesCapitalsSpecialCharacters(input) {
	if (typeof input !== 'string') {
		input = String(input);
	}
	return input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}


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


//add a banner that says the unit content is out of date
//if the unit content is out of date
var unitContentOutOfDate = false;
if (unitContentOutOfDate) {
	var outOfDateBanner = document.createElement('div');
	outOfDateBanner.classList.add('outOfDateBanner');
	outOfDateBanner.textContent = locale("statsOutdated");
	//make the banner the will width of the parent div and only the height of the text
	//unit_view.appendChild(outOfDateBanner);
	//make the div a clickable link to 
	//when the div is clicked, open the link in a new tab
	outOfDateBanner.addEventListener('click', function () {
		window.open('https://www.reddit.com/r/BattleAces/comments/1gly8hp/balance_update_tomorrow_118/', '_blank');
	});
	//change the icon cursor the standard hyperlink cursor
	//make the banner text bold
	outOfDateBanner.style.cursor = 'pointer';
}


const deckView = deck_view;

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
updateBG(wrapper); //needs to load the background After wrapper has been created
wrapper.appendChild(app);
app.appendChild(unit_view);
app.appendChild(deckView);
app.appendChild(stats_view);

//#endregion

document.body.appendChild(wrapper);



//#region unit-header
//label
const sort_label = document.createElement('div');
sort_label.innerHTML = locale('sort') + ': ';
sort_label.classList.add('headerElement');
unit_view_header.appendChild(sort_label);
//create a dropdown selector for sorting
const unit_header_sort = document.createElement('select');
//add an option called test
function addOptionsToTable(displayName, statName) {
	unit_header_sort.add(new Option(displayName, statName));
}
//name, health, type, damage, air damage, dps, air dps, speed, range, matter, energy, bandwidth, skill, tech, tier, big, small, antibig, splash, antiair, manufacturer
const sortOptions = [
	[locale('name'), 'name'],
	[locale('health'), 'health'],
	[locale('type'), 'type'],
	[locale('damage'), 'damage'],
	[locale('airDamage'), 'damagea'],
	[locale('combinedDPS'), 'simpledamage'],
	[locale('groundDPS'), 'dps'],
	[locale('airDPS'), 'dpsa'],
	[locale('speed'), 'speed'],
	[locale('range'), 'range'],
	[locale('matter'), 'matter'],
	[locale('energy'), 'energy'],
	[locale('bandwidth'), 'bandwidth'],
	[locale('skill'), 'ability'],
	[locale('tech'), 'building'],
	[locale('tier'), 'tier'],
	[locale('big'), 'big'],
	[locale('small'), 'small'],
	[locale('antiBig'), 'antibig'],
	[locale('splash'), 'splash'],
	[locale('antiAir'), 'antiair'],
	[locale('manufacturer'), 'manufacturer']
];
sortOptions.forEach((option) => {
	addOptionsToTable(option[0], option[1])
});
filteredUnitList = sortUnits(unit_header_sort.value, filteredUnitList);

unit_header_sort.id = 'unit_header_sort';
unit_header_sort.classList.add('headerElement');
unit_view_header.appendChild(unit_header_sort);
//label
const view_label = document.createElement('p');
view_label.innerHTML = locale('view') + ': ';
view_label.classList.add('headerElement');
unit_view_header.appendChild(view_label);

var unitViewMode = 0; //0 = table 1 = card

//table view button
const unit_view_table_btn = document.createElement('button');
unit_view_table_btn.innerHTML = locale('table');
unit_view_table_btn.id = 'unit_view_table_btn';
unit_view_table_btn.classList.add('headerElement');
unit_view_header.appendChild(unit_view_table_btn);
//card view button
const unit_view_card_btn = document.createElement('button');
unit_view_card_btn.innerHTML = locale('card');
unit_view_card_btn.id = 'unit_view_card_btn';
unit_view_card_btn.classList.add('headerElement');
unit_view_header.appendChild(unit_view_card_btn);

//when table is selected set unitViewMode to 0
unit_view_table_btn.onclick = function () {
	unitViewMode = 0;
	unit_view_table_btn.classList.add('selected');
	unit_view_card_btn.classList.remove('selected');
	redrawUnitContent();
}
unit_view_table_btn.classList.add('selected');
//when card is selected set unitViewMode to 1
unit_view_card_btn.onclick = function () {
	unitViewMode = 1;
	unit_view_card_btn.classList.add('selected');
	unit_view_table_btn.classList.remove('selected');
	redrawUnitContent();
}
//unit_view_card_btn.classList.add('selected');



//filter input box
const unit_filter_input = document.createElement('input');
unit_filter_input.type = 'text';
unit_filter_input.id = 'unit_filter_input';
unit_filter_input.placeholder = locale('filter');
unit_filter_input.classList.add('headerElement');
//when user inputs text into filter input element
unit_filter_input.oninput = function () {
	setFilter(unit_filter_input.value);
	redrawUnitContent();
};

unit_view_header.appendChild(unit_filter_input);

//filter clear button that clears the filter
const unit_filter_clear_btn = document.createElement('button');
unit_filter_clear_btn.innerHTML = locale('clear');
unit_filter_clear_btn.id = 'unit_filter_clear_btn';
unit_filter_clear_btn.classList.add('headerElement');
unit_view_header.appendChild(unit_filter_clear_btn);
unit_filter_clear_btn.onclick = function () {
	//clear the filter
	unit_filter_input.value = '';
	//run the unit_filter input changed event
	unit_filter_input.dispatchEvent(new Event('input'));
}
const simple_stats_label = document.createElement('p');
simple_stats_label.innerHTML = locale('simple') + ': ';
simple_stats_label.classList.add('headerElement');
unit_view_header.appendChild(simple_stats_label);
//unit_simple_stats_checkbox is a checkbox
const unit_simple_stats_checkbox = document.createElement('input');
unit_simple_stats_checkbox.type = 'checkbox';
unit_view_header.appendChild(unit_simple_stats_checkbox);
//if checkbox is checked, hide the advanced stats
unit_simple_stats_checkbox.checked = true;
var simpleStatsMode = true;
//mouseover /alt text for the checkbox
unit_simple_stats_checkbox.title = 'Simple Health/Damage NOT to scale';
unit_simple_stats_checkbox.addEventListener('change', function () {
	if (unit_simple_stats_checkbox.checked) {
		simpleStatsMode = true;
	} else {
		simpleStatsMode = false;
	}
	redrawUnitContent();
});
var hideUnavailMode = true;
//hide unavailable units checkbox
const hide_unavail_label = document.createElement('p');
hide_unavail_label.innerHTML = locale('hideUnavail') + ': ';
hide_unavail_label.classList.add('headerElement');
unit_view_header.appendChild(hide_unavail_label);
//unit_hide_unavailable_units_checkbox is a checkbox
const hide_unavail_checkbox = document.createElement('input');
hide_unavail_checkbox.type = 'checkbox';
hide_unavail_checkbox.title = 'Hide unavailable units based on deck';
unit_view_header.appendChild(hide_unavail_checkbox);
//if checkbox is checked, hide unavailable units based on deck
hide_unavail_checkbox.checked = true;
hide_unavail_checkbox.addEventListener('change', function () {
	if (hide_unavail_checkbox.checked) {
		hideUnavailMode = true;
	} else {
		hideUnavailMode = false;
	}
	redrawUnitContent();
});




//#endregion

//#region unit filter

var filteredUnitList = []; //holds the list of units as updated by setFilter()
//populate the filteredUnitList with all the units from unitList by default
function repopulateFilteredUnitList() {
	filteredUnitList = [];
	for (var i = 0; i < unitList.length; i++) {
		filteredUnitList.push(unitList[i]);
	}
	setFilter(unit_filter_input.value);
	filteredUnitList = sortUnits(unit_header_sort.value, filteredUnitList);
}
repopulateFilteredUnitList();

//setFilter is called when the filter input text is updated
function setFilter(filterString) {
	filterString = removeSpacesCapitalsSpecialCharacters(filterString);
	myLog('Filter set to ' + filterString);

	filteredUnitList = []; //holds the list of units as updated by setFilter()



	if (filterString == 'wildfoundry') {
		for (var i = 0; i < unitList.length; i++) {
			if (unitList[i].building == 'foundry' ||
				unitList[i].building == 'advancedfoundry'
			) {
				filteredUnitList.push(unitList[i]);
			}
		}
	}
	else if (filterString == 'wildstarforge') {
		for (var i = 0; i < unitList.length; i++) {
			if (unitList[i].building == 'starforge' ||
				unitList[i].building == 'advancedstarforge'
			) {
				filteredUnitList.push(unitList[i]);
			}
		}
	}
	else if (filterString == 'foundry' ||
		filterString == 'starforge' ||
		filterString == 'advancedfoundry' ||
		filterString == 'advancedstarforge') {
		for (var i = 0; i < unitList.length; i++) {
			if (unitList[i].building == filterString) {
				filteredUnitList.push(unitList[i]);
			}
		}
	}
	else {

		for (var i = 0; i < unitList.length; i++) {
			if (removeSpacesCapitalsSpecialCharacters(unitList[i].name).includes(filterString) ||
				removeSpacesCapitalsSpecialCharacters(unitList[i].building).includes(filterString) ||
				removeSpacesCapitalsSpecialCharacters(unitList[i].type).includes(filterString) ||
				removeSpacesCapitalsSpecialCharacters(unitList[i].traits).includes(filterString) ||
				removeSpacesCapitalsSpecialCharacters(unitList[i].manufacturer).includes(filterString) ||
				unitList[i].ability.toLowerCase().includes(filterString)
			) {
				filteredUnitList.push(unitList[i]);
			}
		}
	}
}

//#endregion

//#region unit-content

//unitRows stores the rows of unit table by unit name so we can apply highlights later
var tableUnitRows = {};

var excludeKeys = [];

function drawUnitTable() {
	excludeKeys = ['leaderboardid', 'multi1', 'multi2', 'multi3', 'target1', 'target2', 'target3', 'traitcounters', 'traitcounteredby', 'attackrate', 'tier', 'splash', 'small', 'big', 'antiair', 'antibig', 'slug', 'videoturnaround', 'videogameplay', 'emoji', 'website'];
	if (simpleStatsMode) {
		//add to excludeKeys, the following: damageg, damagea, dps, dpsa
		excludeKeys.push('damage', 'speed', 'damagea', 'dps', 'dpsa', 'health');
	}
	else {
		excludeKeys.push('simplespeed', 'simpledamage', 'hp/100')
	}
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
	var unit_table_add_header = document.createElement('th');
	unit_table_add_header.classList.add('unit_table_header');
	unit_table_add_header.innerHTML = locale('add');
	unit_table_head.appendChild(unit_table_add_header);


	//##tag unit-content-table-loop
	//table header using the 2nd object in the object list
	for (const [key] of Object.entries(unitList[0])) {
		if (!excludeKeys.includes(key)) {
			var unit_table_header = document.createElement('th');
			unit_table_header.classList.add('unit_table_header');
			//add some images to certain headers
			if (key == 'health' || key == 'damage' || key == 'damagea' || key == 'speed' || key == 'simplespeed' || key == 'range') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + key + '.png';
				img.classList.add('unit_table_header_image');
				if (key == 'damagea') {
					img.setAttribute('alt', 'Air Damage');
					img.setAttribute('title', 'Air Damage');
				}
				else {
					img.setAttribute('alt', key);
					img.setAttribute('title', key);
				}
				unit_table_header.appendChild(img);
			} else if (key == 'hp/100') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'health' + '.png';
				img.classList.add('unit_table_header_image');
				img.setAttribute('alt', 'Health/100');
				img.setAttribute('title', 'Health/100');
				unit_table_header.appendChild(img);
				unit_table_header.classList.add('unit_table_smalltext');
			} else if (key == 'simpledamage') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'damage' + '.png';
				img.classList.add('unit_table_header_image');
				img.setAttribute('alt', 'DPS/10');
				img.setAttribute('title', 'DPS/10');
				unit_table_header.appendChild(img);
				unit_table_header.classList.add('unit_table_smalltext');
			}
			else if (key == 'dps') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'damage' + '.png';
				img.classList.add('unit_table_header_image');
				img.setAttribute('alt', 'ground dps');

				img.setAttribute('title', 'ground dps');
				unit_table_header.appendChild(img);
				unit_table_header.innerHTML += '/s';
				unit_table_header.classList.add('unit_table_smalltext');
			} else if (key == 'dpsa') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'damagea' + '.png';
				img.classList.add('unit_table_header_image');
				img.setAttribute('alt', 'air dps');
				img.setAttribute('title', ' air dps');
				unit_table_header.appendChild(img);
				unit_table_header.innerHTML += '/s';
				unit_table_header.classList.add('unit_table_smalltext');
			} else if (key == 'matter' || key == 'energy' || key == 'bandwidth') {
				var img = document.createElement('img');
				img.src = 'images/resources/' + key + '.svg';
				img.classList.add('unit_table_header_image');
				img.setAttribute('alt', key);
				img.setAttribute('title', key);
				unit_table_header.appendChild(img);
			} else if (key == 'image') {
				key == 'tier';
				unit_table_header.innerHTML = locale('image');
				//no header name for images
			} else if (key == 'ability') {
				unit_table_header.innerHTML = locale('ability');
			} else if (key == 'manufacturer') {
				unit_table_header.innerHTML = locale('shortManf');
			} else if (key == 'building') {
				unit_table_header.innerHTML = locale('tech');
			} else {
				unit_table_header.innerHTML = locale(key);
			}

			unit_table_head.appendChild(unit_table_header);
		}
	}

	//this is the unit content table loop
	for (let i = 0; i < filteredUnitList.length; i++) {
		var unit = filteredUnitList[i];
		//create a table row element
		var unit_table_row = document.createElement('tr');
		unit_table_row.id = unit.name;
		unit_table_row.classList.add('unit_table_row');
		tableUnitRows[unit.name] = unit_table_row;

		//create a table cell element for each unit property
		//add the unit property to the table cell
		//for each key in the current unit

		//the first cell of each row, we will add a button to add the unit to the deck
		var unit_table_cell = document.createElement('td');
		unit_table_cell.id = unit.name;
		if (i % 2 == 0) {
			unit_table_cell.classList.add('unit_table_cell_alt');
		}
		//add the unit property to the table cell
		var div = document.createElement('div');
		//div.innerHTML = unit.name;
		unit_table_cell.appendChild(div);
		unit_table_cell.classList.add('unit_table_cell');

		//#tag table_add_unit_button
		//add the button
		var table_add_unit_button = document.createElement('button');
		//add text to the button
		table_add_unit_button.innerHTML = '+';
		table_add_unit_button.classList.add('table_add_unit_button')
		//add the button to the cell
		unit_table_cell.classList.add('table_add_unit_button_cell');
		unit_table_cell.appendChild(table_add_unit_button);

		table_add_unit_button.onclick = function () {
			myLog(i + 'adding unit to deck: ' + filteredUnitList[i].name)
			addUnitToDeck(filteredUnitList[i], currentDeck);
		};
		table_add_unit_button.onmouseover = function () {
			unitMouseOverAndTapped(filteredUnitList[i]);
		};
		//table_add_unit_button.addEventListener('mouseover', unitMouseOver);

		//add the cell to the row
		unit_table_row.appendChild(unit_table_cell);
		unit_table_row.addEventListener('mouseover', unitMouseOver);

		//console.log('drawing row for unit', unit);
		for (const [key, value] of Object.entries(unit)) {
			if (!excludeKeys.includes(key)) {
				var unit_table_cell = document.createElement('td');
				unit_table_cell.id = unit.slug;
				if (simpleStatsMode) {
					unit_table_cell.classList.add('simpleStatsPadding');
				}

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
					unit_table_cell.appendChild(img);
				} else if (key == 'building') {
					img.src = 'images/techtiers/' + value + '.svg';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unit_table_image_medium');
					unit_table_cell.appendChild(img);
				} else if (key == 'ability') {
					if (value != ' ') {
						img.src = 'images/abilities/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unit_table_image_medium');
						unit_table_cell.appendChild(img);
					}
					if (unit['traits'] == null) {
						//console.log(unit['name']);
						if (unit['name'] == 'raider') {
							var unit_table_cell = document.createElement('td');
							unit_table_cell.id = unit.slug;
							if (i % 2 == 0) {
								unit_table_cell.classList.add('unit_table_cell_alt');
							}
							if (simpleStatsMode) {
								unit_table_cell.classList.add('simpleStatsPadding');
							}
							unit_table_cell.classList.add('unit_table_cell');
							unit_table_row.appendChild(unit_table_cell);
						}
					}
				} else if (key == 'manufacturer') {
					if (value != '') {
						img.src = 'images/manuf/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unit_table_image_small');
						unit_table_cell.appendChild(img);
					}
				} else if (key == 'traits') {
					if (value) {
						value.forEach(trait => {
							if (trait != 'none') {
								var img = document.createElement('img');
								img.src = 'images/traits/' + trait + '.png';
								img.classList.add('unit_table_image_small');
								img.setAttribute('alt', trait);
								img.setAttribute('title', trait);
								unit_table_cell.appendChild(img);
							}
						});
					}
					unit_table_cell.classList.add('unit_table_cell_traits');
				} else {
					if (key == 'name') {
						unit_table_cell.innerHTML = locale(value)
					} else if (key == 'type') {
						//if not simple stats
						if (!simpleStatsMode) {
							if (value == 'ground') unit_table_cell.innerHTML = locale('shortGround');
							if (value == 'air') unit_table_cell.innerHTML = locale('shortAir');
						}
						else unit_table_cell.innerHTML = locale(value);
					}
					else {
						myLog(unit.name + ' key: ' + key + ' value: ' + value)
						unit_table_cell.innerHTML = value || '0';
					}
				}

				if (key == 'health' || key == 'damage' || key == 'speed' || key == 'range') {
					unit_table_cell.classList.add('unit_table_cell_stats');
				}
			}
		}
		//div.innerHTML = unit.name;
		//unit_table_cell.add(div);

		//create a table body element
		unit_table_body.appendChild(unit_table_row);
	}

	//attach the unit_table to the unit_content div
	unit_content.appendChild(unit_table);
}

var unitCards = {};
function createUnitCard(unit) {
	//create a card div
	var unit_card = document.createElement('div');
	//add a class to the card div
	unit_card.classList.add('unit_card');
	//
	//when the unit is moused over, call the mouseover function to update the views
	unit_card.addEventListener('mouseover', () => {
		myLog(unit.name);
		unitMouseOverAndTapped(unit);
	});
	//when the unit is clicked, add the unit to the deck
	unit_card.addEventListener('click', () => {
		addUnitToDeck(unit, currentDeck);
	});

	//matter
	var unit_card_matter = document.createElement('div');
	unit_card_matter.classList.add('unit_card_matter');
	unit_card_matter.classList.add('unit_card_text');
	unit_card_matter.innerHTML = unit.matter
	unit_card.appendChild(unit_card_matter);
	//bandwidth
	var unit_card_bandwidth = document.createElement('div');
	unit_card_bandwidth.classList.add('unit_card_text');
	unit_card_bandwidth.classList.add('unit_card_bandwidth');
	unit_card_bandwidth.innerHTML = unit.bandwidth
	unit_card.appendChild(unit_card_bandwidth);
	//energy
	var unit_card_energy = document.createElement('div');
	unit_card_energy.classList.add('unit_card_energy');
	unit_card_energy.classList.add('unit_card_text');
	unit_card_energy.innerHTML = unit.energy;
	unit_card.appendChild(unit_card_energy);

	var unit_card_name = document.createElement('div');
	unit_card_name.classList.add('unit_card_name');
	unit_card_name.classList.add('unit_card_text');
	unit_card_name.innerHTML = locale(unit.slug);
	unit_card.appendChild(unit_card_name);
	//create a div for the unit image
	var unit_card_image = document.createElement('img');
	unit_card_image.src = 'images/units/' + unit.slug + '.png';
	unit_card_image.alt = unit.name;
	unit_card_image.title = unit.name;
	unit_card_image.classList.add('unit_card_image');
	unit_card.appendChild(unit_card_image);
	//create a div for the unit building
	var unit_card_building = document.createElement('img');
	unit_card_building.src = 'images/techtiers/' + unit.building + '.svg';
	unit_card_building.alt = unit.building;
	unit_card_building.title = unit.building;
	unit_card_building.classList.add('unit_card_building');
	unit_card.appendChild(unit_card_building);
	//create a div for the unit type
	var unit_card_type = document.createElement('div');
	unit_card_type.classList.add('unit_card_type');
	unit_card_type.classList.add('unit_card_text');
	//create a div for the unit traits
	var unit_card_traits = document.createElement('div');
	unit_card_traits.classList.add('unit_card_traits');
	//for each trait in the unit traits array
	myLog(unit);
	if (unit.traits) {
		for (let i = 0; i < unit.traits.length; i++) {
			//create a div for the trait
			var unit_card_trait = document.createElement('img');
			unit_card_trait.src = 'images/traits/' + unit.traits[i] + '.png';
			unit_card_trait.alt = unit.traits[i];
			unit_card_trait.title = unit.traits[i];
			unit_card_trait.classList.add('unit_card_trait');
			unit_card_traits.appendChild(unit_card_trait);
		}
	}
	unit_card.appendChild(unit_card_traits);
	//create a div for the unit manufacturer
	var unit_card_manufacturer = document.createElement('div');
	//if the manufacturer is not none
	if (unit.manufacturer != 'none') {
		unit_card_manufacturer.style.backgroundImage = 'url("images/manuf/' + unit.manufacturer + '.png")	';
		unit_card_manufacturer.classList.add('unit_card_manufacturer');
		unit_card.appendChild(unit_card_manufacturer);
	}

	unit_card_type.innerHTML = locale(unit.type);
	unit_card.appendChild(unit_card_type);



	//name

	unitCards[unit.name] = unit_card;
	return unit_card
}

function drawUnitCards() {
	//create a container div
	var unit_card_container = document.createElement('div');
	//add a class to the container div
	unit_card_container.id = 'unit_card_container';
	//add the container div to the unit_content div

	//for each unit in the unit list create a card
	for (let i = 0; i < filteredUnitList.length; i++) {
		//add the card body div to the card div
		unit_card_container.appendChild(createUnitCard(filteredUnitList[i]));
	}

	unit_content.appendChild(unit_card_container);
}

//#endregion

//#region redrawUnitContent expensive function: draws unit content div, iterates unitList for display
function redrawUnitContent() {


	unit_content.innerHTML = '';
	//for each object in unitsJson_base create a new unit passing the object
	myLog('Redrawing Unit Content\n-----------------');
	myLog(filteredUnitList);

	//before drawing the unit table or cards, remove the selected units for the current deck from the filtered unit lists
	if (hideUnavailMode == true) {
		for (let i = 0; i < decks[currentDeck].length; i++) {
			//if the unit is in the unit list
			//if (decks[currentDeck][i]) myLog('looking for ' + decks[currentDeck][i].name + 'in deck ' + currentDeck);
			if (filteredUnitList.includes(decks[currentDeck][i])) {
				//remove the unit from the unit list
				myLog('removing from filtered unitlist')
				filteredUnitList.splice(filteredUnitList.indexOf(decks[currentDeck][i]), 1);
				//myLog(filteredUnitList);
			}
		}
		//if decks[currentDeck][0] and decks[currentDeck][5] are both occupied
		//then remove all units whose building key matches core from the filtered unit list
		myLog(decks[currentDeck])
		if (decks[currentDeck][0] && decks[currentDeck][4]) {
			//remove all units whose building key matches core from the filtered unit list
			filteredUnitList = filteredUnitList.filter((unit) => {
				return unit.building != 'core';
			});
		};
		//if decks[currentDeck][1] and decks[currentDeck][3] are both occupied
		if (decks[currentDeck][1] && decks[currentDeck][3]) {
			//remove all units whose building key matches foundry from the filtered unit list
			filteredUnitList = filteredUnitList.filter((unit) => {
				return unit.building != 'foundry';
			});
		};
		if (decks[currentDeck][2] && decks[currentDeck][3]) {
			filteredUnitList = filteredUnitList.filter((unit) => {
				return unit.building != 'advancedfoundry';
			});
		};
		if (decks[currentDeck][5] && decks[currentDeck][7]) {
			filteredUnitList = filteredUnitList.filter((unit) => {
				return unit.building != 'starforge';
			});
		};
		if (decks[currentDeck][6] && decks[currentDeck][7]) {
			filteredUnitList = filteredUnitList.filter((unit) => {
				return unit.building != 'advancedstarforge';
			});
		};







	} else {
		//if hideUnavailMode is false, we need to add the units back to the unit list
		repopulateFilteredUnitList()
	}

	//if unitview mode == 0 draw table view
	if (unitViewMode == 0) {
		drawUnitTable();
	}
	//if unitview mode == 1 draw card view
	else if (unitViewMode == 1) {
		drawUnitCards();
	}


}

redrawUnitContent(); //upon loading the page we redraw the UnitContentDiv once to initialise it

//#endregion

//#region change-sort

//sort units
function sortUnits(value, list) {
	// Sort users (array of objects) by firstName in descending order
	var sorted = undefined;
	if (value == 'name' || value == 'manufacturer') {
		sorted = sort(list).asc((u) => u[value]);
	}
	else {
		sorted = sort(list).desc((u) => u[value]);
	}
	return sorted;
}


unit_header_sort.onchange = function () {
	//sort the units by the new option
	//new function for sorting units
	myLog(unit_header_sort.value);
	filteredUnitList = sortUnits(unit_header_sort.value, filteredUnitList);

	redrawUnitContent();
};


//#endregion

//#region window-resize

//create a function that runs when the window is resized
function resize() {
	myLog('resized');
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
var compareMode = 0 //0= stats, 1 = resources, 2 = traits
const stats_button = document.createElement('button');
stats_button.innerHTML = locale('unit');
stats_button.id = 'stats_button';
stats_button.classList.add('headerElement');
stats_view_header.appendChild(stats_button);
//when button is pressed set current mode to unit
stats_button.addEventListener('click', function () {
	statsMode = 0
	stats_button.classList.add('selected');
	compare_button.classList.remove('selected');
	stats_mode_select.disabled = true;
	refreshStatViewContent()
});
const compare_button = document.createElement('button');
compare_button.innerHTML = locale('compare');
compare_button.id = 'compare_button';
compare_button.classList.add('headerElement');
stats_view_header.appendChild(compare_button);
//when deck 2 is pressed it should set current deck to 1
compare_button.addEventListener('click', function () {
	statsMode = 1;
	stats_button.classList.remove('selected');
	compare_button.classList.add('selected');
	stats_mode_select.disabled = false;
	refreshStatViewContent()
});
stats_button.classList.add('selected');

//dropdown to choose between stats, resource and traits comparison modes
const stats_mode_select = document.createElement('select');
stats_mode_select.disabled = true;
stats_mode_select.id = 'stats_mode_select';
stats_mode_select.classList.add('headerElement');
stats_view_header.appendChild(stats_mode_select);
//add option to stats mode select for stats, resources and traits
var stats_mode_select_options = [locale('stats'), locale('resources')]; //todo: add trait comparison
stats_mode_select_options.forEach(function (option) {
	var option_element = document.createElement('option');
	option_element.value = option;
	option_element.innerHTML = option;
	stats_mode_select.appendChild(option_element);
});
//when an option is selected, set compareMode to the selected index
stats_mode_select.addEventListener('change', function () {
	compareMode = stats_mode_select.selectedIndex;
	refreshStatViewContent()
});

//#endregion

//#region stats-content


var sortedUnitData = {
	health: [],
	speed: [],
	range: [],
	damage: [],
	dps: [],
	damagea: [],
	dpsa: [],
}
var sortData = {
	health: simpleSort(unitList, 'health', sortedUnitData.health),
	damage: simpleSort(unitList, 'damage', sortedUnitData.damage),
	damagea: simpleSort(unitList, 'damagea', sortedUnitData.damagea),
	speed: simpleSort(unitList, 'speed', sortedUnitData.speed),
	range: simpleSort(unitList, 'range', sortedUnitData.range),
	dps: simpleSort(unitList, 'dps', sortedUnitData.dps),
	dpsa: simpleSort(unitList, 'dpsa', sortedUnitData.dpsa),
}



//returns a colour on a gradient scale from red to green based on the value
function getColour(value, min, max) {
	if (value <= 0 || value == null) return 'black';
	//myLog('getColour:', value, min, max);
	var red = 0;
	var green = 0;
	//if value is less than min, return red
	if (value <= min) {
		red = 255;
		green = 0;
	}
	//if value is greater than max, return green
	else if (value >= max) {
		red = 0;
		green = 255;
	}
	//if value is between min and max, return a colour between red and green
	else {
		red = 255 - Math.round((value - min) / (max - min) * 255);
		green = Math.round((value - min) / (max - min) * 255);
	}
	//myLog('FJSDKALFJKL;SADFJSKLADFJKLASDFJKLADSFJKLADSFJNMKLSADF');
	//myLog('rgb(' + red + ', ' + green + ', 0)')
	return 'rgb(' + red + ', ' + green + ', 0)';

}


//data is sortdata for the label, 
function sortColors(_unit, label) {
	//get the unit by the unitName 
	//myLog('sortColors:', _unit, data, label);
	//myLog('huh?: ', _unit[label], minValues[label], maxValues[label]);
	var color = getColour(_unit[label], minValues[label], maxValues[label]);
	var sortedColors = [];

	var rank = sortedUnitData[label].length - sortedUnitData[label].lastIndexOf(_unit[label]);

	for (let i = 0; i < (sortedUnitData[label].length); i++) {
		if (i < sortedUnitData[label].length - (rank - 1)) sortedColors.push(color);
		else sortedColors.push('black');
	}

	sortedUnitData[label].forEach(function (unit) {
		sortedColors.push(color)
		if (unit == _unit) { //once we reaach the passed unit we set color to black which pushes the rest of the units as black bars
			color = 'black'
		}
	});

	return sortedColors
}


var currentUnit = 'crusader';

myLog('sorterd unit data')
myLog('------------------------------')
myLog(sortedUnitData)

const statsUnitRightContainer = document.createElement('div');
statsUnitRightContainer.id = 'statsUnitRightContainer';
stats_content.appendChild(statsUnitRightContainer);

const statsUnitTraitsContainer = document.createElement('div');
statsUnitTraitsContainer.id = 'statsUnitTraitsContainer';
statsUnitRightContainer.appendChild(statsUnitTraitsContainer);

var statsUnitTypeDiv = document.createElement('div');
statsUnitTypeDiv.classList.add('statsUnitTypeDiv');
statsUnitTypeDiv.textContent = 'test';
statsUnitTraitsContainer.appendChild(statsUnitTypeDiv);

var statsUnitTraitsDiv = document.createElement('div');
statsUnitTraitsDiv.classList.add('statsUnitTraitsDiv');
statsUnitTraitsContainer.appendChild(statsUnitTraitsDiv);

var statsUnitTraitCountersDiv = document.createElement('div');
statsUnitTraitCountersDiv.classList.add('statsUnitTraitsDiv');
statsUnitTraitsContainer.appendChild(statsUnitTraitCountersDiv);

var statsUnitTraitCounteredByDiv = document.createElement('div');
statsUnitTraitCounteredByDiv.classList.add('statsUnitTraitsDiv');
statsUnitTraitsContainer.appendChild(statsUnitTraitCounteredByDiv);

function updateTraitsContainer(_unit) {
	statsUnitTypeDiv.textContent = locale(_unit.type)
	//display traits as images
	if (_unit.name == 'raider') {
		statsUnitTraitsDiv.textContent = locale('traits') + ': ' + locale('raiderTraits');
		statsUnitTraitCountersDiv.textContent = locale('counters') + ': ' + locale('economy');
		statsUnitTraitCounteredByDiv.textContent = locale('counteredBy') + ': ' + locale('scouting');
	}
	else {
		statsUnitTraitsDiv.textContent = locale('traits') + ': ';
		_unit.traits.forEach(function (trait) {
			var traitImg = document.createElement('img');
			traitImg.classList.add('statsUnitTraitImg');
			traitImg.src = 'images/traits/' + trait + '.png';
			statsUnitTraitsDiv.appendChild(traitImg);
		});

		statsUnitTraitCountersDiv.textContent = locale('counters') + ': ';
		if (_unit.traitcounters) {
			_unit.traitcounters.forEach(function (trait) {
				var traitImg = document.createElement('img');
				traitImg.classList.add('statsUnitTraitImg');
				traitImg.src = 'images/traits/' + trait + '.png';
				statsUnitTraitCountersDiv.appendChild(traitImg);
			});
		}

		statsUnitTraitCounteredByDiv.textContent = locale('counteredBy') + ': ';
		if (_unit.traitcounteredby) {
			_unit.traitcounteredby.forEach(function (trait) {
				var traitImg = document.createElement('img');
				traitImg.classList.add('statsUnitTraitImg');
				traitImg.src = 'images/traits/' + trait + '.png';
				statsUnitTraitCounteredByDiv.appendChild(traitImg);
			});
		}
	}

}


const statsUnitChartContainer = document.createElement('div');
statsUnitChartContainer.id = 'statsUnitChartContainer';
statsUnitRightContainer.appendChild(statsUnitChartContainer);

var statsUnitRankDiv = document.createElement('div');
statsUnitRankDiv.id = 'statsUnitRankDiv';
statsUnitChartContainer.appendChild(statsUnitRankDiv);

var statsUnitRankTextDivs = {}
//for each label add a seperate div to statsUnitRankDiv
//for each label in statsUnitmyLog('statsUnit:', statsUnit); // Check content of statsUnit

for (var i = 0; i < statsUnit.length; i++) {
	var key = statsUnit[i];
	var statsUnitRankTextDiv = document.createElement('div');
	statsUnitRankTextDiv.classList.add('statsUnitRankTextDiv');
	statsUnitRankTextDiv.textContent = key; // Use textContent
	statsUnitRankTextDivs[key] = statsUnitRankTextDiv;

	statsUnitRankDiv.appendChild(statsUnitRankTextDiv);

}


const statsUnitBottomContainer = document.createElement('div');
statsUnitBottomContainer.id = 'statsUnitBottomContainer';
statsUnitBottomContainer.innerHTML = '';

const unitOfficialLinkDiv = document.createElement('div');
unitOfficialLinkDiv.id = 'unitOfficialLinkDiv';
const unitOfficialLink = document.createElement('a');
unitOfficialLink.id = 'unitOfficialLink';
unitOfficialLinkDiv.appendChild(unitOfficialLink);
unitOfficialLink.innerHTML = locale('unitLink');
unitOfficialLink.href = currentUnit.website;
unitOfficialLink.target = '_blank'

const statsUnitName = document.createElement('div');
statsUnitName.id = 'statsUnitName';
statsUnitName.innerHTML = locale(currentUnit.name);

//using stats and matter div below as a template, make a function that creates such divs for other unit stats

function createStatsUnitBottomDiv(label) {
	var statsUnitDiv = document.createElement('div');
	statsUnitDiv.classList.add('statsUnitResourceDiv');
	var statsUnitImg = document.createElement('img');
	//set the src of the img to the relevant label icon
	if (label == 'Building') {
		statsUnitImg.src = 'images/techtiers/' + 'core' + '.svg';
		statsUnitImg.classList.add('statsUnitBuildingImg')
	}
	else if (label == 'Ability') {
		statsUnitImg.src = 'images/techtiers/' + 'core' + '.svg';
		statsUnitImg.classList.add('statsUnitBuildingImg')
	}
	else {
		statsUnitImg.src = 'images/resources/' + removeSpacesCapitalsSpecialCharacters(label) + '.svg';
		statsUnitImg.classList.add('statsUnitResourceImg');
	}

	//add the img to the matterDivca
	statsUnitDiv.appendChild(statsUnitImg);
	//add a text value to energy div for the units energy value
	var statsUnitValue = document.createElement('div');
	statsUnitValue.id = 'statsUnit' + label + 'Value';
	statsUnitValue.classList.add('statsUnitResourceValue');
	statsUnitDiv.appendChild(statsUnitValue);
	return statsUnitDiv;
}

const statsUnitMatterDiv = createStatsUnitBottomDiv('Matter');
const statsUnitEnergyDiv = createStatsUnitBottomDiv('Energy');
const statsUnitBandwidthDiv = createStatsUnitBottomDiv('Bandwidth');
const statsUnitBuildingDiv = createStatsUnitBottomDiv('Building');
const statsUnitAbilityDiv = createStatsUnitBottomDiv('Ability');


statsUnitBottomContainer.appendChild(statsUnitBuildingDiv);
statsUnitBottomContainer.appendChild(statsUnitName);
statsUnitBottomContainer.appendChild(statsUnitMatterDiv);
statsUnitBottomContainer.appendChild(statsUnitEnergyDiv);
statsUnitBottomContainer.appendChild(statsUnitBandwidthDiv);
statsUnitBottomContainer.appendChild(statsUnitAbilityDiv);
4
var chartDivs = []
var statRankBarCharts = []

//video element
const video = document.createElement('video');
//video source is the units videoTurnaround key
video.src = unitList[1].videoturnaround;
//set video to repeat
video.loop = true;
//crop the right 30% of the video
const videoblind = document.createElement('div');
videoblind.id = 'videoblind';
videoblind.style = 'position: absolute; background-color: black; width: 100%; height: 100%;';

video.id = 'unitVideo';

function updateStatsUnit() {
	stats_content.appendChild(unitOfficialLinkDiv);
	stats_content.appendChild(video);
	video.play();
	stats_content.appendChild(videoblind);
	stats_content.appendChild(statsUnitBottomContainer);
	stats_content.appendChild(statsUnitRightContainer);
}


function statRankChart(label) {

	var statsUnitChartDiv = document.createElement('div');
	chartDivs.push(statsUnitChartDiv);
	statsUnitChartDiv.classList.add('statsUnitChartDiv');
	statsUnitChartContainer.appendChild(statsUnitChartDiv);
	var barChart = document.createElement('canvas');
	barChart.classList.add('barchart');
	statsUnitChartDiv.appendChild(barChart);

	//create an img element of the relevant label icon
	var img = document.createElement('img');
	img.src = 'images/stats/' + label + '.png';
	img.classList.add('statsUnitChartImages');
	//set img colour using getColour()
	img.style.color = getColour(currentUnit, sortData[label], maxValues[label]);
	statsUnitChartDiv.appendChild(img);


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
				backgroundColor: getColour(currentUnit.label, minValues[label], maxValues[label]), //TODO: GetColour is bugged, should be red to green based on value
				borderWidth: 0
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			barPercentage: 2,
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
						else if (label == 'dps') return 1800;
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

	statRankBarCharts[label] = chart;


}

//write a function to update the chart data backgroundColor
function updateStatRankChartColor(_unit, chart, label) {
	chart.data.datasets[0].backgroundColor = sortColors(_unit, label);
	chart.update();
}

//run updateStatRankChartColor on each label
function updateStatRankChartColors(_unit) {
	for (var [key] of Object.entries(sortedUnitData)) {
		updateStatRankChartColor(_unit, statRankBarCharts[key], key);
	}
}


//draw stat rank charts
for (var [key] of Object.entries(sortedUnitData)) {
	//myLog(key);
	statRankChart(key);
}

var prespan = '<span class = "rankchartsuperscript">';
var postspan = '</span>';
//add 'st', 'nd', 'rd', 'th' to the rank based on the rank number
function getRankSuffix(rank) {
	//if rank ends in 1
	var output = '';
	if (rank == 11 || rank == 12 || rank == 13) output = 'th';
	else if (rank % 10 == 1) output = 'st';
	//if rank ends in 2
	else if (rank % 10 == 2) output = 'nd';
	//if rank ends in 3
	else if (rank % 10 == 3) output = 'rd';
	else output = 'th';
	//add a HTML span lement to adjust the size of the text before and after the output
	output = prespan + output + postspan;
	return output;
}

function updateStatsUnitBottomContainer(name, matter, energy, bandwidth, building, ability) {
	statsUnitName.innerHTML = locale(name);
	//get the div by its id
	statsUnitMatterDiv.children[1].innerHTML = matter;
	statsUnitEnergyDiv.children[1].innerHTML = energy;
	statsUnitBandwidthDiv.children[1].innerHTML = bandwidth;
	statsUnitBuildingDiv.children[0].src = 'images/techtiers/' + building + '.svg';
	if (ability != ' ') {
		//show the element
		statsUnitAbilityDiv.children[0].style.display = 'inline';
		statsUnitAbilityDiv.children[0].src = 'images/abilities/' + ability + '.png';
	} else {
		//hide the element
		statsUnitAbilityDiv.children[0].style.display = 'none';
	}
}

var prevMouseoverUnit = null;


//#region unitMouseOverAndTapped here is the function which updates all the stat view divs when a unit is mouseOvered (either in deck or unit views)

function unitMouseOverAndTapped(unit) {
	if (!unit) return;
	if (prevMouseoverUnit == unit) {
		//skip this if it's the same unit, to prevent duplicate loadings of the video for same unit
		return;
	}
	prevMouseoverUnit = unit;
	//myLog(e.target.id);
	//add a mouseOverHighlighted class to the unit row in the unit table using tableUnitRows
	//remove the mouseOverHighlighted class from all other unit rows
	if (unitViewMode == 0) //if in table view
	{
		for (var [key] of Object.entries(tableUnitRows)) {
			tableUnitRows[key].classList.remove('mouseOverHighlighted');
		}
		tableUnitRows[unit.name].classList.add('mouseOverHighlighted');
	}
	else if (unitViewMode == 1) //if in card view mode
	{
		//for each unit in unitCards (these are divs), add the same classes above
		for (var [key] of Object.entries(unitCards)) {
			unitCards[key].classList.remove('mouseOverHighlighted');
		}
		unitCards[unit.name].classList.add('mouseOverHighlighted');
	}
	//get the unit from unit list by its name

	//return if in stats mode After mouseover highlight class added above
	if (statsMode != 0) return; //exits if in deck compare mode for the stats view

	//statsUnitName.innerHTML = e.target.id + '   ' + unit.matter + ' ' + unit.energy;
	//do the same as above, but add the matter and energy images before the values

	//for each key in statsUnitRankTextDivs, update the divs value to the units rank
	//for each key in statsUnitRankTextDivs, update the divs value to the units rank
	for (var [key] of Object.entries(statsUnitRankTextDivs)) {
		var rank = sortedUnitData[key].length - sortedUnitData[key].lastIndexOf(unit[key]);
		if (unit[key] == 0) statsUnitRankTextDivs[key].innerHTML = '';
		else {
			statsUnitRankTextDivs[key].innerHTML = rank + getRankSuffix(rank);
			//add the value of the key
			statsUnitRankTextDivs[key].innerHTML += ' |<i> ' + unit[key];
		}

	}



	videoblind.style.opacity = 1
	// periodically decrease the opacity of the video blind
	var fadein;
	unitOfficialLink.href = unit.website
	fadein = setInterval(() => {
		videoblind.style.opacity = videoblind.style.opacity -= .01
		if (videoblind.style.opacity <= 0) clearInterval(fadein);
	}, 40);
	//get the unit from unit list by its name
	//update the video source
	fetchAndPlay();
	function fetchAndPlay() {
		var playVideo = false
		myLog('fetching ' + unit.videoturnaround)
		fetch(unit.videoturnaround)
			.then(response => response.blob())
			.then(blob => {
				if (unit.name == prevMouseoverUnit.name) {
					playVideo = true;
					video.src = URL.createObjectURL(blob);
					myLog(unit.name + ' ' + prevMouseoverUnit.name)
				}
			})
			.then(() => {
				if (playVideo) {
					video.play();
					// Video playback started ;)
					myLog('video playback started for ' + unit.name)
				}
			})
			.catch(() => {
				// Video playback failed ;(
				myLog('video playback failed')
			})
	}
	//update the colors in the bar charts based on the unit id
	/**
	function updateChart(chart, label) {
		chart.data.datasets[0].data = sortedUnitData[label];
		chart.data.datasets[0].backgroundColor = sortColors(unit, sortData, label);
		chart.update();
	}
	//update the charts
	for (var [key] of Object.entries(sortedUnitData)) {
		updateChart(statRankBarCharts[key], key);
	} */
	myLog(unit);
	updateStatsUnitBottomContainer(unit.name, unit.matter, unit.energy, unit.bandwidth, unit.building, unit.ability)
	updateStatRankChartColors(unit);
	updateTraitsContainer(unit);
}


//#endregion


var statsComparisonChartContainer = document.createElement('div');
statsComparisonChartContainer.classList.add('comparisonChartContainer');
statsComparisonChartContainer.innerHTML = '';

var resourcesComparisonChartContainer = document.createElement('div');
resourcesComparisonChartContainer.classList.add('comparisonChartContainer');
resourcesComparisonChartContainer.innerHTML = '';

var traitsComparisonChartContainer = document.createElement('div');
traitsComparisonChartContainer.classList.add('comparisonChartContainer');
traitsComparisonChartContainer.innerHTML = 'traitsComparisonChart';


//#region statsComparisonChart "starchart", associated minmax and scaling functions

//create an example star chart in chartjs
//const DATA_COUNT = 7;
//const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };
var starchartStatsUnit = ['health', 'damage', 'damagea', 'speed', 'range'];
var starchartMinMax = {
	health: [5350, 64100],
	damage: [485, 4600],
	damagea: [0, 2000],
	speed: [26, 95],
	range: [13, 142]
}
var starchartUnitData = [];
const data = {
	labels: starchartStatsUnit,
	datasets: [
		{
			data: [0, 0, 0, 0, 0],
			borderColor: 'rgb(192, 162, 81)',
			backgroundColor: 'rgba(180, 255, 180, 0.137)',
			borderWidth: '8'
		},
	]
};
const data2 = {
	labels: starchartStatsUnit,
	datasets: [
		{
			data: [0, 0, 0, 0, 0],
			borderColor: 'rgb(192, 162, 81)',
			backgroundColor: 'rgba(255, 180, 180, 0.137)',
			borderWidth: '8'
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
	canvases[id].classList.add('starchart');
	statsComparisonChartContainer.appendChild(canvases[id]);

	starcharts.push(new Chart(canvases[id], {
		type: 'radar',
		data: starchartUnitData[id],
		options: {
			elements: {
				line: {
					borderWidth: 3,
				},
				point: {
					radius: 0
				}
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
						maxTicksLimit: 10,
					},
					pointLabels: {
						display: false
					},
					grid: {
						circular: true,
						color: 'rgba(255, 255, 255, .1)'
					}
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
	myLog('deck ' + deckID + ' length:' + deckLength)
	myLog('SF: ' + sf);
	var _min = min * sf
	var _max = max * sf
	var value = (input - _min) / (_max - _min);
	myLog(input, min, max, value);
	if (value < 0) value = 0;
	return value;
}

var deck1StatTotals = [];
var deck2StatTotals = [0, 0, 0, 0, 0];
function scaleDeckTotals(d, deckID) {
	//deck count scale factor
	starchartStatsUnit.forEach(function (stat, index) {
		d[index] = doScaling(deckID, d[index], starchartMinMax[stat][0], starchartMinMax[stat][1]);
	});
}


function updateDeckStatTotals(d, deckID) {
	//for each label in statsUnit, add the total of values of the stats for each unit in the deck
	//console.log('totals array: ' + d)
	//console.log(d);
	myLog('deck ' + deckID)
	myLog(decks[deckID]);
	starchartStatsUnit.forEach(function (label) {
		var total = 0;
		decks[deckID].forEach(function (unit) {
			total += (parseFloat(unit[label]) || 0);
		});
		d.push(total);
	});
}

function updateStarchartData() {
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

//#endregion

//#region resourcesComparisonChartContainer

var resourceChart
function createResourceChart(id) {
	var canvas = document.createElement('canvas');
	canvas.id = 'resourceChart' + id;
	canvas.classList.add('resourceChart');
	resourcesComparisonChartContainer.appendChild(canvas);
	var c1 = 'rgba(180, 255, 180, 0.05)';
	var c2 = 'rgba(255, 180, 180, 0.05)';
	var resourceChart = new Chart(canvas, {
		type: 'bar',
		data: {
			labels: ['T1', 'T2', 'T3', 'T1', 'T2', 'T3'],
			datasets: [
				{
					label: 'Bandwidth',
					grouped: false,
					type: 'bar',
					data: [6, 22, 30],
					borderColor: 'rgba(255, 206, 86, 1)',
					backgroundColor: [c1, c1, c1, c2, c2, c2],
					borderWidth: 2,
					yAxisID: 'test2'
				},
				{
					label: 'Energy',
					type: 'bar',
					grouped: false,
					data: [100, 250, 200],
					borderColor: 'rgba(54, 162, 235, 1)',
					backgroundColor: [c1, c1, c1, c2, c2, c2],
					position: 'right',
					borderWidth: 2,
					yAxisID: 'test1'
				},
				{
					label: 'Matter',
					grouped: false,
					type: 'bar',
					data: [150, 350, 500],
					borderColor: 'rgba(255, 99, 132, 1)',
					backgroundColor: [c1, c1, c1, c2, c2, c2],
					borderWidth: 2,
					yAxisID: 'test1'
				},
			]
		},
		options: {
			scales: {
				test1: {
					display: false
				},
				test2: {
					display: false
				},
				x: {
					ticks: {
						color: 'rgba(255, 255, 255, .8)',
						font: {
							size: 14
						}
					}

				}
			},
			plugins: {
				legend: {
					labels: {
						color: 'rgba(255, 255, 255, .8)',
						font: {
							size: 14
						}
					}
				},
			},
		}
	});
	return resourceChart;
}
resourceChart = createResourceChart(0)
var matterValues = []
var energyValues = []
var bandwidthValues = []

//calculate tier values based off the total matter, energy and bandwidth for units in each tier
//add units in the deck with tier 1 and push their matter, energy and bandwidth values to the respective arrays
function calculateTierValues() {
	//for each unit in the deck, add its tier values to the respective arrays
	var t1Totals = [0, 0, 0, 0, 0, 0];
	var t2Totals = [0, 0, 0, 0, 0, 0];
	var t3Totals = [0, 0, 0, 0, 0, 0];
	function perDeck(deckID, t1, t2, t3) {
		for (var i = 0; i < decks[deckID].length; i++) {
			var unit = decks[deckID][i];
			var x = (3 * deckID);
			if (unit) {
				if (unit.tier == 1) {
					t1[0 + x] += unit.bandwidth;
					t1[1 + x] += unit.energy;
					t1[2 + x] += unit.matter;
				}
				else if (unit.tier == 2) {
					t2[0 + x] += unit.bandwidth;
					t2[1 + x] += unit.energy;
					t2[2 + x] += unit.matter;
				}
				else if (unit.tier == 3) {
					t3[0 + x] += unit.bandwidth;
					t3[1 + x] += unit.energy;
					t3[2 + x] += unit.matter;
				}
			}
		}
	}
	myLog(t1Totals, t2Totals, t3Totals)
	perDeck(0, t1Totals, t2Totals, t3Totals)
	perDeck(1, t1Totals, t2Totals, t3Totals)
	matterValues = [t1Totals[0], t2Totals[0], t3Totals[0], t1Totals[3], t2Totals[3], t3Totals[3]]
	energyValues = [t1Totals[1], t2Totals[1], t3Totals[1], t1Totals[4], t2Totals[4], t3Totals[4]];
	bandwidthValues = [t1Totals[2], t2Totals[2], t3Totals[2], t1Totals[5], t2Totals[5], t3Totals[5]];
}



function updateResourceCharts() {
	calculateTierValues()
	resourceChart.data.datasets[0].data = matterValues;
	resourceChart.data.datasets[1].data = energyValues;
	resourceChart.data.datasets[2].data = bandwidthValues;
	resourceChart.update();
}
updateResourceCharts();



//#endregion

//#region traitsComparisonChartContainer

function updateTraitsChart() {
	myLog('todo');
}

//#endregion

function updateComparisonCharts() //called when a unit is added/removed from the deck, calls the current comparion charts update function
{
	if (statsMode == 1) {
		if (compareMode == 0) updateStarchartData();
		else if (compareMode == 1) updateResourceCharts();
		else if (compareMode == 2) updateTraitsChart();

	}
}

function refreshStatViewContent() {
	while (stats_content.firstChild) {
		stats_content.removeChild(stats_content.firstChild);
	};
	if (statsMode == 0) {
		updateStatsUnit();
	}
	if (statsMode == 1) {
		if (compareMode == 0) {
			updateStarchartData();
			stats_content.appendChild(statsComparisonChartContainer);
		}
		else if (compareMode == 1) {
			updateResourceCharts();
			stats_content.appendChild(resourcesComparisonChartContainer);
		}
		else if (compareMode == 2) {
			stats_content.appendChild(traitsComparisonChartContainer);
		}
		//updateComparisonChart();
		//remove all children from stats_content

	}
}

refreshStatViewContent()
//#endregion

var oldE = null
function unitMouseOver(e) {
	//if we are
	if (e.target.id == oldE) return;
	oldE = e.target.id;
	var unit = units[e.target.id];
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


decksInit(repopulateFilteredUnitList, redrawUnitContent, unitMouseOverAndTapped, updateComparisonCharts, filteredUnitList, unitList, sortUnits, unit_header_sort, unit_filter_input, setFilter)