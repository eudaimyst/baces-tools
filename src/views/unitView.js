/* eslint-disable no-redeclare */
import { locale } from '../locale';
import { sort } from 'fast-sort';
import { addUnitToDeck, decks, currentDeck } from './deckView';
import { myLog, cleanText, makeDiv, makeDropDown, makeP, makeHeaderBtn, makeInput } from '../utils';
import { unitMouseOverAndTapped } from './statsView';
import { unitList } from '../units';

var unitMouseOver

const unitsInit = (UnitMouseOver) => {
	unitMouseOver = UnitMouseOver;
}

const unitView = makeDiv('view', 'unitView-h')
const unitViewHeader = makeDiv('viewHeader', 'unitHeader', unitView);
const unitContent = makeDiv('viewContent', 'unitContent', unitView)


//#region unit-header
//label
const sortLabel = makeDiv('headerElement', 'sortLabel', unitViewHeader)
sortLabel.innerHTML = locale('sort') + ': ';
//create a dropdown selector for sorting

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
const unitHeaderSort = makeDropDown('unitHeaderSort', 'headerElement', unitViewHeader, sortOptions)

filteredUnitList = sortUnits(unitHeaderSort.value, filteredUnitList);

//label
makeP('headerElement', 'viewLabel', unitViewHeader, locale('view') + ': ')

var unitViewMode = 0; //0 = table 1 = card
function setUnitViewMode(i) {
	unitViewMode = i;
}

//table view button
const unitViewTableBtn = makeHeaderBtn('table', 'unitViewTableBtn', function () {
	setUnitViewMode(0);
	unitViewTableBtn.classList.add('selected');
	unitViewCardBtn.classList.remove('selected');
	redrawUnitContent();
});

//card view button
const unitViewCardBtn = makeHeaderBtn('card', 'unitViewTableBtn', function () {
	setUnitViewMode(1);
	unitViewCardBtn.classList.add('selected');
	unitViewTableBtn.classList.remove('selected');
	redrawUnitContent();
});

unitViewHeader.appendChild(unitViewTableBtn);
unitViewHeader.appendChild(unitViewCardBtn);

//filter input box
const unitFilterInput = makeInput('headerElement', 'unitFilterInput', unitViewHeader, 'text', locale('filter'), function () {
	setFilter(unitFilterInput.value);
	redrawUnitContent();
})

//filter clear button that clears the filter
const unitFilterClearBtn = makeHeaderBtn('clear', 'unitFilterClearBtn', function () {
	//clear the filter
	unitFilterInput.value = '';
	//run the unitFilter input changed event
	unitFilterInput.dispatchEvent(new Event('input'));
});
unitViewHeader.appendChild(unitFilterClearBtn);

makeP('headerElement', 'simpleStatsLabel', unitViewHeader, locale('simple') + ': ')

//simple stats checkbox
var simpleStatsMode = true;
const unitSimpleStatsCheckbox = makeInput('headerElement', 'unitSimpleStatsCheckbox', unitViewHeader, 'checkbox', locale('filter'), null, function () {
	if (unitSimpleStatsCheckbox.checked) {
		simpleStatsMode = true;
	}
	else {
		simpleStatsMode = false;
	};
	redrawUnitContent();
})

unitSimpleStatsCheckbox.checked = true;
unitSimpleStatsCheckbox.title = 'Simple Health/Damage NOT to scale';

//hide unavailable units checkbox
var hideUnavailMode = true;
makeP('headerElement', 'hideUnavailLabel', unitViewHeader, locale('hideUnavail') + ': ')
//unitHideUnavailableUnitsCheckbox is a checkbox

const hideUnavailCheckbox = makeInput('headerElement', 'unitHideUnavailableUnitsCheckbox', unitViewHeader, 'checkbox', locale('filter'), null, function () {
	if (hideUnavailCheckbox.checked) {
		hideUnavailMode = true;
	} else {
		hideUnavailMode = false;
	}
	redrawUnitContent();
});
hideUnavailCheckbox.checked = true;
hideUnavailCheckbox.title = 'Hide unavailable units based on deck';
unitViewHeader.appendChild(hideUnavailCheckbox);

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
	filterString = cleanText(filterString);
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
			if (cleanText(unitList[i].name).includes(filterString) ||
				cleanText(unitList[i].building).includes(filterString) ||
				cleanText(unitList[i].type).includes(filterString) ||
				cleanText(unitList[i].traits).includes(filterString) ||
				cleanText(unitList[i].manufacturer).includes(filterString) ||
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
	var unitTable = document.createElement('table');
	unitTable.id = 'unitTable';
	unitTable.classList.add('unitTable');
	//add table head
	var unitTableHead = document.createElement('thead');
	unitTableHead.id = 'unitTableHead'
	unitTable.appendChild(unitTableHead);
	//add table body
	var unitTableBody = document.createElement('tbody');
	unitTable.appendChild(unitTableBody);
	//create table header and add it to the table head
	var unitTableAddHeader = document.createElement('th');
	unitTableAddHeader.classList.add('unitTableHeader');
	unitTableAddHeader.innerHTML = locale('add');
	unitTableHead.appendChild(unitTableAddHeader);


	//##tag unit-content-table-loop
	//table header using the 2nd object in the object list
	console.log(unitList);
	for (const [key] of Object.entries(unitList[0])) {
		if (!excludeKeys.includes(key)) {
			var unitTableHeader = document.createElement('th');
			unitTableHeader.classList.add('unitTableHeader');
			//add some images to certain headers
			if (key == 'health' || key == 'damage' || key == 'damagea' || key == 'speed' || key == 'simplespeed' || key == 'range') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + key + '.png';
				img.classList.add('unitTableHeaderImage');
				if (key == 'damagea') {
					img.setAttribute('alt', 'Air Damage');
					img.setAttribute('title', 'Air Damage');
				}
				else {
					img.setAttribute('alt', key);
					img.setAttribute('title', key);
				}
				unitTableHeader.appendChild(img);
			} else if (key == 'hp/100') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'health' + '.png';
				img.classList.add('unitTableHeaderImage');
				img.setAttribute('alt', 'Health/100');
				img.setAttribute('title', 'Health/100');
				unitTableHeader.appendChild(img);
				unitTableHeader.classList.add('unitTableSmalltext');
			} else if (key == 'simpledamage') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'damage' + '.png';
				img.classList.add('unitTableHeaderImage');
				img.setAttribute('alt', 'DPS/10');
				img.setAttribute('title', 'DPS/10');
				unitTableHeader.appendChild(img);
				unitTableHeader.classList.add('unitTableSmalltext');
			}
			else if (key == 'dps') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'damage' + '.png';
				img.classList.add('unitTableHeaderImage');
				img.setAttribute('alt', 'ground dps');

				img.setAttribute('title', 'ground dps');
				unitTableHeader.appendChild(img);
				unitTableHeader.innerHTML += '/s';
				unitTableHeader.classList.add('unitTableSmalltext');
			} else if (key == 'dpsa') {
				var img = document.createElement('img');
				img.src = 'images/stats/' + 'damagea' + '.png';
				img.classList.add('unitTableHeaderImage');
				img.setAttribute('alt', 'air dps');
				img.setAttribute('title', ' air dps');
				unitTableHeader.appendChild(img);
				unitTableHeader.innerHTML += '/s';
				unitTableHeader.classList.add('unitTableSmalltext');
			} else if (key == 'matter' || key == 'energy' || key == 'bandwidth') {
				var img = document.createElement('img');
				img.src = 'images/resources/' + key + '.svg';
				img.classList.add('unitTableHeaderImage');
				img.setAttribute('alt', key);
				img.setAttribute('title', key);
				unitTableHeader.appendChild(img);
			} else if (key == 'image') {
				key == 'tier';
				unitTableHeader.innerHTML = locale('image');
				//no header name for images
			} else if (key == 'ability') {
				unitTableHeader.innerHTML = locale('ability');
			} else if (key == 'manufacturer') {
				unitTableHeader.innerHTML = locale('shortManf');
			} else if (key == 'building') {
				unitTableHeader.innerHTML = locale('tech');
			} else {
				unitTableHeader.innerHTML = locale(key);
			}

			unitTableHead.appendChild(unitTableHeader);
		}
	}

	//this is the unit content table loop
	for (let i = 0; i < filteredUnitList.length; i++) {
		var unit = filteredUnitList[i];
		//create a table row element
		var unitTableRow = document.createElement('tr');
		unitTableRow.id = unit.name;
		unitTableRow.classList.add('unitTableRow');
		tableUnitRows[unit.name] = unitTableRow;

		//create a table cell element for each unit property
		//add the unit property to the table cell
		//for each key in the current unit

		//the first cell of each row, we will add a button to add the unit to the deck
		var unitTableCell = document.createElement('td');
		unitTableCell.id = unit.name;
		if (i % 2 == 0) {
			unitTableCell.classList.add('unitTableCellAlt');
		}
		//add the unit property to the table cell
		var div = document.createElement('div');
		//div.innerHTML = unit.name;
		unitTableCell.appendChild(div);
		unitTableCell.classList.add('unitTableCell');

		//#tag tableAddUnitButton
		//add the button
		var tableAddUnitButton = document.createElement('button');
		//add text to the button
		tableAddUnitButton.innerHTML = '+';
		tableAddUnitButton.classList.add('tableAddUnitButton')
		//add the button to the cell
		unitTableCell.classList.add('tableAddUnitButtonCell');
		unitTableCell.appendChild(tableAddUnitButton);

		tableAddUnitButton.onclick = function () {
			myLog(i + 'adding unit to deck: ' + filteredUnitList[i].name)
			addUnitToDeck(filteredUnitList[i], currentDeck);
		};
		tableAddUnitButton.onmouseover = function () {
			unitMouseOverAndTapped(filteredUnitList[i]);
		};
		//tableAddUnitButton.addEventListener('mouseover', unitMouseOver);

		//add the cell to the row
		unitTableRow.appendChild(unitTableCell);
		unitTableRow.addEventListener('mouseover', unitMouseOver);

		//console.log('drawing row for unit', unit);
		for (const [key, value] of Object.entries(unit)) {
			if (!excludeKeys.includes(key)) {
				var unitTableCell = document.createElement('td');
				unitTableCell.id = unit.slug;
				if (simpleStatsMode) {
					unitTableCell.classList.add('simpleStatsPadding');
				}

				unitTableCell.classList.add('unitTableCell');
				//if i is an alternate number
				if (i % 2 == 0) {
					unitTableCell.classList.add('unitTableCellAlt');
				}

				unitTableRow.appendChild(unitTableCell);

				var img = document.createElement('img');
				if (key == 'image') {
					img.src = 'images/units/' + value + '.png';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unitTableImage');
					unitTableCell.appendChild(img);
				} else if (key == 'building') {
					img.src = 'images/techtiers/' + value + '.svg';
					img.setAttribute('alt', value);
					img.setAttribute('title', value);
					img.classList.add('unitTableImageMedium');
					unitTableCell.appendChild(img);
				} else if (key == 'ability') {
					if (value != ' ') {
						img.src = 'images/abilities/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unitTableImageMedium');
						unitTableCell.appendChild(img);
					}
					if (unit['traits'] == null) {
						//console.log(unit['name']);
						if (unit['name'] == 'raider') {
							var unitTableCell = document.createElement('td');
							unitTableCell.id = unit.slug;
							if (i % 2 == 0) {
								unitTableCell.classList.add('unitTableCellAlt');
							}
							if (simpleStatsMode) {
								unitTableCell.classList.add('simpleStatsPadding');
							}
							unitTableCell.classList.add('unitTableCell');
							unitTableRow.appendChild(unitTableCell);
						}
					}
				} else if (key == 'manufacturer') {
					if (value != '') {
						img.src = 'images/manuf/' + value + '.png';
						img.setAttribute('alt', value);
						img.setAttribute('title', value);
						img.classList.add('unitTableImageSmall');
						unitTableCell.appendChild(img);
					}
				} else if (key == 'traits') {
					if (value) {
						value.forEach(trait => {
							if (trait != 'none') {
								var img = document.createElement('img');
								img.src = 'images/traits/' + trait + '.png';
								img.classList.add('unitTableImageSmall');
								img.setAttribute('alt', trait);
								img.setAttribute('title', trait);
								unitTableCell.appendChild(img);
							}
						});
					}
					unitTableCell.classList.add('unitTableCellTraits');
				} else {
					if (key == 'name') {
						unitTableCell.innerHTML = locale(value)
					} else if (key == 'type') {
						//if not simple stats
						if (!simpleStatsMode) {
							if (value == 'ground') unitTableCell.innerHTML = locale('shortGround');
							if (value == 'air') unitTableCell.innerHTML = locale('shortAir');
						}
						else unitTableCell.innerHTML = locale(value);
					}
					else {
						myLog(unit.name + ' key: ' + key + ' value: ' + value)
						unitTableCell.innerHTML = value || '0';
					}
				}

				if (key == 'health' || key == 'damage' || key == 'speed' || key == 'range') {
					unitTableCell.classList.add('unitTableCellStats');
				}
			}
		}
		//div.innerHTML = unit.name;
		//unitTableCell.add(div);

		//create a table body element
		unitTableBody.appendChild(unitTableRow);
	}

	//attach the unitTable to the unitContent div
	unitContent.appendChild(unitTable);
}

var unitCards = {};
function createUnitCard(unit) {
	//create a card div
	var unitCard = document.createElement('div');
	//add a class to the card div
	unitCard.classList.add('unitCard');
	//
	//when the unit is moused over, call the mouseover function to update the views
	unitCard.addEventListener('mouseover', () => {
		myLog(unit.name);
		unitMouseOverAndTapped(unit);
	});
	//when the unit is clicked, add the unit to the deck
	unitCard.addEventListener('click', () => {
		addUnitToDeck(unit, currentDeck);
	});

	//matter
	var unitCardMatter = document.createElement('div');
	unitCardMatter.classList.add('unitCardMatter');
	unitCardMatter.classList.add('unitCardText');
	unitCardMatter.innerHTML = unit.matter
	unitCard.appendChild(unitCardMatter);
	//bandwidth
	var unitCardBandwidth = document.createElement('div');
	unitCardBandwidth.classList.add('unitCardText');
	unitCardBandwidth.classList.add('unitCardBandwidth');
	unitCardBandwidth.innerHTML = unit.bandwidth
	unitCard.appendChild(unitCardBandwidth);
	//energy
	var unitCardEnergy = document.createElement('div');
	unitCardEnergy.classList.add('unitCardEnergy');
	unitCardEnergy.classList.add('unitCardText');
	unitCardEnergy.innerHTML = unit.energy;
	unitCard.appendChild(unitCardEnergy);

	var unitCardName = document.createElement('div');
	unitCardName.classList.add('unitCardName');
	unitCardName.classList.add('unitCardText');
	unitCardName.innerHTML = locale(unit.slug);
	unitCard.appendChild(unitCardName);
	//create a div for the unit image
	var unitCardImage = document.createElement('img');
	unitCardImage.src = 'images/units/' + unit.slug + '.png';
	unitCardImage.alt = unit.name;
	unitCardImage.title = unit.name;
	unitCardImage.classList.add('unitCardImage');
	unitCard.appendChild(unitCardImage);
	//create a div for the unit building
	var unitCardBuilding = document.createElement('img');
	unitCardBuilding.src = 'images/techtiers/' + unit.building + '.svg';
	unitCardBuilding.alt = unit.building;
	unitCardBuilding.title = unit.building;
	unitCardBuilding.classList.add('unitCardBuilding');
	unitCard.appendChild(unitCardBuilding);
	//create a div for the unit type
	var unitCardType = document.createElement('div');
	unitCardType.classList.add('unitCardType');
	unitCardType.classList.add('unitCardText');
	//create a div for the unit traits
	var unitCardTraits = document.createElement('div');
	unitCardTraits.classList.add('unitCardTraits');
	//for each trait in the unit traits array
	myLog(unit);
	if (unit.traits) {
		for (let i = 0; i < unit.traits.length; i++) {
			//create a div for the trait
			var unitCardTrait = document.createElement('img');
			unitCardTrait.src = 'images/traits/' + unit.traits[i] + '.png';
			unitCardTrait.alt = unit.traits[i];
			unitCardTrait.title = unit.traits[i];
			unitCardTrait.classList.add('unitCardTrait');
			unitCardTraits.appendChild(unitCardTrait);
		}
	}
	unitCard.appendChild(unitCardTraits);
	//create a div for the unit manufacturer
	var unitCardManufacturer = document.createElement('div');
	//if the manufacturer is not none
	if (unit.manufacturer != 'none') {
		unitCardManufacturer.style.backgroundImage = 'url("images/manuf/' + unit.manufacturer + '.png")	';
		unitCardManufacturer.classList.add('unitCardManufacturer');
		unitCard.appendChild(unitCardManufacturer);
	}

	unitCardType.innerHTML = locale(unit.type);
	unitCard.appendChild(unitCardType);



	//name

	unitCards[unit.name] = unitCard;
	return unitCard
}

function drawUnitCards() {
	//create a container div
	var unitCardContainer = document.createElement('div');
	//add a class to the container div
	unitCardContainer.id = 'unitCardContainer';
	//add the container div to the unitContent div

	//for each unit in the unit list create a card
	for (let i = 0; i < filteredUnitList.length; i++) {
		//add the card body div to the card div
		unitCardContainer.appendChild(createUnitCard(filteredUnitList[i]));
	}

	unitContent.appendChild(unitCardContainer);
}

//#endregion

//#region redrawUnitContent expensive function: draws unit content div, iterates unitList for display
function redrawUnitContent() {


	unitContent.innerHTML = '';
	//for each object in unitsJsonBase create a new unit passing the object
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
function setFilteredUnitList(value) {
	filteredUnitList = value
}

export {
	unitView,
	unitViewMode,
	tableUnitRows,
	unitCards,
	unitsInit,
	repopulateFilteredUnitList,
	redrawUnitContent,
	filteredUnitList,
	setFilteredUnitList,
	sortUnits,
	setFilter,
	unitHeaderSort,
	unitFilterInput
}