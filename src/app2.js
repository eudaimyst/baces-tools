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

function drawUnitCard(unit) {
	var unitDiv = document.createElement('div');
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

	unitDiv.appendChild(cardNameDiv);
	unitDiv.appendChild(cardHealthDiv);
	unitDiv.appendChild(cardDamageDiv);
	unitDiv.appendChild(cardSpeedDiv);
	unitDiv.appendChild(cardRangeDiv);

	//add a click event listener to the unit div which calls the drawUnit function with the clicked unit as a parameter
	unitDiv.addEventListener('click', function () {
		//drawUnit(unit);
		console.log(unit.name + ' was clicked');
	});
}

//for each unit in the array, call the drawUnit function
units.forEach(function (unit) {
	drawUnitCard(unit);
});
