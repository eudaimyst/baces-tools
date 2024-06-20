console.log('Hello world!');

import unitJson from './units.json'; //with path

console.log(unitJson);
//console.log(unitJson['length']);
//console.log(unitJson[0]);

console.log('--------------------------------------------------------------------------------------');
console.log('--------------------------------------------------------------------------------------');
console.log('--------------------------------------------------------------------------------------');
console.log('--------------------------------------------------------------------------------------');
console.log('--------------------------------------------------------------------------------------');

//console.log(words);

//document.text = 'Hello world!';
var unitInfoText = document.getElementById('unitInfo');
unitInfoText.innerHTML = 'Hello world!';
var deckStatsText = document.getElementById('deckStats');
deckStatsText.innerHTML = 'Deck Stats:';
var coreP = document.getElementById('Core');
coreP.appendChild(document.createElement('br'));
var foundryP = document.getElementById('Foundry');
foundryP.appendChild(document.createElement('br'));
var advFoundryP = document.getElementById('AdvFoundry');
advFoundryP.appendChild(document.createElement('br'));
var starforgeP = document.getElementById('Starforge');
starforgeP.appendChild(document.createElement('br'));
var advStarforgeP = document.getElementById('AdvStarforge');
advStarforgeP.appendChild(document.createElement('br'));
document.getElementById('mainTable').appendChild(coreP);
document.getElementById('mainTable').appendChild(foundryP);
document.getElementById('mainTable').appendChild(advFoundryP);
document.getElementById('mainTable').appendChild(starforgeP);
document.getElementById('mainTable').appendChild(advStarforgeP);
document.getElementById('mainTable').appendChild(unitInfoText);

var cell1 = document.getElementById('cell1');
var cell2 = document.getElementById('cell5');
var cell3 = document.getElementById('cell2');
var cell4 = document.getElementById('cell3');
var cell5 = document.getElementById('cell4');
var cell6 = document.getElementById('cell6');
var cell7 = document.getElementById('cell7');
var cell8 = document.getElementById('cell8');
var deckCells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8];

function updateDeckCells(deckSlot, unitName) {
	//console.log(deckSlot);
	//console.log(unitName);
	//console.log(deckCells[deckSlot]);
	//console.log(deckCells[deckSlot].innerHTML);
	//console.log(deckCells[deckSlot].innerHTML.indexOf(unitName));
	if (deckCells[deckSlot].innerHTML.indexOf(unitName) == -1) {
		deckCells[deckSlot].innerHTML += unitName + '<br>';
	}
}

//turn this into a function below
//for each unit in json append a child containing its name
/*
Object.keys(json).forEach((key) => {
	console.log(json[key].Name);
	text.innerHTML += json[key].Name + '<br>';
});
 */
//write the function from here:
function addUnitNames() {
	Object.keys(unitJson).forEach((key) => {
		console.log(unitJson[key].Name);
		unitInfoText.innerHTML += unitJson[key].Name + '<br>';
	});
}

/*
//repeat the function to add all other properties of units

properties:
		"Health": 4,
		"Damage": 5,
		"Speed": 3,
		"Range": 3,
		"Matter": 125,
		"Energy": 125,
		"Bandwidth": 5,
		"Building": "Advanced Starforge",
		"Attack Type": "Anti-Air",
		"Attack Type 2": "",
		"Unit Type": "Air",
		"Ability": "",
		"Image": "valkyrie.png"
*/

function addUnitProperties() {
	Object.keys(unitJson).forEach((key) => {
		unitInfoText.innerHTML += '<br>';
		Object.keys(unitJson[key]).forEach((prop) => {
			unitInfoText.innerHTML += prop + ': ' + unitJson[key][prop] + '<br>';
		});
	});
}

//addUnitProperties();

//only add the unit properties for the name passed to the function
function addUnitPropertiesByName(name) {
	Object.keys(unitJson).forEach((key) => {
		if (unitJson[key].Name == name) {
			unitInfoText.innerHTML = '';
			unitInfoText.innerHTML += '<br>';
			Object.keys(unitJson[key]).forEach((prop) => {
				unitInfoText.innerHTML += prop + ': ' + unitJson[key][prop] + '<br>';
				//if prop is Image, show the image instead of text
				if (prop == 'Image') {
					unitInfoText.innerHTML += `<img src="images/${unitJson[key][prop]}" class="img">`;
				}
			});
		}
	});
}

//make an array to store each button so they can be iterated upon
var buttonStore = [];

//create a button for each unit
function addButton(name, onClickFunc, buildingElement, mouseOverFunc) {
	//look the unit up in json by its name and check the confirmed value
	//if the value is true, then add the button to the buildingElement
	//if the value is false, then do not add the button
	//if the value is not present, then add the button
	console.log('boo!');

	var button = document.createElement('button');
	var unitName = name;
	Object.keys(unitJson).forEach((key) => {
		if (unitJson[key].Name == name) {
			console.log('foundkey');
			if (unitJson[key].Confirmed == 'y') {
				console.log('confirmed');
				buttonStore.push(button);
				if (buildingElement.appendChild) buildingElement.appendChild(button);
				console.log(name);
				button.innerHTML = `<table><tr><td><img src="images/${unitJson[key].Image}.png" class="buttonImg"></td><td id="buttonStats">${unitJson[key].Name}</td><tr></table>`;
				button.classList.add('unitButton');
				button.onclick = onClickFunc;
				button.addEventListener('mouseover', mouseOverFunc);
				buttonStore.push(button);

				return button;
			}
		}
	});
	//button.innerHTML = name;
	//set button.innerHTML to image file from json, if the values exists
	//if (json[name].Image != undefined) button.innerHTML = `<img src="images/${json[name].Image}" class="img">`;
	//button class
	//button.classList.add('unitButton');
	//document.body.appendChild(button);

	//addbutton to array for iteration
}

//addUnitPropertiesByName('Valkyrie');

var currentDeckList = [];

//write a function to get the total matter of the current deck list
function getDeckMatter() {
	var totalMatter = 0;
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				totalMatter += unitJson[key].Matter;
			}
		});
	});
	return totalMatter;
}

function getDeckEnergy() {
	var totalEnergy = 0;
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				totalEnergy += unitJson[key].Energy;
			}
		});
	});
	return totalEnergy;
}

function getDeckSpeed() {
	var totalSpeed = 0;
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				totalSpeed += unitJson[key].Speed;
			}
		});
	});
	return totalSpeed;
}
function getDeckDamage() {
	var totalDamage = 0;
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				totalDamage += unitJson[key].Damage;
			}
		});
	});
	return totalDamage;
}
function getDeckHealth() {
	var totalHealth = 0;
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				totalHealth += unitJson[key].Health;
			}
		});
	});
	return totalHealth;
}
function getDeckStrengths() {
	var strengths = [];
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				if (unitJson[key]['Strong Against'] != undefined) {
					strengths.push(unitJson[key].Strengths);
				}
			}
		});
	});
	//return strengths;
	return strengths.join(', ');
}
// we need to write the following functions, to show them in the deckStats:
// getDeckWeaknesses; getDeckAbilities; getDeckAttackTypes; getDeckUnitTypes;

//make this work for the weak against json key

function getDeckWeaknesses() {
	var weaknesses = [];
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				if (unitJson[key]['Weak Against'] != undefined) {
					weaknesses.push(unitJson[key]['Weak Against']);
				}
			}
		});
	});
	return weaknesses.join(', ');
	//return weaknesses;
}

function getDeckAbilities() {
	var abilities = [];
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				if (unitJson[key].Ability != '') {
					abilities.push(unitJson[key].Ability);
				}
			}
		});
	});
	return abilities.join(', ');
	//return abilities;
}

function getDeckAttackTypes() {
	var attackTypes = [];
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				if (unitJson[key]['Attack Type'] != undefined) {
					if (unitJson[key]['Attack Type'] != '') attackTypes.push(unitJson[key]['Attack Type']);
				}
				if (unitJson[key]['Attack Type 2'] != undefined) {
					//filter empty keys
					if (unitJson[key]['Attack Type 2'] != '') attackTypes.push(unitJson[key]['Attack Type 2']);
				}
			}
		});
	});
	//return attackTypes;
	return attackTypes.join(', ');
}

function getDeckUnitTypes() {
	var unitTypes = [];
	currentDeckList.forEach((unit) => {
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Name == unit) {
				if (unitJson[key]['Unit Type'] != undefined) {
					//filter empty keys
					if (unitJson[key]['Unit Type'] != '') unitTypes.push(unitJson[key]['Unit Type']);
				}
			}
		});
	});
	//return unitTypes;
	return unitTypes.join(', ');
}

//write a function to get the total matter of the current deck list

//handle when a deck unit is added to the current Deck list

var remCoreUnits = 2;
var remFoundryUnits = 2;
var remStarforgeUnits = 2;
var remAdvFoundryUnits = 2;
var remAdvStarforgeUnits = 2;
var remTotalFoundryUnits = 3;
var remTotalStarforgeUnits = 3;

function updateDeckStats() {
	deckStatsText.innerHTML += 'Remaining units: ' + (8 - currentDeckList.length) + '<br> ';
	deckStatsText.innerHTML += 'Remaining Core Units: ' + remCoreUnits + '<br> ';
	deckStatsText.innerHTML += 'Remaining Foundry Units: ' + remFoundryUnits + '<br> ';
	deckStatsText.innerHTML += 'Remaining Starforge Units: ' + remStarforgeUnits + '<br> ';
	deckStatsText.innerHTML += 'Remaining Adv. Foundry Units: ' + remAdvFoundryUnits + '<br> ';
	deckStatsText.innerHTML += 'Remaining Adv. Starforge Units: ' + remAdvStarforgeUnits + '<br> ';
	deckStatsText.innerHTML = '<p id ="Anti-GroundWarning">Warning: Missing Anti-Ground Core</p>';
	deckStatsText.innerHTML += '<p id ="Anti-GroundWarningWarning">Warning: Missing Anti-Air Core</p>';
	deckStatsText.innerHTML = 'Deck Stats: ';
	deckStatsText.innerHTML += 'Units: ' + currentDeckList.length + '<br> ';
	//unit names
	for (var i = 0; i < currentDeckList.length; i++) {
		deckStatsText.innerHTML += '-- ' + currentDeckList[i] + '<br> ';
	}
	deckStatsText.innerHTML += 'Matter: ' + getDeckMatter() + ' (average 1,000.00 min600max1400)<br> ';
	deckStatsText.innerHTML += 'Energy: ' + getDeckEnergy() + ' (average 837.50 min500max1175)<br> ';
	deckStatsText.innerHTML += 'Speed: ' + getDeckSpeed() + ' (average 20.00 min11max29)<br> ';
	deckStatsText.innerHTML += 'Damage: ' + getDeckDamage() + ' (average 29 min24max29)<br> ';
	deckStatsText.innerHTML += 'Health: ' + getDeckHealth() + ' (average 22.5 min10max35<br> ';
	deckStatsText.innerHTML += '<br> ';
	deckStatsText.innerHTML += 'Strengths: ' + getDeckStrengths() + '<br> ';
	deckStatsText.innerHTML += 'Weaknesses: ' + getDeckWeaknesses() + '<br> ';
	deckStatsText.innerHTML += '<br> ';
	deckStatsText.innerHTML += 'Abilities: ' + getDeckAbilities() + '<br> ';
	deckStatsText.innerHTML += '<br> ';
	deckStatsText.innerHTML += 'Attack Types: ' + getDeckAttackTypes() + '<br> ';
	deckStatsText.innerHTML += '<br> ';
	deckStatsText.innerHTML += 'Unit Types: ' + getDeckUnitTypes() + '<br> ';
	deckStatsText.innerHTML += '<br> ';

	//iterate through currentDeckList and add search for if there are anti ground and core units
	//if there are, then add a warning to the deckStatsText
	for (var i = 0; i < currentDeckList.length; i++) {
		if (currentDeckList[i].includes('Anti-Ground')) {
			document.getElementById('Anti-GroundWarning').style.color = 'white';
		}
		if (currentDeckList[i].includes('Anti-Air')) {
			document.getElementById('Anti-GroundWarningWarning').style.color = 'white';
		}
	}


}

//addDeckUnit is called by the onClickFunction for the deck, it is passed it's name, so it's a good place to update things when a unit is added to the deck
addDeckUnit = (name) => {
	//check if the unit is already in the deck
	if (currentDeckList.includes(name)) {
		console.log('Unit already in deck');
	} else {
		currentDeckList.push(name);
		updateDeckStats();
		console.log('Added ' + name + ' to the deck');
		//at this point, when adding a unit to the deck
		//update the unit cells
		updateAllDeckCells();
	}
	console.log(currentDeckList);
	//update the deck stats text
	//update the deck cells
	updateDeckCells(currentDeckList.length - 1, name);
	//<div class="testingclass"><img src="images/${imageFile}.png" class="buttonImg">${name}</p>
	//add the name of each unit in the deck
	//for each unit in the deck, add a button to the deckStatsText
	currentDeckList.forEach((unit) => {
		deckStatsText.innerHTML += unit + ' ';
	});
};

//iterate through the deck cells and change the image to the units in the currentDeckList array
function updateAllDeckCells() {
	//iterate through the deck cells
	for (var i = 0; i < deckCells.length; i++) {
		//if the deck cell is not empty, change the image to the next unit in the currentDeckList array
		if (deckCells[i].innerHTML != '') {
			deckCells[i].innerHTML = `<img src="images/${currentDeckList[i]}.png" class="buttonImg">`;
		}
	}
}

//for each unit's name, add a button
Object.keys(unitJson).forEach((key) => {
	//create alocal onClickFunction that gets passed to the addButton function
	var onClickFunction = () => {
		console.log(unitJson[key].Name);
		//add the unit to the deck
		updateAllDeckCells();
		if (remCoreUnits > 0) {
			remCoreUnits--;
		}
		else coreP.classList.add('outofStock');
		//add a class to all buttons in the core building that are out of stock which we will turn grey from css
		Object.keys(unitJson).forEach((key) => {
			if (unitJson[key].Building == 'Foundry')
				if (remFoundryUnits > 0 && remTotalFoundryUnits > 0) {
					remFoundryUnits--;
					remTotalFoundryUnits--;
				} else {
					console.log('No more Foundry units');
					return;
				}
			else if (unitJson[key].Building == 'Starforge')
				if (remStarforgeUnits > 0 && remTotalStarforgeUnits > 0) {
					remStarforgeUnits--;
					remTotalStarforgeUnits--;
				} else {
					console.log('No more Starforge units');
					return;
				}
			else if (unitJson[key].Building == 'Advanced Foundry')
				if (remAdvFoundryUnits > 0 && remTotalFoundryUnits > 0) {
					remAdvFoundryUnits--;
					remTotalFoundryUnits--;
				} else {
					console.log('No more Advanced Foundry units');
					return;
				}
			else if (unitJson[key].Building == 'Advanced Starforge')
				if (remAdvStarforgeUnits > 0 && remTotalStarforgeUnits > 0) {
					remAdvStarforgeUnits--;
					remTotalStarforgeUnits--;
				} else {
					console.log('No more Advanced Starforge units');
					return;
				}
			addDeckUnit(unitJson[key].Name);
			//iterate through the currentDeckList, if the unit is in the deck, add a class to the button/
			// such as button.classList.add('inDeck'); also add a class if the building is out of stock
			forEach
			//call the updateDeckCellsFunction on the highest index of the currentDeckList
			updateDeckCells(currentDeckList.length - 1, unitJson[key].Name);
			updateAllDeckCells();
		})
	};
	var mouseOverFunction = () => {
		console.log('Mouse over ' + unitJson[key].Name);
		addUnitPropertiesByName(unitJson[key].Name);
		updateDeckStats();
	};
	if (unitJson[key].Name != '') {
		if (unitJson[key].Building == 'Core') {
			addButton(unitJson[key].Name, onClickFunction, coreP, mouseOverFunction);
		} else if (unitJson[key].Building == 'Foundry') {
			addButton(unitJson[key].Name, onClickFunction, foundryP, mouseOverFunction);
		} else if (unitJson[key].Building == 'Starforge') {
			addButton(unitJson[key].Name, onClickFunction, starforgeP, mouseOverFunction);
		} else if (unitJson[key].Building == 'Advanced Foundry') {
			addButton(unitJson[key].Name, onClickFunction, advFoundryP, mouseOverFunction);
		} else if (unitJson[key].Building == 'Advanced Starforge') {
			addButton(unitJson[key].Name, onClickFunction, advStarforgeP, mouseOverFunction);
		} else {
			//addButton(unitJson[key].Name, onClickFunction, advStarforgeP, mouseOverFunction);
		}
	} else console.log('No name for ' + unitJson[key].Name);
});

deckStatsText.appendChild(document.createElement('br'));
deckStatsText.classList.add('deckStatsText');


var clearDeckButton = document.getElementById('clearDeckButton');
clearDeckButton.addEventListener('click', () => {
	currentDeckList = [];
	updateDeckStats();
	updateAllDeckCells();
});

//console.log(text);
