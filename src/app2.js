//#tag top
//load the unit json file
var unitJson = require('./units.json');
var unitJson2 = require('./Zaokret_units.json');

var mouseOverUnit = null; //stores the unit mouseover so we can compare before redrawing the unit information

//loop through unitJson2 and update any values that are missing in unitJson if their name matches
//loop through the zaokret_units (scraped from the site by https://github.com/Zaokret/battle-aces)
/* 
manual units / unitJson value example
"Name": "Blink",
"Image": "blink",
"Health": 2,
"Damage": 1,
"Speed": 3,
"Range": 2,
"Matter": 100,
"Energy": 0,
"Bandwidth": 2,
"Building": "Core",
"Attack Type": "Anti-Ground",
"Attack Type 2": "",
"Unit Type": "Ground",
"Ability": "Blink",
"Strong Against": "",
"StrongAgainst 2": "",
"Weak Against": "Splash",
"Weak Against 2": "Air",
"Other": ""
----------------------------------------
zaokret_units / unitJson2 value example
"costBandwidth": 2,
"costMatter": 75,
"costEnergy": 25,
"name": "Hunter",
"statDamage": 1,
"statHealth": 2,
"statRange": 2,
"statSpeed": 2,
"techTier": "Core",
"techTierId": 0,
"unitAbility": null,
"unitTag": "Anti-Air Ground Unit",
"unitTagArray": ["Anti-Air", "Ground"],
"slug": "hunter",
"videoTurnaround": "https://cdn.playbattleaces.com/videos/turnarounds/hunter.mp4",
"videoGameplay": "https://cdn.playbattleaces.com/videos/gameplay/hunter.mp4",
"website": "https://www.playbattleaces.com/units/hunter",
"image": "https://cdn.playbattleaces.com/images/icons/units/hunter.png"	
*/
//create a constructor for a unit object with all the stats, which takes a json entry
class Unit {
	constructor(jsonEntry) {
		//manual unit json entry
		if (jsonEntry.Building) {
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
		//kaokret importer json entry
		else if (jsonEntry.techTier) {
			this.name = jsonEntry.name;
			this.imagename = jsonEntry.slug;
			this.health = jsonEntry.statHealth;
			this.damage = jsonEntry.statDamage;
			this.speed = jsonEntry.statSpeed;
			this.range = jsonEntry.statRange;
			this.matter = jsonEntry.costMatter;
			this.energy = jsonEntry.costEnergy;
			this.bandwidth = jsonEntry.costBandwidth;
			this.building = jsonEntry.techTier;
			this.ability = jsonEntry.unitAbility;
			this.videoTurnaround = jsonEntry.videoTurnaround;
			this.videoGameplay = jsonEntry.videoGameplay;
		}
		console.log(jsonEntry);
		//remove any spaces and all capitals from the name to generate the slug for the unit
		this.slug = jsonEntry.slug;

		//this will update the stats for each unit based on the 2nd json data
		this.updateStats = function (json2) {
			this.health = json2.statHealth;
			this.damage = json2.statDamage;
			this.speed = json2.statSpeed;
			this.range = json2.statRange;
			this.matter = json2.costMatter;
			this.energy = json2.costEnergy;
			this.bandwidth = json2.costBandwidth;
			this.videoGameplay = json2.videoGameplay;
			console.log('updated');
		};
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
		building: 'Foundry',
		building2: '',
	},
	{
		building: 'Advanced Foundry',
		building2: '',
	},
	{
		building: 'Advanced Foundry',
		building2: 'Foundry',
	},
	{
		building: 'Core',
		building2: '',
	},
	{
		building: 'Starforge',
		building2: '',
	},
	{
		building: 'Advanced Starforge',
		building2: '',
	},
	{
		building: 'Advanced Starforge',
		building2: 'Starforge',
	},
];

var deckPlaceholders = ['core.svg', 'foundry.svg', 'advancedfoundry.svg', 'bothFoundry.png', 'core.svg', 'starforge.svg', 'advancedstarforge.svg', 'bothStarforge.png'];

//for each entry in the json file, create a new unit object and add it to the array
unitJson.forEach(function (entry) {
	units.push(new Unit(entry));
});

unitJson2.forEach(function (entry) {
	var found = false;
	units.forEach(function (unit) {
		if (unit.name == entry.name) {
			unit.updateStats(entry);
			found = true;
		}
	});
	if (!found) units.push(new Unit(entry));
});

console.log(units);

//in html we have 2 divs for the left and right side
//		<div id="leftside"></div>
//		<div id="rightside"></div>

//create a div which has the unit information in a box like a card which takes a unit as a parameter

//create a unit container div element with the id unitContainer
var unitContainer = document.createElement('div');
unitContainer.id = 'unitContainer';
//add the unit container to the body
document.body.appendChild(unitContainer);
//create a div for the card remaining counter
var cardRemainingContainer = document.createElement('div');
cardRemainingContainer.id = 'cardRemainingContainer';
var unitStats = document.createElement('div');
unitStats.id = 'unitStats';
cardRemainingContainer.appendChild(unitStats);
document.body.appendChild(cardRemainingContainer);

var deckSlots = [];

var deckDisplay = document.createElement('div');
deckDisplay.innerHTML = 'Deck:';
document.body.appendChild(deckDisplay);
//make a 2x4 table for the deck grid
var deckGrid = document.createElement('table');
deckGrid.id = 'deckGrid';
//make 2 rows and for columns
for (var i = 0; i < 2; i++) {
	var row = document.createElement('tr');
	for (var j = 0; j < 4; j++) {
		var cell = document.createElement('td');
		cell.className = 'deckSlotCell';
		deckSlots.push(cell);
		//add the cell to the row
		row.appendChild(cell);
		//add the row to the table
		deckGrid.appendChild(row);
	}
}
//iterate through the deck slots
for (var i = 0; i < deckSlots.length; i++) {
	//add an image to the cell
	var cell = deckSlots[i];
	//add an image to the cell
	var img = document.createElement('img');
	img.className = 'deckSlotImage';
	//set image source to 'foundry.svg'
	img.src = './images/' + deckPlaceholders[i];
	cell.appendChild(img);
}
//add the deck grid to the deck display
deckDisplay.appendChild(deckGrid);

//create a div for the deck description
deckDisplay.id = 'deckDisplay';
//create a deck description container div
var deckDescriptionContainer = document.createElement('div');
deckDescriptionContainer.id = 'deckDescriptionContainer';
//add the deck description container to the body
deckDisplay.appendChild(deckDescriptionContainer);

//#tag drawUnitCard
//this is where units are drawn on the pick side
//it also contains its mouse over and on click functions
//it takes a unit object defined above

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
	cardHealthDiv.innerHTML = unit.health;
	var cardHealthImg = document.createElement('img');
	cardHealthImg.src = './images/health.png';
	cardHealthImg.className = 'cardStatImage';
	cardHealthDiv.insertBefore(cardHealthImg, cardHealthDiv.firstChild);
	//cardHealthDiv.appendChild(cardHealthImg);
	// add  cardNameDiv
	var cardNameDiv = document.createElement('div');
	cardNameDiv.className = 'card_name_div';
	cardNameDiv.innerHTML = unit.name;
	//add cardDamageDiv
	var cardDamageDiv = document.createElement('div');
	cardDamageDiv.className = 'card_damage_div';
	cardDamageDiv.innerHTML = unit.damage;
	var cardDamageImg = document.createElement('img');
	cardDamageImg.src = './images/damage.png';
	cardDamageImg.className = 'cardStatImage';
	cardDamageDiv.insertBefore(cardDamageImg, cardDamageDiv.firstChild);
	//add cardSpeedDiv
	var cardSpeedDiv = document.createElement('div');
	cardSpeedDiv.className = 'card_speed_div';
	cardSpeedDiv.innerHTML = unit.speed;
	var cardSpeedImg = document.createElement('img');
	cardSpeedImg.src = './images/speed.png';
	cardSpeedImg.className = 'cardStatImage';
	cardSpeedDiv.insertBefore(cardSpeedImg, cardSpeedDiv.firstChild);
	//add cardRangeDiv
	var cardRangeDiv = document.createElement('div');
	cardRangeDiv.className = 'card_range_div';
	cardRangeDiv.innerHTML = unit.range;
	var cardRangeImg = document.createElement('img');
	cardRangeImg.src = './images/range.png';
	cardRangeImg.className = 'cardStatImage';
	cardRangeDiv.insertBefore(cardRangeImg, cardRangeDiv.firstChild);
	//add cardAntiAirDiv
	//if unit.attackType2 equals Anti-Air or Versatile')
	var cardAADiv = document.createElement('div');
	cardAADiv.className = 'card_aa_div';
	var cardAAImg = document.createElement('img');
	cardAAImg.src = './images/antiair.png';
	cardAAImg.className = 'cardAAImage';

	if (unit.attackType == 'Anti-Air' || unit.attackType == 'Versatile') {
		cardAADiv.append(cardAAImg);
	}

	var cardBuildingDiv = document.createElement('div');
	cardBuildingDiv.classList.add('card_building_div');
	var cardBuildingImg = document.createElement('img');
	//covert unit name to lowercase without space
	var imgname = unit.building.replace(/\s/g, '').toLowerCase();
	cardBuildingImg.src = './images/' + imgname + '.svg';
	cardBuildingImg.className = 'cardBuildingImage';
	var cardBuildingName = document.createElement('div');
	cardBuildingName.className = 'card_building_name';
	cardBuildingName.innerHTML = unit.building;
	cardBuildingDiv.append(cardBuildingImg);
	cardBuildingDiv.append(cardBuildingName);

	//this contains errors because the building name has spaces, convert the class to lowercase removing spaces
	//cardBuildingDiv.classList.add(unit.building);
	//remove spaces from the building name and convert to lowercase
	cardBuildingDiv.classList.add(unit.building.replace(/\s/g, '').toLowerCase());
	cardBuildingImg.classList.add(unit.building.replace(/\s/g, '').toLowerCase());
	//cardBuildingDiv.append(unit.building);

	//add the unit image to the unit div
	var unitImage = document.createElement('img');
	unitImage.className = 'card_unit_img';
	//remove spaces and lowercase the unit name to get the imagename
	var imagename = unit.name.replace(/\s/g, '').toLowerCase();
	unitImage.src = './images/' + imagename + '.png';

	//add the image source
	unitDiv.appendChild(cardBuildingDiv);
	unitDiv.appendChild(cardAADiv);
	unitDiv.appendChild(cardHealthDiv);
	unitDiv.appendChild(cardDamageDiv);
	unitDiv.appendChild(cardSpeedDiv);
	unitDiv.appendChild(cardRangeDiv);
	unitDiv.appendChild(unitImage);
	unitDiv.appendChild(cardNameDiv);

	//#region onClick
	//add a click event listener to the unit div which calls the drawUnit function with the clicked unit as a parameter
	unitDiv.addEventListener('click', function () {
		//drawUnit(unit);
		console.log(unit.name + ' was clicked');
		//for all the deck rules see if there is a slot in the selectedUnits for the unit's building
		for (var i = 0; i < deckrules.length; i++) {
			if (deckrules[i].building == unit.building || deckrules[i].building2 == unit.building) {
				if (selectedUnits[i] == null) {
					//before adding the unit we need to check it doesn't already exist in selected units
					//loop through selected units array and see if unit already exists, if it does, we break and do nothing
					var unitsFound = false;
					for (var j = 0; j < selectedUnits.length; j++) {
						if (selectedUnits[j] == unit) {
							unitsFound = true;
						}
					}
					if (unitsFound == false) {
						selectedUnits[i] = unit;
						remainingPicks[unit.building] -= 1;
						break;
					}
				}
				//update the unit cards to show the selected units in grey
				updateUnitCards();
			}
		}
		updateUnitCards();
	});
	//#endregion

	//#region mouseOver
	var videoElement = document.createElement('video');
	videoElement.className = 'unitMouseoverVideo';

	unitDiv.addEventListener('mouseover', function () {
		if (unit == mouseOverUnit) {
		} else {
			mouseOverUnit = unit;
			console.log(unit.name + ' was mouseOver');
			//for each unit stat add a line to unitStats
			var unitStats = document.getElementById('unitStats');
			unitStats.innerHTML = '';
			//for each unit stat add a line as follows
			/*
		Object.keys(unit).forEach((key) => {
			unitStats.innerHTML += key + ': ' + unit[key] + '<br>';
		});
		*/
			var mouseOverBox = document.createElement('div');
			mouseOverBox.className = 'unitMouseoverBox';

			videoElement.src = unit.videoGameplay;
			//if video is not already playing
			if (videoElement.paused) {
				//play the video
				videoElement.play();
				videoElement.volume = 0;
				videoElement.loop = true;
				mouseOverBox.appendChild(videoElement);
			}
			unitStats.appendChild(mouseOverBox);
		}
	});
	//#endregion
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
		var building = unitCardElements[i].getElementsByClassName('card_building_name')[0].innerHTML;
		//the building var must contain the words froundry, advanced foundry, core, starforge, advanced starforge
		//search the building variable for these words
		//if remainingPicks[building] is 0 add a grey css class
		if (remainingPicks[building] == 0) {
			unitCardElements[i].classList.add('grey');
		}

		if (building == 'Foundry' && remainingPicks['Foundry'] == 1) {
			if (remainingPicks['Advanced Foundry'] == 0) {
				unitCardElements[i].classList.add('grey');
			}
		}
		if (building == 'Starforge' && remainingPicks['Starforge'] == 1) {
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
	cardRemainingContainer.appendChild(unitStats);
	deckDescriptionContainer.innerHTML = '';
	//for each unit store their selected strengths
	var unitAttackTypes = [];
	var unitTypes = [];
	var unitStrengths = [];
	var unitWeaknesses = [];
	var unitAbilities = [];
	var unitOthers = [];
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
			//add the name of the unit to the deck description
			deckDescriptionContainer.innerHTML += selectedUnits[i].name + ',';
			//construct the arrays of the deck stats
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
			if (selectedUnits[i].other) {
				unitOthers.push(selectedUnits[i].other);
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

	//#region deckDescriptionhtml
	deckDescriptionContainer.innerHTML += '<br>Deck Stats: <br>';
	var statsString = '==========<br>';
	statsString += 'Health: ' + deckHealth + '<br>';
	statsString += 'Damage: ' + deckDamage + '<br>';
	statsString += 'Speed: ' + deckSpeed + '<br>';
	statsString += 'Range: ' + deckRange + '<br>';
	statsString += 'Matter: ' + deckMatter + '<br>';
	statsString += 'Energy: ' + deckEnergy + '<br>';
	statsString += 'Bandwidth: ' + deckBandwidth + '<br>';
	statsString += '==========<br>';
	deckDescriptionContainer.innerHTML += statsString;

	//for each unit strength in unitstrengths
	var strengthsString = 'Strong Against:';
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
	//unitAbilities;
	var unitOthersString = '<br>Other:';
	for (var i = 0; i < unitOthers.length; i++) {
		//if the unit strength is not null
		if (unitOthers[i] != null || unitOthers[i] != '') {
			//add the unit weaknesses to the deck description container only if it's not repeated
			// if deckDescriptionContainer.innerHTML contains the text of the weaknesses, then do not add it, otherwise add it
			if (!unitOthersString.includes(unitOthers[i])) {
				unitOthersString += unitOthers[i] + ',';
			} else {
				//find the index where unitAbilities is in unitAbilitiesString
				var index = unitOthersString.search(unitOthers[i] + unitOthers[i].length);
				unitOthersString = unitOthersString.slice(0, index) + '+' + unitOthersString.slice(index);
				//at the index insert the '+' character into the string
			}
		}
	}
	deckDescriptionContainer.innerHTML += unitOthersString;

	//search through deckDescriptionContainer for any commas preceding a new line and remove the commas
	console.log(deckDescriptionContainer.innerHTML);
	deckDescriptionContainer.innerHTML = deckDescriptionContainer.innerHTML.replace(',<br>', '<br>');

	//loop through the selected units and add their details to the deck display
	//for each selected unit add its name fo the deckdescriptioncontainer innerhtml
	for (var i = 0; i < selectedUnits.length; i++) {
		if (selectedUnits[i]) {
			//add the name of the unit to the deck slots
			var imagename = selectedUnits[i].name.replace(/\s/g, '').toLowerCase();
			deckSlots[i].innerHTML = '<img class="deckSlotImage" src="images/' + imagename + '.png">';
			deckSlots[i].innerHTML += '<div class="unit-card">' + selectedUnits[i].name + '</div>';
			//add the image of the unit to the deck slots
			//low case and remove the space from the name ot get the image
		}
	}
	//#endregion
}
updateUnitCards();

//for each unit in the array, call the drawUnit function
units.forEach(function (unit) {
	drawUnitCard(unit);
});

//create export button
var exportButton = document.createElement('button');
exportButton.innerHTML = 'Export';
exportButton.id = 'exportButton';
document.body.appendChild(exportButton);

//export a json file of the units array
exportButton.addEventListener('click', function () {
	var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(units));
	var downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute('href', dataStr);
	downloadAnchorNode.setAttribute('download', 'units.json');
	document.body.appendChild(downloadAnchorNode); //required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
});
