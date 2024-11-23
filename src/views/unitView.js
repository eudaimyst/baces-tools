/* eslint-disable no-redeclare */
import { locale } from '../locale';
import { sort } from 'fast-sort';
import { addUnitToDeck, decks, currentDeck } from './deckView';
import { myLog, removeSpacesCapitalsSpecialCharacters } from '../utils';
import { unitList } from '../units';



var unitMouseOverAndTapped
var unitMouseOver

const unitsInit = (_unitMouseOverAndTapped, _unitMouseOver) => {
	unitMouseOverAndTapped = _unitMouseOverAndTapped;
	unitMouseOver = _unitMouseOver;
}

const unitView = document.createElement('div');
unitView.id = 'unit_view-h';
unitView.classList.add('view');
const unitViewHeader = document.createElement('div');
unitViewHeader.classList.add('view_header');
unitView.appendChild(unitViewHeader);
const unitContent = document.createElement('div');
unitContent.classList.add('view_content');
unitContent.id = 'unit_content';
unitView.appendChild(unitContent);


//#region unit-header
//label
const sortLabel = document.createElement('div');
sortLabel.innerHTML = locale('sort') + ': ';
sortLabel.classList.add('headerElement');
unitViewHeader.appendChild(sortLabel);
//create a dropdown selector for sorting
const unitHeaderSort = document.createElement('select');
//add an option called test
function addOptionsToTable(displayName, statName) {
	unitHeaderSort.add(new Option(displayName, statName));
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
filteredUnitList = sortUnits(unitHeaderSort.value, filteredUnitList);

unitHeaderSort.id = 'unit_header_sort';
unitHeaderSort.classList.add('headerElement');
unitViewHeader.appendChild(unitHeaderSort);
//label
const view_label = document.createElement('p');
view_label.innerHTML = locale('view') + ': ';
view_label.classList.add('headerElement');
unitViewHeader.appendChild(view_label);

var unitViewMode = 0; //0 = table 1 = card

//table view button
const unit_view_table_btn = document.createElement('button');
unit_view_table_btn.innerHTML = locale('table');
unit_view_table_btn.id = 'unit_view_table_btn';
unit_view_table_btn.classList.add('headerElement');
unitViewHeader.appendChild(unit_view_table_btn);
//card view button
const unit_view_card_btn = document.createElement('button');
unit_view_card_btn.innerHTML = locale('card');
unit_view_card_btn.id = 'unit_view_card_btn';
unit_view_card_btn.classList.add('headerElement');
unitViewHeader.appendChild(unit_view_card_btn);

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
const unitFilterInput = document.createElement('input');
unitFilterInput.type = 'text';
unitFilterInput.id = 'unit_filter_input';
unitFilterInput.placeholder = locale('filter');
unitFilterInput.classList.add('headerElement');
//when user inputs text into filter input element
unitFilterInput.oninput = function () {
	setFilter(unitFilterInput.value);
	redrawUnitContent();
};

unitViewHeader.appendChild(unitFilterInput);

//filter clear button that clears the filter
const unit_filter_clear_btn = document.createElement('button');
unit_filter_clear_btn.innerHTML = locale('clear');
unit_filter_clear_btn.id = 'unit_filter_clear_btn';
unit_filter_clear_btn.classList.add('headerElement');
unitViewHeader.appendChild(unit_filter_clear_btn);
unit_filter_clear_btn.onclick = function () {
	//clear the filter
	unitFilterInput.value = '';
	//run the unit_filter input changed event
	unitFilterInput.dispatchEvent(new Event('input'));
}
const simple_stats_label = document.createElement('p');
simple_stats_label.innerHTML = locale('simple') + ': ';
simple_stats_label.classList.add('headerElement');
unitViewHeader.appendChild(simple_stats_label);
//unit_simple_stats_checkbox is a checkbox
const unit_simple_stats_checkbox = document.createElement('input');
unit_simple_stats_checkbox.type = 'checkbox';
unitViewHeader.appendChild(unit_simple_stats_checkbox);
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
unitViewHeader.appendChild(hide_unavail_label);
//unit_hide_unavailable_units_checkbox is a checkbox
const hide_unavail_checkbox = document.createElement('input');
hide_unavail_checkbox.type = 'checkbox';
hide_unavail_checkbox.title = 'Hide unavailable units based on deck';
unitViewHeader.appendChild(hide_unavail_checkbox);
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
	if (unitList) {
		filteredUnitList = [];
		for (var i = 0; i < unitList.length; i++) {
			filteredUnitList.push(unitList[i]);
		}
		setFilter(unitFilterInput.value);
		filteredUnitList = sortUnits(unitHeaderSort.value, filteredUnitList);
	}
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
	console.log(unitList);
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
	unitContent.appendChild(unit_table);
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

	unitContent.appendChild(unit_card_container);
}

//#endregion

//#region redrawUnitContent expensive function: draws unit content div, iterates unitList for display
function redrawUnitContent() {


	unitContent.innerHTML = '';
	//for each object in unitsJson_base create a new unit passing the object
	myLog('Redrawing Unit Content\n-----------------');
	myLog(filteredUnitList);

	//before drawing the unit table or cards, remove the selected units for the current deck from the filtered unit lists
	if (hideUnavailMode == true) {
		console.log(decks)
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

//redrawUnitContent(); //upon loading the page we redraw the UnitContentDiv once to initialise it

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
		if (value == 'range') {
			sorted = sort(list).desc((u) => Number(u[value]));
		}
		else sorted = sort(list).desc((u) => u[value]);
	}
	return sorted;
}


unitHeaderSort.onchange = function () {
	//sort the units by the new option
	//new function for sorting units
	myLog(unitHeaderSort.value);
	filteredUnitList = sortUnits(unitHeaderSort.value, filteredUnitList);

	redrawUnitContent();
};


//#endregion


export {
	unitView,
	unitViewMode,
	tableUnitRows,
	unitCards,
	unitsInit,
	repopulateFilteredUnitList,
	redrawUnitContent,
	filteredUnitList,
	sortUnits,
	setFilter,
	unitHeaderSort,
	unitFilterInput
}