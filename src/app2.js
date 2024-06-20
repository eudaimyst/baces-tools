//load the unit json file
var unitJson = require('./units.json');

//create a constructor for a unit object with all the stats, which takes a json entry
class Unit {
	constructor(jsonEntry) {
		console.log(jsonEntry);
		this.name = jsonEntry.Name;
		this.imagename = jsonEntry.Image;
		this.health = jsonEntry.Health;
		this.damage = jsonEntry.Damage;
		this.speed = jsonEntry.Speed;
		this.range = jsonEntry.Range;
		this.matter = jsonEntry.Matter;
		this.energy = jsonEntry.Energy;
		this.bandwidth = jsonEntry.Bandwidth;
		this.building = jsonEntry.Building;
		this.ability = jsonEntry.Ability;
		this.attackType = jsonEntry['Attack Type'];
		this.attackType2 = jsonEntry['Attack Type 2'];
		this.unitType = jsonEntry['Unit Type'];
		this.strongAgainst = jsonEntry['Strong Against'];
		this.strongAgainst2 = jsonEntry['StrongAgainst 2'];
		this.weakAgainst = jsonEntry['Weak Against'];
		this.weakAgainst2 = jsonEntry['Weak Against 2'];
		this.other = jsonEntry.Other;
		this.manufacturer = jsonEntry.Manufacturer;
	}
}

//create an empty array of units
var units = [];

//units that are selected are added to the deck
var selectedUnits = [];

//create a structure of rules for what units can go in the deck slots
//using the unit's building parameter
var deckrules = [
	{
		building: 'Core',
		building2: '',
	},
	{
		building: 'Core',
		building2: '',
	},
	{
		building: 'Foundry',
		building2: '',
	},
	{
		building: 'Starforge',
		building2: '',
	},
	{
		building: 'Advanced Foundry',
		building2: '',
	},
	{
		building: 'Advanced Starforge',
		building2: '',
	},
	{
		building: 'Advanced Foundry',
		building2: 'Foundry',
	},
	{
		building: 'Advanced Starforge',
		building2: 'Starforge',
	},
];

//for each entry in the json file, create a new unit object and add it to the array
unitJson.forEach(function (entry) {
	units.push(new Unit(entry));
});

console.log(units);

//create a div which has the unit information in a box like a card which takes a unit as a parameter

//create a unit container div element with the id unitContainer
var unitContainer = document.createElement('div');
unitContainer.id = 'unitContainer';
//add the unit container to the body
document.body.appendChild(unitContainer);
//create a div for the card remaining counter
var cardRemainingContainer = document.createElement('div');
cardRemainingContainer.id = 'cardRemainingContainer';
document.body.appendChild(cardRemainingContainer);
//create a deck description container div
var deckDescriptionContainer = document.createElement('div');
deckDescriptionContainer.id = 'deckDescriptionContainer';
//add the deck description container to the body
document.body.appendChild(deckDescriptionContainer);

var unitCardElements = [];

var remainingPicks = { Core: 2, Foundry: 2, 'Advanced Foundry': 2, Starforge: 2, 'Advanced Starforge': 2 };
function drawUnitCard(unit) {
	var unitDiv = document.createElement('div');
	//add unitDiv to the unitCardElements array
	unitCardElements.push(unitDiv);
	unitDiv.className = 'unitCard';
	//add the unit div to the container
	document.getElementById('unitContainer').appendChild(unitDiv);
	//add unit health to the unit div  by the letter H plus the number of the value
	var cardHealthDiv = document.createElement('div');
	cardHealthDiv.className = 'card_health_div';
	cardHealthDiv.innerHTML = 'H' + unit.health;
	// add  cardNameDiv
	var cardNameDiv = document.createElement('div');
	cardNameDiv.className = 'card_name_div';
	cardNameDiv.innerHTML = unit.name;
	//add cardDamageDiv
	var cardDamageDiv = document.createElement('div');
	cardDamageDiv.className = 'card_damage_div';
	cardDamageDiv.innerHTML = 'D' + unit.damage;
	//add cardSpeedDiv
	var cardSpeedDiv = document.createElement('div');
	cardSpeedDiv.className = 'card_speed_div';
	cardSpeedDiv.innerHTML = 'S' + unit.speed;
	//add cardRangeDiv
	var cardRangeDiv = document.createElement('div');
	cardRangeDiv.className = 'card_range_div';
	cardRangeDiv.innerHTML = 'R' + unit.range;

	var cardBuildingDiv = document.createElement('div');
	cardBuildingDiv.classList.add('card_building_div');

	//this contains errors because the building name has spaces, convert the class to lowercase removing spaces
	//cardBuildingDiv.classList.add(unit.building);
	//remove spaces from the building name and convert to lowercase
	cardBuildingDiv.classList.add(unit.building.replace(/\s/g, '').toLowerCase());
	cardBuildingDiv.innerHTML = '' + unit.building;

	//add the unit image to the unit div
	var unitImage = document.createElement('img');
	unitImage.className = 'card_unit_img';
	//remove spaces and lowercase the unit name to get the imagename
	var imagename = unit.name.replace(/\s/g, '').toLowerCase();
	unitImage.src = './images/' + imagename + '.png';
	//add the image source
	unitDiv.appendChild(cardNameDiv);
	unitDiv.appendChild(cardHealthDiv);
	unitDiv.appendChild(cardDamageDiv);
	unitDiv.appendChild(cardSpeedDiv);
	unitDiv.appendChild(cardRangeDiv);
	unitDiv.appendChild(cardBuildingDiv);
	unitDiv.appendChild(unitImage);

	//add a click event listener to the unit div which calls the drawUnit function with the clicked unit as a parameter
	unitDiv.addEventListener('click', function () {
		//drawUnit(unit);
		console.log(unit.name + ' was clicked');
		//for all the deck rules see if there is a slot in the selectedUnits for the unit's building
		for (var i = 0; i < deckrules.length; i++) {
			if (deckrules[i].building == unit.building || deckrules[i].building2 == unit.building) {
				if (selectedUnits[i] == null) {
					selectedUnits[i] = unit;
					remainingPicks[unit.building] -= 1;
					break;
				}
				//update the unit cards to show the selected units in grey
				updateUnitCards();
			}
		}
		updateUnitCards();
	});
}

//this is called whenever a unit is clicked
function updateUnitCards() {
	var selectedUnitCount = 0;
	for (var j = 0; j < selectedUnits.length; j++) {
		if (selectedUnits[j] != null) {
			selectedUnitCount++;
		}
	}
	//for each unit card in unitcarelements
	for (var i = 0; i < unitCardElements.length; i++) {
		//if the unit name matches a unit that has been selected add a grey css class
		for (var j = 0; j < selectedUnits.length; j++) {
			if (selectedUnits[j] != null) {
				//find the child element of unitCardElements[i] with the class name card_name_div
				var cardNameDiv = unitCardElements[i].getElementsByClassName('card_name_div')[0];
				if (cardNameDiv.innerHTML == selectedUnits[j].name) {
					unitCardElements[i].classList.add('grey');
				}
			}
		}
		//get the name of the unit of the current element
		var name = unitCardElements[i].getElementsByClassName('card_name_div')[0].innerHTML;
		var building = unitCardElements[i].getElementsByClassName('card_building_div')[0].innerHTML;
		//if remainingPicks[building] is 0 add a grey css class
		if (remainingPicks[building] == 0) {
			unitCardElements[i].classList.add('grey');
		}

		if (building == 'Foundry' && remainingPicks['Foundry'] == 1) {
			if (remainingPicks['Advanced Foundry'] == 0) {
				unitCardElements[i].classList.add('grey');
			}
		}
		if (building == 'Staforge' && remainingPicks['Staforge'] == 1) {
			if (remainingPicks['Advanced Starforge'] == 0) {
				unitCardElements[i].classList.add('grey');
			}
		}
		if (building == 'Advanced Foundry' && remainingPicks['Advanced Foundry'] == 1) {
			if (remainingPicks['Foundry'] == 0) {
				unitCardElements[i].classList.add('grey');
			}
		}
		if (building == 'Advanced Starforge' && remainingPicks['Advanced Starforge'] == 1) {
			if (remainingPicks['Starforge'] == 0) {
				unitCardElements[i].classList.add('grey');
			}
		}
		//if there are no remaining picks

		if (selectedUnitCount == 8) {
			unitCardElements[i].classList.add('grey');
		}
		//else remove the grey css class
	}
	//deckDescriptionContainer.innerHTML +=\
	//for each selected unit add its name fo the deckdescriptioncontainer innerhtml
	cardRemainingContainer.innerHTML = '';
	var rempicks = document.createElement('p');
	var remcount = 8 - selectedUnitCount;
	rempicks.innerHTML = 'Remaining Picks: ' + remcount;
	rempicks.className = 'rempicks';
	var corePicks = document.createElement('p');
	corePicks.innerHTML = 'Core: ' + remainingPicks['Core'];
	corePicks.className = 'core';
	var foundryPicks = document.createElement('p');
	foundryPicks.innerHTML = 'Foundry: ' + remainingPicks['Foundry'];
	foundryPicks.className = 'foundry';
	var starforgePicks = document.createElement('p');
	starforgePicks.innerHTML = 'Starforge: ' + remainingPicks['Starforge'];
	starforgePicks.className = 'starforge';
	var advFoundryPicks = document.createElement('p');
	advFoundryPicks.innerHTML = 'Advanced Foundry: ' + remainingPicks['Advanced Foundry'];
	advFoundryPicks.className = 'advancedfoundry';
	var advStarforgePicks = document.createElement('p');
	advStarforgePicks.innerHTML = 'Advanced Starforge: ' + remainingPicks['Advanced Starforge'];
	advStarforgePicks.className = 'advancedstarforge';
	cardRemainingContainer.appendChild(rempicks);
	cardRemainingContainer.appendChild(corePicks);
	cardRemainingContainer.appendChild(foundryPicks);
	cardRemainingContainer.appendChild(starforgePicks);
	cardRemainingContainer.appendChild(advFoundryPicks);
	cardRemainingContainer.appendChild(advStarforgePicks);
	//cardRemainingContainer.innerHTML += '<p class="core"> Core Remaining: ' + remainingPicks['Core'] + '<br>';
	//cardRemainingContainer.innerHTML += '<p class="foundry">Foundry Remaining: ' + remainingPicks['Foundry'] + '<br>';
	//cardRemainingContainer.innerHTML += '<p class="starforge">Starforge Remaining: ' + remainingPicks['Starforge'] + '<br>';
	//cardRemainingContainer.innerHTML += '<p class="advancedfoundry">Advanced Foundry Remaining: ' + remainingPicks['Advanced Foundry'] + '<br>';
	//cardRemainingContainer.innerHTML += '<p class="advancedstarforge">Advanced Starforge Remaining: ' + remainingPicks['Advanced Starforge'] + '<br>';
	deckDescriptionContainer.innerHTML = '';
	for (var i = 0; i < selectedUnits.length; i++) {
		if (selectedUnits[i] != null) deckDescriptionContainer.innerHTML += selectedUnits[i].name + '<br>';
	}
}
updateUnitCards();

//for each unit in the array, call the drawUnit function
units.forEach(function (unit) {
	drawUnitCard(unit);
});
