/* eslint-disable no-redeclare */

import { myLog, createHeaderButton } from '../utils'
import { locale } from '../locale';
import { units } from '../units';
//import { sort } from 'fast-sort';


//#region deck format


var savedDecks = []

class SavedDeck {
	constructor(deckName, deckList) {
		this.deckName = deckName;
		this.deckList = deckList;
	}
}

function fillSlotsFromDeck(deck, deckID) {
	deck.deckList.forEach((unitSlug) => {
		myLog(unitSlug)
		myLog(units[unitSlug])
		var unit = units[unitSlug];
		addUnitToDeck(unit, deckID);
	});
}
var testDeckData = new SavedDeck('North Performance',
	['crab',
		'hunter',
		'butterfly',
		'airship',
		'kingcrab',
		'ballista',
		'bulwark',
		'heavyballista']);
myLog(testDeckData);

savedDecks.push(testDeckData);

function saveNewDeck(deckName, deck) {
	var deckList = []
	//add the name of each unit to the decklist
	deck.forEach((unit) => {
		deckList.push(unit.slug);
	});
	savedDecks.push(new SavedDeck(deckName, deckList));
}

//load savedDecks from localStorage
function loadSavedDecks() {
	var savedDecksJSON = localStorage.getItem('savedDecks');
	if (savedDecksJSON) {
		savedDecks = JSON.parse(savedDecksJSON);
	}
}
loadSavedDecks();
//if there are no saved decks, save the testDeckData
if (savedDecks.length == 0) {
	savedDecks.push(testDeckData)
	localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
}

//#endregion


var repopulateFilteredUnitList
var redrawUnitContent
var unitMouseOverAndTapped
var updateComparisonCharts
var filteredUnitList
var unitList
var sortUnits
var unit_header_sort
var unit_filter_input
var setFilter
//called by main to pass required functions
function decksInit(repop, redraw, unitHover, updateChart, _filteredUnitlist, unitlist, sortunits, uhs, ufi, setfilter) {
	repopulateFilteredUnitList = repop;
	redrawUnitContent = redraw;
	unitMouseOverAndTapped = unitHover
	updateComparisonCharts = updateChart
	filteredUnitList = _filteredUnitlist;
	unitList = unitlist;
	sortUnits = sortunits;
	unit_header_sort = uhs;
	unit_filter_input = ufi;
	setFilter = setfilter;

}

//#tag define-deck-contents
var decks = [[], []];
var deckNames = ['', ''];
var deckDivs = [[], []];
var slotBuildings = ['core', 'foundry', 'advancedfoundry', 'wildfoundry', 'core', 'starforge', 'advancedstarforge', 'wildstarforge'];
//decks slots contain the elements (divs) that are used to display the units in the deck

var currentDeck = 0; // 0 = Deck 1, 1 = Deck 2


const deckButtons = []

const deckContainers = []


function setCurrentDeck(num) {
	currentDeck = num;
	var altNum
	if (num == 0) altNum = 1;
	else altNum = 0;
	deckButtons[num].classList.add('selected');
	deckButtons[altNum].classList.remove('selected');
	deckContainers[num].classList.add('deckContainerActive');
	deckContainers[altNum].classList.remove('deckContainerActive');
	refreshNameInput();
	repopulateFilteredUnitList();
	redrawUnitContent();
}

const deck_view = document.createElement('div');
deck_view.id = 'deck_view-h';
deck_view.classList.add('view');
const deckViewHeader = document.createElement('div');
deckViewHeader.classList.add('view_header');
deck_view.appendChild(deckViewHeader);
const deck_content = document.createElement('div');
deck_content.classList.add('view_content');
deck_content.id = 'deck_content';
deck_view.appendChild(deck_content);

//make a constructor for header button


//#region deck-header section of the deck view
const deck1Btn = createHeaderButton('deck1', 'deck1_btn', function () {
	setCurrentDeck(0);
})
deckViewHeader.appendChild(deck1Btn);
deck1Btn.classList.add('selected');
const deck2Btn = createHeaderButton('deck2', 'deck2_btn', function () {
	setCurrentDeck(1);
})
deckViewHeader.appendChild(deck2Btn);
deckButtons.push(deck1Btn, deck2Btn);

//clear button to clear the current deck
const deckClearBtn = createHeaderButton('clear', 'deck_clear_btn', function () {
	removeAllUnitsFromDeck(currentDeck);
	refreshNameInput();
	repopulateFilteredUnitList();
	redrawUnitContent();
})
deckViewHeader.appendChild(deckClearBtn);

//fill deck button which tries to add units from the unit list in order until the deck is full
const deckFillBtn = createHeaderButton('fill', 'deck_fill_btn', function () {
	fillDeckWithUnits(currentDeck);
	refreshNameInput();
})
deckViewHeader.appendChild(deckFillBtn);

//Deck header elements: deck1 button, deck 2 button, deck name input box, save button, dropdown, load button, delete button
//deck name input box:
const nameInput = document.createElement('input');
nameInput.id = 'name_input';
nameInput.classList.add('headerElement');
nameInput.type = 'text';
nameInput.placeholder = locale('deckName');
deckViewHeader.appendChild(nameInput);
//when the name input box is changed, update the deck name
nameInput.addEventListener('change', function () {
	deckNames[currentDeck] = nameInput.value;
});
function refreshNameInput() {
	nameInput.value = deckNames[currentDeck];
}
refreshNameInput();
//save button:
const deckSaveBtn = createHeaderButton('save', 'deck_save_btn', function () {
	//save the current deck as a new deck
	if (nameInput.value == '') {
		alert('Deck must have a name to be saved');
		return;
	}
	if (savedDecks.find((deck) => deck.deckName == nameInput.value)) {
		alert('Deck name already exists');
		return;
	}
	if (decks[currentDeck].length != 8) {
		alert('Deck incomplete');
		return;
	}
	//save the current deck as a new deck (name, deck
	saveNewDeck(nameInput.value, decks[currentDeck]);
	refreshDropdown();
	//clear the name input box
	//store the decks in local storage
	localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
})
deckViewHeader.appendChild(deckSaveBtn);

//decklist dropdown:
const decklistDropdown = document.createElement('select');
decklistDropdown.id = 'decklistDropdown';
decklistDropdown.classList.add('headerElement');
deckViewHeader.appendChild(decklistDropdown);

var selectedDeck = 0;
//for each deck in the deckLists array, add an option to select that deck in the dropdown, using the decks name
const refreshDropdown = () => {
	decklistDropdown.innerHTML = '';
	savedDecks.forEach((deck) => {
		var option = document.createElement('option');
		option.value = deck.deckName;
		option.innerHTML = deck.deckName;
		decklistDropdown.appendChild(option);
		//when the option is selected, set the selected deck to the index of the selected option
		decklistDropdown.addEventListener('change', function () {
			selectedDeck = decklistDropdown.selectedIndex;
		});
	});
}
refreshDropdown();

//load button:
const deckLoadBtn = createHeaderButton('load', 'deck_load_btn', function () {
	//load the selected deck into the current deck
	//clear the current deck
	myLog(savedDecks[selectedDeck]);
	deckNames[currentDeck] = savedDecks[selectedDeck].deckName;
	decks[currentDeck] = [];
	fillSlotsFromDeck(savedDecks[selectedDeck], currentDeck)
	refreshNameInput();
})
deckViewHeader.appendChild(deckLoadBtn);


//delete button:
const deckDeleteBtn = createHeaderButton('delete', 'deck_delete_btn', function () {
	savedDecks.splice(selectedDeck, 1);
	localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
	refreshDropdown();
});
deckViewHeader.appendChild(deckDeleteBtn);

//#endregion

//#region deck-content section of the deck view, includes: addUnitToDeck

//#tag deck-container 
//create a function that uses the code below to allow for calling a function to create new deck containers
const createNewDeckContainer = (className) => {
	var deckContainer = document.createElement('div');
	deckContainer.classList.add(className);
	deckContainer.classList.add('deckContainer');
	deck_content.appendChild(deckContainer);
	return deckContainer;
}

const selectDeck = (deckId) => {
	refreshNameInput();
	currentDeck = deckId
	deckButtons[deckId].classList.add('selected');
	deckButtons[1 - deckId].classList.remove('selected');
	deckContainers[deckId].classList.add('deckContainerActive');
	deckContainers[1 - deckId].classList.remove('deckContainerActive');
}

var deck1Container = createNewDeckContainer('deck1Container');
deckContainers.push(deck1Container);
//when deck container is clicked, set it as the current deck
deck1Container.click = function () {
	selectDeck(0);
};

var deck2Container = createNewDeckContainer('deck2Container');
deckContainers.push(deck2Container);
//when deck container is clicked, set it as the current deck
deck2Container.click = function () {
	selectDeck(1);
};

selectDeck(0); //sets the initial selected deck


//#tag slot-container

function mouseOverUnit(deck, slotNumber) {
	if (deck[slotNumber]) {
		myLog(slotNumber + ' mouseOver - ' + deck[slotNumber].name);
		//trigger the mouseover event
		//get the unit from the unitlist by the unit name
		var unit = unitList.find(unit => unit.name === deck[slotNumber].name);
		unitMouseOverAndTapped(unit);
	}
}
function removeUnitFromDeck(slotNumber, deckID, updateCharts) {
	var deck = decks[deckID];
	myLog('slotnumber: ' + slotNumber);

	//Amazon Q: if unit is not in filteredUnitList, add it back to filteredUnitList
	//if the unit is in the filteredUnitList, remove it from the filteredUnitList
	filteredUnitList.push(deck[slotNumber])
	//sort list by unit_header_sort.value
	filteredUnitList = sortUnits(unit_header_sort.value, filteredUnitList);



	if (deck[slotNumber]) {
		myLog(slotNumber + ' clicked - removed ' + deck[slotNumber].name + ' from deck # ' + deckID);
		delete deck[slotNumber];
		deckDivs[deckID][slotNumber].classList.remove('unit_deck1_slot_div_filled');
		deckDivs[deckID][slotNumber].classList.remove('unit_deck2_slot_div_filled');
		if (updateCharts) updateComparisonCharts();
	}
	redrawUnitContent();
}
function removeAllUnitsFromDeck(deckID) {
	for (var i = 0; i < 8; i++) {
		removeUnitFromDeck(i, deckID, false);
	}
	updateComparisonCharts(); deckNames[currentDeck] = '';

	redrawDeckContent(deckID);
	redrawUnitContent();
}
//
function fillDeckWithUnits(deckID) {
	//for each unit in the sorted unit list
	//if the unit is not in the deck, add it to the deck
	//check if unit is in the deck

	filteredUnitList.forEach(unit => {
		if (unit.name != 'kraken') addUnitToDeck(unit, deckID);
	});

	redrawDeckContent(deckID);
	updateComparisonCharts();
}

//#tag deckSlots divs for units
function createDeckSlots(container, deckID) {
	var deckSlotContainer = document.createElement('div');
	deckSlotContainer.id = 'deckSlotContainer' + deckID;
	deckSlotContainer.classList.add('deckSlotContainer');
	container.appendChild(deckSlotContainer);
	//create 8 square divs
	for (var i = 0; i < 8; i++) {
		var div = document.createElement('div');
		deckDivs[deckID][i] = div
		div.classList.add('unitDeckSlotDiv');
		div.id = 'unitDeckSlotDiv' + i;

		var img = document.createElement('img');
		img.id = 'deckSlotImage' + i;
		img.src = 'images/techtiers/' + slotBuildings[i] + '.png';
		img.setAttribute('alt', 'deck slot' + i);
		img.setAttribute('title', 'deck slot' + i);
		img.classList.add('deckSlotImage');
		div.appendChild(img);
		myLog("hello console" + i);
		myLog(div.firstElementChild);

		//when div is mouseover, make it turn black, then return after mouseover
		div.addEventListener('mouseover', function () {
			//this.style.backgroundColor = 'black';
			//set the background color to black, and fade it to transparent after 1s using css
			this.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
			this.style.cursor = 'pointer';

			var slotNumber = this.id.slice(-1);
			//get the deck ID of the current element
			var deckID = this.parentElement.id.slice(-1);
			var deck = decks[deckID];
			setCurrentDeck(deckID)
			mouseOverUnit(deck, slotNumber)
		});

		//if the mouse is clicked
		div.addEventListener('click', function () {
			this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
			this.style.transition = 'background-color 0.5s';
			var slotNumber = this.id.slice(-1);
			var deck = decks[deckID];
			// remove the unit from the deck array
			if (deck[slotNumber]) {
				removeUnitFromDeck(slotNumber, deckID, true);
			}
			else {
				myLog(slotBuildings[slotNumber] + ' clicked, setting filter');
				//setFilter(slotBuildings[i]);
				//set the filter input box to the name of the building
				unit_filter_input.value = slotBuildings[slotNumber];
				setFilter(unit_filter_input.value)
				redrawUnitContent();
				//run the unit_filter input changed event
			}
			redrawDeckContent(deckID);
		});
		//event for mouse leaving
		div.addEventListener('mouseleave', function () {
			this.style.backgroundColor = 'rgba(0, 0, 0, 0)';
			this.style.transition = 'background-color 0.5s';
		});

		deckSlotContainer.appendChild(div);
	}

}
createDeckSlots(deck1Container, 0);
createDeckSlots(deck2Container, 1);

//#tag stats-container 

function createDeckStats(container) {

	//create a text input box
	var deck_stats_div = document.createElement('div');
	deck_stats_div.classList.add('deck_stats_div');
	//create a table with 2 columns and 4 rows
	var stat_categories = ['matter', 'energy', 'bandwidth', 'health', 'speed', 'range', 'damage', 'ability', 'traits', 'manufacturer']
	var stat_category_divs = {} //stores the cells for each stat category to be updated

	stat_categories.forEach(cat => {
		const statDiv = document.createElement('div')
		statDiv.classList.add('statDiv');
		stat_category_divs[cat] = valueDiv;

		if (cat == 'traits' || cat == 'ability') {
			statDiv.innerText = locale(cat) + ': ';
			statDiv.classList.add('complexStatDiv');
		}
		else if (cat == 'manufacturer') {
			statDiv.innerText = locale('shortManf') + ': ';
			statDiv.classList.add('complexStatDiv');
		}
		else {
			var img = document.createElement('img');
			if (cat == 'energy' || cat == 'matter' || cat == 'bandwidth') {
				img.src = 'images/resources/' + cat + '.svg';
				statDiv.classList.add('resourceStatDiv');
				img.classList.add('resourceStatImg');
			}
			else {
				img.src = 'images/stats/' + cat + '.png';
				img.classList.add('deck_stats_img');
				statDiv.classList.add('unitStatDiv');
			}

			statDiv.appendChild(img);
		}
		var valueDiv = document.createElement('div');
		stat_category_divs[cat] = valueDiv;
		valueDiv.innerText = '';
		statDiv.appendChild(valueDiv);
		deck_stats_div.appendChild(statDiv);
	});


	var deckEmojiText = document.createElement('div');

	//on unit_deck_input update
	deckEmojiText.onchange = function () {
		myLog('unit_deck_input');
		redrawDeckContent();
	};

	//stat_category_cells.range.innerHTML = 'test';
	container.appendChild(deck_stats_div);

	return stat_category_divs;
}

var stat_category_cells = []
var stat_category_cells1 = createDeckStats(deck1Container);
var stat_category_cells2 = createDeckStats(deck2Container);
stat_category_cells.push(stat_category_cells1)
stat_category_cells.push(stat_category_cells2)

myLog("STAT CATEGORY CELLS");
myLog(stat_category_cells);

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
			myLog(deck[i]);
			for (var key in stats) {
				if (deck[i][key] != undefined) {
					if (key == 'ability' || key == 'type' || key == 'traits' || key == 'manufacturer') {
						stats[key].push(deck[i][key]);
					}
					else stats[key] += Number(deck[i][key]);
				}
			}
		}
	}
	//stat_category_cells.range.innerHTML = 'test'
	//for each stat set stat_category_cells['statname'].innerHTML to the correct stat
	//myLog(stats);
	for (var key in stats) {
		if (stat_category_cells[deckID][key] != undefined) {
			stat_category_cells[deckID][key].innerHTML = '';
			if (key == 'ability') {
				for (var i = 0; i < stats[key].length; i++) {
					if (stats[key][i] != undefined && (stats[key][i] != ' ')) {
						var img = document.createElement('img');
						img.src = 'images/abilities/' + stats[key][i] + '.png';
						img.setAttribute('alt', stats[key][i]);
						img.setAttribute('title', stats[key][i]);
						img.classList.add('deck_stats_img_ability');
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
							myLog(stats[key][i]);
							for (var j = 0; j < stats[key][i].length; j++) {
								img = document.createElement('img');
								img.src = 'images/traits/' + stats[key][i][j] + '.png';
								img.setAttribute('alt', stats[key][i][j]);
								img.setAttribute('title', stats[key][i][j]);
								img.classList.add('deck_stats_img_traits');
								stat_category_cells[deckID][key].appendChild(img);
							}
						}
						else {
							if (stats[key][i] != 'none') {
								img.src = 'images/traits/' + stats[key][i] + '.png';
								img.setAttribute('alt', stats[key][i]);
								img.setAttribute('title', stats[key][i]);
								img.classList.add('deck_stats_img_traits');
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
						img.src = 'images/manuf/uniforms/' + stats[key][i] + '.png';
						img.setAttribute('alt', stats[key][i]);
						img.setAttribute('title', stats[key][i]);
						img.classList.add('deck_stats_img_manf');
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
			else stat_category_cells[deckID][key].innerHTML = Math.round(stats[key]);
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
	deckDivs[deckID].forEach((slot, i) => {
		slot.firstElementChild.src = 'images/techtiers/' + slotBuildings[i] + '.png';
	});
	deck.forEach((unit, i) => {
		//deckEmojiText.innerHTML += unit.emoji + ' ';
		//slot.innerHTML = deck[index].name;
		deckDivs[deckID][i].firstElementChild.src = 'images/units/' + unit.slug + '.png';
	});

}

function addUnitToDeck(unit, deckID) {
	var deck = decks[deckID];
	myLog('Adding unit to deck ' + deckID + ': ' + unit.name);
	//myLog(unit);about:blank#blocked
	//add the unit name to the unit_deck_input text box
	//unit_deck_input.value += unit.name + '\n';
	//addToDeck(unitList[i]);
	var decklen = 0
	var exists = false
	//for each value in deck add +1 to decklen
	deck.forEach((u) => {
		myLog(u.name);
		if (u != undefined) {
			decklen++;
		}
		if (u.name == unit.name) {
			myLog('unit not added, already in deck');
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

					deckDivs[deckID][i].classList.add(deckClass);
					break;
				}
				else if (slotBuildings[i] == 'wildfoundry' && (unit.building == 'foundry' || unit.building == 'advancedfoundry')) {
					deck[i] = unit;
					deckDivs[deckID][i].classList.add(deckClass);
					break;
				}
				else if (slotBuildings[i] == 'wildstarforge' && (unit.building == 'starforge' || unit.building == 'advancedstarforge')) {
					deck[i] = unit;
					deckDivs[deckID][i].classList.add(deckClass);
					break;
				}
			}
		}

		//deck.push(unit);
	}
	else myLog('deck limit reached');
	myLog(decklen + '/8');
	redrawDeckContent(deckID);
	updateComparisonCharts();
	redrawUnitContent();
}

//#endregion


decksInit(repopulateFilteredUnitList,
	redrawUnitContent,
	unitMouseOverAndTapped,
	updateComparisonCharts,
	filteredUnitList,
	unitList,
	sortUnits,
	unit_header_sort,
	unit_filter_input,
	setFilter
)

export { deck_view, addUnitToDeck, currentDeck, decks, decksInit };