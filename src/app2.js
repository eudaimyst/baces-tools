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
	deckDescriptionContainer.innerHTML = '';
	//for each unit store their selected strengths
	var unitAttackTypes = [];
	var unitTypes = [];
	var unitStrengths = [];
	var unitWeaknesses = [];
	var unitAbilities = [];
	/*
		this.health = jsonEntry.Health;
		this.damage = jsonEntry.Damage;
		this.speed = jsonEntry.Speed;
		this.range = jsonEntry.Range;
		this.matter = jsonEntry.Matter;
		this.energy = jsonEntry.Energy;
		this.bandwidth = jsonEntry.Bandwidth;
		this.building = jsonEntry.Building;
		this.ability = jsonEntry.Ability;
	*/
	//make an array for each unit parameter above
	var deckHealth = 0;
	var deckDamage = 0;
	var deckSpeed = 0;
	var deckRange = 0;
	var deckMatter = 0;
	var deckEnergy = 0;
	var deckBandwidth = 0;

	for (var i = 0; i < selectedUnits.length; i++) {
		if (selectedUnits[i]) {
			deckDescriptionContainer.innerHTML += selectedUnits[i].name + '<br>';
			if (selectedUnits[i].strongAgainst) {
				unitStrengths.push(selectedUnits[i].strongAgainst);
			}
			if (selectedUnits[i].strongAgainst2) {
				unitStrengths.push(selectedUnits[i].strongAgainst2);
			}
			if (selectedUnits[i].weakAgainst) {
				unitWeaknesses.push(selectedUnits[i].weakAgainst);
			}
			if (selectedUnits[i].weakAgainst2) {
				unitWeaknesses.push(selectedUnits[i].weakAgainst2);
			}
			if (selectedUnits[i].unitType) {
				unitTypes.push(selectedUnits[i].unitType);
			}
			if (selectedUnits[i].attackType) {
				unitAttackTypes.push(selectedUnits[i].attackType);
			}
			if (selectedUnits[i].attackType2) {
				unitAttackTypes.push(selectedUnits[i].attackType2);
			}
			if (selectedUnits[i].ability) {
				unitAbilities.push(selectedUnits[i].ability);
			}
			if (selectedUnits[i].ability2) {
				unitAbilities.push(selectedUnits[i].ability2);
			}
			deckHealth += selectedUnits[i].health;
			deckDamage += selectedUnits[i].damage;
			deckSpeed += selectedUnits[i].speed;
			deckRange += selectedUnits[i].range;
			deckMatter += selectedUnits[i].matter;
			deckEnergy += selectedUnits[i].energy;
			deckBandwidth += selectedUnits[i].bandwidth;
		}
	}
	deckDescriptionContainer.innerHTML += 'Deck Description:';
	var statsString = '';
	statsString += 'Health: ' + deckHealth + '<br>';
	statsString += 'Damage: ' + deckDamage + '<br>';
	statsString += 'Speed: ' + deckSpeed + '<br>';
	statsString += 'Range: ' + deckRange + '<br>';
	statsString += 'Matter: ' + deckMatter + '<br>';
	statsString += 'Energy: ' + deckEnergy + '<br>';
	statsString += 'Bandwidth: ' + deckBandwidth + '<br>';
	deckDescriptionContainer.innerHTML += statsString;

	//for each unit strength in unitstrengths
	var strengthsString = '<br>Strong Against:';
	for (var i = 0; i < unitStrengths.length; i++) {
		//if the unit strength is not null
		if (unitStrengths[i] != null || unitStrengths[i] != '') {
			//add the unit strength to the deck description container
			if (!strengthsString.includes(unitStrengths[i])) {
				strengthsString += unitStrengths[i] + ',';
			} else {
				var index = strengthsString.search(unitStrengths[i] + unitStrengths[i].length);
				strengthsString = strengthsString.slice(0, index) + '+' + strengthsString.slice(index);
			}
		}
	}
	deckDescriptionContainer.innerHTML += strengthsString;
	//for each unit strength in unitweaknesses
	var weaknessString = '<br>Weak Against:';
	for (var i = 0; i < unitWeaknesses.length; i++) {
		//if the unit strength is not null
		if (unitWeaknesses[i] != null || unitWeaknesses[i] != '') {
			//add the unit weaknesses to the deck description container only if it's not repeated
			// if deckDescriptionContainer.innerHTML contains the text of the weaknesses, then do not add it, otherwise add it
			if (!weaknessString.includes(unitWeaknesses[i])) {
				weaknessString += unitWeaknesses[i] + ',';
			} else {
				var index = weaknessString.search(unitWeaknesses[i] + unitWeaknesses[i].length);
				weaknessString = weaknessString.slice(0, index) + '+' + weaknessString.slice(index);
			}
		}
	}
	deckDescriptionContainer.innerHTML += weaknessString;
	//for each unit strength in
	//unitAttackTypes;
	//unitTypes;
	//unitAbilities;
	var unitAttackTypesString = '<br>Attack Types:';
	for (var i = 0; i < unitAttackTypes.length; i++) {
		//if the unit strength is not null
		if (unitAttackTypes[i] != null || unitAttackTypes[i] != '') {
			//add the unit weaknesses to the deck description container only if it's not repeated
			// if deckDescriptionContainer.innerHTML contains the text of the weaknesses, then do not add it, otherwise add it
			if (!unitAttackTypesString.includes(unitAttackTypes[i])) {
				unitAttackTypesString += unitAttackTypes[i] + ',';
			} else {
				//find the index where unitAbilities is in unitAbilitiesString
				var index = unitAttackTypesString.search(unitAttackTypes[i] + unitAttackTypes[i].length);
				unitAttackTypesString = unitAttackTypesString.slice(0, index) + '+' + unitAttackTypesString.slice(index);
				//at the index insert the '+' character into the string
			}
		}
	}
	deckDescriptionContainer.innerHTML += unitAttackTypesString;
	//unitTypes;
	var unitTypesString = '<br>Unit Types:';
	for (var i = 0; i < unitTypes.length; i++) {
		//if the unit strength is not null
		if (unitTypes[i] != null || unitTypes[i] != '') {
			//add the unit weaknesses to the deck description container only if it's not repeated
			// if deckDescriptionContainer.innerHTML contains the text of the weaknesses, then do not add it, otherwise add it
			if (!unitTypesString.includes(unitTypes[i])) {
				unitTypesString += unitTypes[i] + ',';
			} else {
				//find the index where unitAbilities is in unitAbilitiesString
				var index = unitTypesString.search(unitTypes[i] + unitTypes[i].length);
				unitTypesString = unitTypesString.slice(0, index) + '+' + unitTypesString.slice(index);
				//at the index insert the '+' character into the string
			}
		}
	}
	deckDescriptionContainer.innerHTML += unitTypesString;
	//unitAbilities;
	var unitAbilitiesString = '<br>Abilities:';
	for (var i = 0; i < unitAbilities.length; i++) {
		//if the unit strength is not null
		if (unitAbilities[i] != null || unitAbilities[i] != '') {
			//add the unit weaknesses to the deck description container only if it's not repeated
			// if deckDescriptionContainer.innerHTML contains the text of the weaknesses, then do not add it, otherwise add it
			if (!unitAbilitiesString.includes(unitAbilities[i])) {
				unitAbilitiesString += unitAbilities[i] + ',';
			} else {
				//find the index where unitAbilities is in unitAbilitiesString
				var index = unitAbilitiesString.search(unitAbilities[i] + unitAbilities[i].length);
				unitAbilitiesString = unitAbilitiesString.slice(0, index) + '+' + unitAbilitiesString.slice(index);
				//at the index insert the '+' character into the string
			}
		}
	}
	deckDescriptionContainer.innerHTML += unitAbilitiesString;

	//search through deckDescriptionContainer for any commas preceding a new line and remove the commas
	deckDescriptionContainer.innerHTML = deckDescriptionContainer.innerHTML.replace(/,/g, ' ');
}
updateUnitCards();

//for each unit in the array, call the drawUnit function
units.forEach(function (unit) {
	drawUnitCard(unit);
});
