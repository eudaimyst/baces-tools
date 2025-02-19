/* eslint-disable no-redeclare */

import { myLog, makeBtn, makeHeaderBtn } from '../utils'
import { locale } from '../locale';
import { units, unitList } from '../units';
import { filteredUnitList, setFilteredUnitList, sortUnits, unitHeaderSort, redrawUnitContent, setFilter, unitFilterInput, repopulateFilteredUnitList } from './unitView';
import { updateComparisonCharts, unitMouseOverAndTapped } from './statsView'

//import { sort } from 'fast-sort';
import leaderboardData from '../leaderboard.json';

//#region deck format

var savedDecks = []
var filteredDecks = []
var leaderboardDecks = []

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
	//clear the localStorage savedDecks for testing
	//localStorage.removeItem('savedDecks');
	var savedDecksJSON = localStorage.getItem('savedDecks');
	if (savedDecksJSON) {
		savedDecks = JSON.parse(savedDecksJSON);
	}
}
loadSavedDecks();

function convertUnitIdToSlug(unitID) { //given a unit id, get the corresponding unit slug from the unit.json file
	//search through the unit.json list and return the unit.slug of the unti with the correct unit.id
	//for each unit in the unit.json file
	//console.log('converting id ' + unitID)
	//console.log(units)
	//for each unit in the units object
	for (var unit in units) {
		//if the unit.id is equal to the unitID
		//console.log('no match', unit, units[unit]['leaderboardid'], unitID)
		if (Number(units[unit]['leaderboardid']) == Number(unitID)) {
			//return the unit.slug
			//console.log('match found!', unit, units[unit]['leaderboardid'], unitID)
			return units[unit].slug;
		}
	}

}

function loadLeaderboardDecks() {
	//load the decks from the leaderboard.json file:
	//example leaderboard json entry:
	/**   "leaderboardData1": [
	{
		"player": "GOStephano",
		"ranking": "10045",
		"units": "2, 35, 41, 13, 32, 29, 58, 51"
	},
	{
		"player": "trigger",
		"ranking": "10004",
		"units": "75, 35, 58, 73, 32, 30, 9, 51"
	},
	{
		"player": "͡° ͜ʖ°͡",
		"ranking": "9878",
		"units": "34, 40, 17, 11, 77, 29, 41, 61"
	},
	]*/
	//parse the json file leaderboard.json

	//for each entry in the leaderboardData array
	const leader1 = leaderboardData['leaderboardData1'];
	const leader2 = leaderboardData['leaderboardData2'];
	//create a new SavedDeck object
	//for each deck in leader1
	//console.log('leaderboard1')
	for (var i = 0; i < leader1.length; i++) { //change 3 to leader1.length
		//console.log('importing leader deck ' + leader1[i].player);
		//for each unit in leaderboardData[i].units
		const units = [];
		//split leader1[i].units by commas and remove spaces
		const unitIds = leader1[i].units.split(', ');
		//console.log(unitIds)

		for (var j = 0; j < unitIds.length; j++) {
			//convert the unit id to a slug
			units[j] = convertUnitIdToSlug(unitIds[j]);
		}
		leaderboardDecks.push(new SavedDeck(leader1[i].player + ' 1v1 ' + leader1[i].ranking, units));
		//add the new deck to the savedDecks array
	}
	for (var i = 0; i < leader2.length; i++) { //change 3 to leader1.length
		//console.log('importing leader deck ' + leader2[i].player);
		//for each unit in leaderboardData[i].units
		const units = [];
		//split leader1[i].units by commas and remove spaces
		const unitIds = leader2[i].units.split(', ');
		//console.log(unitIds)

		for (var j = 0; j < unitIds.length; j++) {
			//convert the unit id to a slug
			units[j] = convertUnitIdToSlug(unitIds[j]);
		}
		//add the new deck to the savedDecks array
		leaderboardDecks.push(new SavedDeck(leader2[i].player + ' 2v2 ' + leader2[i].ranking, units));
	}

}
loadLeaderboardDecks();
//if there are no saved decks, save the testDeckData
if (savedDecks.length == 0) {
	savedDecks.push(testDeckData)
	localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
}

//#endregion


//#tag define-deck-contents
var decks = [[], []];
var deckNames = ['', ''];
var deckDivs = [[], []];
var slotBuildings = ['core', 'foundry', 'advancedfoundry', 'wildfoundry', 'core', 'starforge', 'advancedstarforge', 'wildstarforge'];
//decks slots contain the elements (divs) that are used to display the units in the deck

var currentDeck = 0; // 0 = Deck 1, 1 = Deck 2
const deckButtons = [] //button elements for deck 1 and deck 2
const deckContainers = [] //container div elements for each deck


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

const deckView = document.createElement('div');
deckView.id = 'deckView-h';
deckView.classList.add('view');
const deckViewHeader = document.createElement('div');
deckViewHeader.classList.add('viewHeader');
deckView.appendChild(deckViewHeader);
const deckContent = document.createElement('div');
deckContent.classList.add('viewContent');
deckContent.id = 'deckContent';
deckView.appendChild(deckContent);

//make a constructor for header button


//#region deck-header section of the deck view
const deck1Btn = makeHeaderBtn('deck1', 'deck1Btn', function () {
	setCurrentDeck(0);
})
deckViewHeader.appendChild(deck1Btn);
deck1Btn.classList.add('selected');
const deck2Btn = makeHeaderBtn('deck2', 'deck2Btn', function () {
	setCurrentDeck(1);
})
deckViewHeader.appendChild(deck2Btn);
deckButtons.push(deck1Btn, deck2Btn);

//fill deck button which tries to add units from the unit list in order until the deck is full
const deckFillBtn = makeHeaderBtn('fill', 'deckFillBtn', function () {
	fillDeckWithUnits(currentDeck);
	refreshNameInput();
})
deckViewHeader.appendChild(deckFillBtn);

//Deck header elements: deck1 button, deck 2 button, deck name input box, save button, dropdown, load button, delete button

/**
//save button:
 */

//decklist dropdown:
const decklistDropdown = document.createElement('select');
decklistDropdown.id = 'decklistDropdown';
decklistDropdown.classList.add('headerElement');

function deckInit() {
	//deckViewHeader.appendChild(decklistDropdown);
	//add decklistDropdown as a child of deckViewHeader at the first element
	deckViewHeader.insertBefore(deckSearchInputElement, deckViewHeader.firstChild);
	deckViewHeader.insertBefore(decklistDropdown, deckViewHeader.firstChild);

}

var selectedDeckToLoad = 0;
//for each deck in the deckLists array, add an option to select that deck in the dropdown, using the decks name
function refreshDropdown() {
	//remove all options from the decklist dropdown
	decklistDropdown.innerHTML = '';

	if (filteredDecks.length > 0) {
		filteredDecks.forEach((deck) => {
			var option = document.createElement('option');
			option.value = deck.deckName;
			option.innerHTML = deck.deckName;
			decklistDropdown.appendChild(option);
			//when the option is selected, set the selected deck to the index of the selected option
			decklistDropdown.addEventListener('change', function () {
				selectedDeckToLoad = decklistDropdown.selectedIndex;
			});
		});
		selectedDeckToLoad = 0;
	}
	else {
		savedDecks.forEach((deck) => {
			var option = document.createElement('option');
			option.value = deck.deckName;
			option.innerHTML = deck.deckName;
			decklistDropdown.appendChild(option);
			//when the option is selected, set the selected deck to the index of the selected option
			decklistDropdown.addEventListener('change', function () {
				selectedDeckToLoad = decklistDropdown.selectedIndex;
			});
		});
		leaderboardDecks.forEach((deck) => {
			var option = document.createElement('option');
			option.value = deck.deckName;
			option.innerHTML = deck.deckName;
			decklistDropdown.appendChild(option);
			//when the option is selected, set the selected deck to the index of the selected option
			decklistDropdown.addEventListener('change', function () {
				selectedDeckToLoad = decklistDropdown.selectedIndex;
			});
		});
	}
}
refreshDropdown();

//when an option is selected in the decklist dropdown, load the selected deck

decklistDropdown.addEventListener('change', function () {
	loadDeck();
});


function deckSearchInput() {
	//deck name input box:
	const searchInput = document.createElement('input');
	searchInput.id = 'deckSearchInput';
	searchInput.classList.add('headerElement');
	searchInput.type = 'text';
	searchInput.placeholder = locale('search');
	//when the search input box is updated, filter the available unit decks by the search term
	searchInput.oninput = function () {
		//combine savedDecks and leaderboardDecks into one array
		//console.log(searchInput.value)
		filteredDecks = []
		const combDecks = savedDecks.concat(leaderboardDecks);
		filteredDecks = combDecks.filter((deck) => {
			return deck.deckName.toLowerCase().includes(searchInput.value.toLowerCase());
		});
		//console.log(filteredDecks)
		refreshDropdown();
	};

	return searchInput
}
const deckSearchInputElement = deckSearchInput()
//console.log('deck search', deckSearchInputElement)
deckViewHeader.appendChild(deckSearchInputElement);

function loadDeck() {
	//load the selected deck into the current deck'
	var deckToLoad;
	if (filteredDecks.length > 0) {
		deckToLoad = filteredDecks[selectedDeckToLoad];
	}
	else {
		if (savedDecks[selectedDeckToLoad]) deckToLoad = savedDecks[selectedDeckToLoad];
		//the selectedDeckToLoad is the index of the option in the dropdown, and leaderboard is listed after saved decks so minus that index by how many saved decks there are
		else if (leaderboardDecks[selectedDeckToLoad - savedDecks.length]) deckToLoad = leaderboardDecks[selectedDeckToLoad - savedDecks.length];
	}
	//myLog(savedDecks[selectedDeck]);
	deckNames[currentDeck] = deckToLoad.deckName;
	decks[currentDeck] = [];
	fillSlotsFromDeck(deckToLoad, currentDeck)
	refreshNameInput(currentDeck);
	console.log(decks[currentDeck]);
}

//load button:
const deckLoadBtn = makeHeaderBtn('load', 'deckLoadBtn', loadDeck)
deckViewHeader.appendChild(deckLoadBtn);

//delete button:
const deckDeleteBtn = makeHeaderBtn('delete', 'deckDeleteBtn', function () {
	savedDecks.splice(selectedDeckToLoad, 1);
	localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
	refreshDropdown();
});
deckViewHeader.appendChild(deckDeleteBtn);

//#endregion

//#region deck-content section of the deck view, includes: addUnitToDeck

//#tag deck-container 
//create a function that uses the code below to allow for calling a function to create new deck containers
const createNewDeckContainer = (className, deckId) => {
	var deckContainer = document.createElement('div');
	deckContainer.classList.add(className);
	deckContainer.classList.add('deckContainer');
	deckContainer.onclick = function () {
		selectDeck(deckId);
	};
	deckContent.appendChild(deckContainer);
	return deckContainer;
}

const selectDeck = (deckId) => {
	refreshNameInput(currentDeck);
	currentDeck = deckId
	deckButtons[deckId].classList.add('selected');
	deckButtons[1 - deckId].classList.remove('selected');
	deckContainers[deckId].classList.add('deckContainerActive');
	deckContainers[1 - deckId].classList.remove('deckContainerActive');
}

var deck1Container = createNewDeckContainer('deck1Container', 0);
deckContainers.push(deck1Container);
const deck1ContNameDiv = document.createElement('div');
deck1ContNameDiv.classList.add('deckNameDiv');
deck1Container.appendChild(deck1ContNameDiv);
var deck2Container = createNewDeckContainer('deck2Container', 1);
deckContainers.push(deck2Container);
const deck2ContNameDiv = document.createElement('div');
deck2ContNameDiv.classList.add('deckNameDiv');
deck2Container.appendChild(deck2ContNameDiv);

const nameInputs = []
const createNameInput = (deckId) => {
	//deck name input box:
	const nameInput = document.createElement('input');
	nameInput.id = 'nameInput' + deckId;
	nameInput.classList.add('deckNameInput');
	nameInput.type = 'text';
	nameInput.placeholder = locale('deckName');
	//when the name input box is changed, update the deck name
	nameInput.change = function () {
		deckNames[deckId] = nameInput.value;
	};

	return nameInput
}

selectDeck(0); //sets the initial selected deck

nameInputs[0] = (createNameInput(0))
deck1ContNameDiv.appendChild(nameInputs[0]);
nameInputs[1] = (createNameInput(1))
deck2ContNameDiv.appendChild(nameInputs[1]);

function refreshNameInput(deckId) {
	if (nameInputs[deckId]) nameInputs[deckId].value = deckNames[deckId];
}
refreshNameInput(0);

const createDeckSaveBtn = (deckId) => {
	const deckSaveBtn = makeBtn('save', 'deckSaveClearBtn', function () {
		//save the current deck as a new deck
		if (nameInputs[deckId].value == '') {
			alert('Deck must have a name to be saved');
			return;
		}
		if (savedDecks.find((deck) => deck.deckName == nameInputs[deckId].value)) {
			alert('Deck name already exists');
			return;
		}
		if (decks[currentDeck].length != 8) {
			alert('Deck incomplete');
			return;
		}
		//save the current deck as a new deck (name, deck
		saveNewDeck(nameInputs[deckId].value, decks[deckId]); //this saves the deck to the array
		refreshDropdown();
		//clear the name input box
		//store the decks in local storage
		localStorage.setItem('savedDecks', JSON.stringify(savedDecks));//this saves the deck to local storage
	});
	return deckSaveBtn;
}

deck1ContNameDiv.appendChild(createDeckSaveBtn(0));
deck2ContNameDiv.appendChild(createDeckSaveBtn(1));

const createDeckClearBtn = (deckId) => {
	const deckClearBtn = makeBtn('clear', 'deckSaveClearBtn', function () {
		removeAllUnitsFromDeck(deckId);
		refreshNameInput(deckId);
		repopulateFilteredUnitList();
		redrawUnitContent();
	});
	return deckClearBtn;
}
deck1ContNameDiv.appendChild(createDeckClearBtn(0));
deck2ContNameDiv.appendChild(createDeckClearBtn(1));

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
	//sort list by unitHeaderSort.value
	setFilteredUnitList(sortUnits(unitHeaderSort.value, filteredUnitList));



	if (deck[slotNumber]) {
		myLog(slotNumber + ' clicked - removed ' + deck[slotNumber].name + ' from deck # ' + deckID);
		delete deck[slotNumber];
		deckDivs[deckID][slotNumber].classList.remove('unitDeck1SlotDivFilled');
		deckDivs[deckID][slotNumber].classList.remove('unitDeck2SlotDivFilled');
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
				unitFilterInput.value = slotBuildings[slotNumber];
				setFilter(unitFilterInput.value)
				redrawUnitContent();
				//run the unitFilter input changed event
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
	var deckStatsDiv = document.createElement('div');
	deckStatsDiv.classList.add('deckStatsDiv');
	//create a table with 2 columns and 4 rows
	var statCategories = ['matter', 'energy', 'bandwidth', 'health', 'speed', 'range', 'damage', 'ability', 'traits', 'manufacturer']
	var statCategoryDivs = {} //stores the cells for each stat category to be updated

	statCategories.forEach(cat => {
		const statDiv = document.createElement('div')
		statDiv.classList.add('statDiv');
		statCategoryDivs[cat] = valueDiv;

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
				img.classList.add('deckStatsImg');
				statDiv.classList.add('unitStatDiv');
			}

			statDiv.appendChild(img);
		}
		var valueDiv = document.createElement('div');
		statCategoryDivs[cat] = valueDiv;
		valueDiv.innerText = '';
		statDiv.appendChild(valueDiv);
		deckStatsDiv.appendChild(statDiv);
	});


	var deckEmojiText = document.createElement('div');

	//on unitDeckInput update
	deckEmojiText.onchange = function () {
		myLog('unitDeckInput');
		redrawDeckContent();
	};

	//statCategoryCells.range.innerHTML = 'test';
	container.appendChild(deckStatsDiv);

	return statCategoryDivs;
}

var statCategoryCells = []
var statCategoryCells1 = createDeckStats(deck1Container);
var statCategoryCells2 = createDeckStats(deck2Container);
statCategoryCells.push(statCategoryCells1)
statCategoryCells.push(statCategoryCells2)

myLog("STAT CATEGORY CELLS");
myLog(statCategoryCells);

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
	//statCategoryCells.range.innerHTML = 'test'
	//for each stat set statCategoryCells['statname'].innerHTML to the correct stat
	//myLog(stats);
	for (var key in stats) {
		if (statCategoryCells[deckID][key] != undefined) {
			statCategoryCells[deckID][key].innerHTML = '';
			if (key == 'ability') {
				for (var i = 0; i < stats[key].length; i++) {
					if (stats[key][i] != undefined && (stats[key][i] != ' ')) {
						var img = document.createElement('img');
						img.src = 'images/abilities/' + stats[key][i] + '.png';
						img.setAttribute('alt', stats[key][i]);
						img.setAttribute('title', stats[key][i]);
						img.classList.add('deckStatsImgAbility');
						statCategoryCells[deckID][key].appendChild(img);
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
								img.classList.add('deckStatsImgTraits');
								statCategoryCells[deckID][key].appendChild(img);
							}
						}
						else {
							if (stats[key][i] != 'none') {
								img.src = 'images/traits/' + stats[key][i] + '.png';
								img.setAttribute('alt', stats[key][i]);
								img.setAttribute('title', stats[key][i]);
								img.classList.add('deckStatsImgTraits');
								statCategoryCells[deckID][key].appendChild(img);
							}
						}

						/*
						statCategoryCells[key].sort(function (a, b) {
							return a.alt.localeCompare(b.alt);
						})
						
						*/
						//sort children of statCategoryCells[key]


						var sortedChildren = Array.from(statCategoryCells[deckID][key].children).sort(function (a, b) {
							return a.alt.localeCompare(b.alt);
						});
						statCategoryCells[deckID][key].innerHTML = '';
						sortedChildren.forEach(function (child) {
							statCategoryCells[deckID][key].appendChild(child);
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
						img.classList.add('deckStatsImgManf');
						statCategoryCells[deckID][key].appendChild(img);
					}

					//sort children of statCategoryCells[key]


					var sortedChildren = Array.from(statCategoryCells[deckID][key].children).sort(function (a, b) {
						return a.alt.localeCompare(b.alt);
					});
					statCategoryCells[deckID][key].innerHTML = '';
					sortedChildren.forEach(function (child) {
						statCategoryCells[deckID][key].appendChild(child);
					});
				}
			}
			else statCategoryCells[deckID][key].innerHTML = Math.round(stats[key]);
		}
	}
	return stats;
}

function redrawDeckContent(deckID) {
	calculateDeckStats(deckID);
	//iterate through deckslots
	//deckStats.innerHTML = 'deck stats:\nhello';
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
	//myLog(unit);about:_blank#blocked
	//add the unit name to the unitDeckInput text box
	//unitDeckInput.value += unit.name + '\n';
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
		var deckClass = 'unitDeck1SlotDivFilled';
		if (deckID == 1) deckClass = 'unitDeck2SlotDivFilled';
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

export { deckView, addUnitToDeck, currentDeck, decks, filteredDecks, decklistDropdown, deckSearchInputElement, deckInit };