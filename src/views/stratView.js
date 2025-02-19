/* eslint-disable no-unused-vars */
import { Chart } from "chart.js";
import { makeBtn, makeDiv, makeImg, makeP } from "../utils";
import { decks, currentDeck, decklistDropdown, deckSearchInputElement } from "./deckView"
import { locale } from "../locale";

//#region definitions

const stratView = makeDiv('view', 'stratView-h')
const stratViewHeader = makeDiv('viewHeader', 'stratHeader', stratView);
const stratViewContent = makeDiv('viewContent', 'stratContent', stratView);

//add the decklist dropdown and input element to the header
function stratInit() {
	stratViewHeader.appendChild(decklistDropdown);
	stratViewHeader.appendChild(deckSearchInputElement);
}
var currentTime = 0; //game time in seconds
var currentM = 0;
var currentE = 0;
var currentWorkerCount = 0;

//these will determing the min max (set by user) to fix the Y scaling
var chartMinTime = 0;
var chartMaxTime = 0;

//game constants
const coreWorkerCount = 32;
const expansionWorkerCount = 16;
const workerSpawnTime = 60;
const techCompleteTime = 60;

const initialMatter = 400;
const initialEnergy = 400;
const expandCostE = 400; //used for both expands and techs
const expandCostM = 400; //unless this ever changes

const matterPerWorker = .75;
const energyPerWorker = .3;

const gameLength = 600;

const coreWorkerStopTime = 480;

//each of these arrays have the value of the variable at the index of the time in seconds
const matter = [];
const energy = [];
const workerCounts = [];
const expandTimings = []; //the time each expand or tech is started in seconds are stored in the array
const techTimings = [];
const chartBarData = [];
const offsetMatter = [];
const offsetEnergy = [];
const tempMatter = [];
const tempEnergy = [];

for (let i = 0; i < gameLength; i++) {
	matter.push(0);
	energy.push(0);
	workerCounts.push(0);
	offsetMatter.push(0);
	offsetEnergy.push(0);
	tempMatter.push(0);
	tempEnergy.push(0);
}

//initialise an array of 8 values all set to 0 named units
const units = [];
for (let i = 0; i < 8; i++) {
	units.push(0);
}

//#endregion



const gameTimeContainer = makeDiv('stratTimeContainer', null, stratViewContent);
const buttonsContainer = makeDiv('stratButtonsContainer', null, stratViewContent);
const resourceContainer = makeDiv('stratResourceContainer', null, buttonsContainer);
const chartContainer = makeDiv('stratChartContainer', null, stratViewContent);

//make buttons for tech and expansion and add to buttons container
const techButton = makeBtn('tech', 'techButton', function () {
	console.log('tech pressed');
	updateCurrents();
	if (currentE >= expandCostE && currentM >= expandCostE) {
		techTimings.push(currentTime);
		updateCurrents();
	} else {
		console.log('not enough resources');
	}
	calculateMatterAndEnergy();
	updateCurrents();
	updateChart();
	console.log(techTimings);
});
const expandButton = makeBtn('expand', 'expandButton', function () {
	console.log('expand pressed');
	updateCurrents();
	if (currentE >= expandCostE && currentM >= expandCostE) {
		expandTimings.push(Number(currentTime));
	} else {
		console.log('not enough resources');
	}
	calculateMatterAndEnergy();
	updateCurrents();
	updateChart();
	console.log(expandTimings);
});
buttonsContainer.appendChild(techButton)
buttonsContainer.appendChild(expandButton)

//for each unit in the current deck add a button with its image
const unitsContainer = makeDiv('stratUnitsContainer', null, buttonsContainer)

//#region unitButtons
function updateUnits() {
	console.log('huhgghghgh?');
	console.log(decks);
	//clear the units container
	unitsContainer.innerHTML = '';
	for (let i = 0; i < decks[currentDeck].length; i++) {
		const unit = decks[currentDeck][i];
		const unitButton = makeBtn(null, 'unitButton');
		unitButton.id = 'stratUnitBtn' + i;
		unitButton.addEventListener('click', function () {
			console.log('unit button pressed');
			console.log(unit.name);
			//if we can afford to build the unit based on its cost
			if (currentM >= unit.matter && currentE >= unit.energy) {
				units[i]++;
				offsetMatter[currentTime] += unit.matter;
				offsetEnergy[currentTime] += unit.energy;
				calculateMatterAndEnergy(unitButton);
			};
		});
		//unitButton.style.backgroundImage = 'url(' + unit.image + ')';
		//add an image element to the button of the unit image
		makeImg('images/units/' + unit.image + '.png', 'stratUnitImage', null, unitButton, null);
		unitsContainer.appendChild(unitButton);
		unitsContainer.appendChild(makeP('stratUnitName', null, unitButton, 'x' + units[i]));
	}
}

//#endregion

//add matter and resource images with currentMatter and currentEnergy values next to them to the resourceContainer div
const matterDiv = makeDiv('stratResourceDiv', 'matterDiv', resourceContainer);
const energyDiv = makeDiv('stratResourceDiv', 'energyDiv', resourceContainer);
const workerDiv = makeDiv('stratResourceDiv', 'workerDiv', resourceContainer);
const matterImg = makeImg('images/resources/matter.svg', 'stratResourceImg', 'matterImg', matterDiv, null);
const energyImg = makeImg('images/resources/energy.svg', 'stratResourceImg', 'energyImg', energyDiv, null);
const matterText = makeDiv('matterText', null, matterDiv);
const energyText = makeDiv('energyText', null, energyDiv);

function updateCurrents() {
	currentE = energy[currentTime];
	currentM = matter[currentTime];
	matterText.textContent = Math.round(matter[currentTime]);
	energyText.textContent = Math.round(energy[currentTime]);
	workerDiv.textContent = 'W ' + workerCounts[currentTime];
}

const gameTimeDiv = makeDiv('stratViewTime', 'stratViewTime', gameTimeContainer);
const updateGameTimeDiv = (value) => {
	//convert value to minutes and seconds
	const minutes = Math.floor(value / 60);
	const seconds = value % 60;
	//update the div
	gameTimeDiv.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
//create a dragable bar input range element that allows the gameTime to be set between 0 and 600
const stratViewTimeInput = document.createElement('input');
stratViewTimeInput.type = 'range';
stratViewTimeInput.min = 0;
stratViewTimeInput.max = gameLength;
stratViewTimeInput.value = currentTime;
stratViewTimeInput.classList.add('stratViewTimeInput');
stratViewTimeInput.addEventListener('input', function () {
	currentTime = Number(stratViewTimeInput.value);
	//update the game time div
	updateGameTimeDiv(currentTime);
	updateCurrents();
	calculateMatterAndEnergy();
	updateChart();
});
updateGameTimeDiv(currentTime);
gameTimeContainer.appendChild(stratViewTimeInput);

//#region calculations
function calculateMatterAndEnergy(_unitbutton) {
	//switch to using temp vars for checking
	matter.forEach((value, index) => {
		tempMatter[index] = value;
	});
	energy.forEach((value, index) => {
		tempEnergy[index] = value;
	});
	//calculate the matter and energy for the current time
	tempMatter[0] = initialMatter;
	tempEnergy[0] = initialEnergy;
	workerCounts[0] = coreWorkerCount;

	var success = true //for checking if less than 0
	const max = Math.max(...matter, ...energy) //calculate the maximum y value used for the vertical line

	//loop through resource arrays to adjust them based upon the offsets
	for (let i = 0; i < gameLength - 1; i++) {

		//#tag currentTimeBar
		//set the data for the vertical line (bar chart data)
		if (i == currentTime) chartBarData[i] = max;
		else chartBarData[i] = 0;

		if (i > 0) {
			workerCounts[i] = workerCounts[i - 1]
			tempMatter[i] = (tempMatter[i - 1] + (workerCounts[i] * matterPerWorker)) - offsetMatter[i];
			tempEnergy[i] = (tempEnergy[i - 1] + (workerCounts[i] * energyPerWorker)) - offsetEnergy[i];
		}
		if (i == coreWorkerStopTime) {
			workerCounts[i] -= coreWorkerCount;
			if (workerCounts[i] < 0) {
				workerCounts[i] = 0;
			}
		}
		for (let j = 0; j < expandTimings.length; j++) {
			//console.log(expandTimings[j] + 60);
			if (i == (Number(expandTimings[j] + workerSpawnTime))) {
				workerCounts[i] += expansionWorkerCount;
			}
			if (i == expandTimings[j]) {
				tempMatter[i] -= expandCostM;
				tempEnergy[i] -= expandCostE;
			}
		}
		for (let j = 0; j < techTimings.length; j++) {
			if (i == techTimings[j]) {
				tempMatter[i] -= expandCostM;
				tempEnergy[i] -= expandCostE;
			}
		}
		if (tempMatter[i] < 0 || tempEnergy[i] < 0) {
			success = false;
		}
	}
	if (success) {
		matter.forEach((value, index) => {
			matter[index] = tempMatter[index];
		});
		energy.forEach((value, index) => {
			energy[index] = tempEnergy[index];
		});
	}
	else {
		//add a red bg style to unitbutton
		if (_unitbutton != null) {
			console.log('')
			_unitbutton.classList.add('stratUnitButtonRed');
		}

	}
	updateCurrents();
}
calculateMatterAndEnergy();
updateCurrents();

//#endregion

const canvas = document.createElement('canvas');
canvas.id = 'stratChart';
//create line chart using chart js of the matter and energy

const chart = new Chart(canvas, {
	data: {
		labels: Array.from(Array(gameLength).keys()),
		datasets: [{
			type: 'line',
			label: 'Matter',
			data: matter,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderWidth: 2,
			pointRadius: 0, // Disable points
			fill: true,
		}, {
			type: 'line',
			label: 'Energy',
			data: energy,
			borderColor: 'rgb(54, 162, 235)',
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			borderWidth: 2,
			pointRadius: 0, // Disable points
			fill: true,
		}, {
			type: 'line',
			label: 'Workers',
			//multiply each value in the array by 10
			data: workerCounts.map((x) => x * 10),
			borderColor: 'rgb(255, 206, 86)',
			backgroundColor: 'rgba(255, 206, 86, 0.5)',
			borderWidth: 2,
			pointRadius: 0, // Disable points
			fill: false,
		}, {
			type: 'bar',
			label: '',
			data: chartBarData,
			barThickness: 1,
			backgroundColor: 'white',
			fill: true,
			tension: 0
		}]
	},
	options: {
		responseive: true,
		maintainAspectRatio: false,
		elements: {
			line: {
				borderWidth: 0.1, // Allow sub-pixel line width
			},
		},
		plugins: {
			legend: {
				display: true,
				labels: {
					// Custom generateLabels to exclude specific datasets
					generateLabels: (chart) => {
						return chart.data.datasets
							.map((dataset, i) => ({
								text: dataset.label,
								fillStyle: dataset.borderColor,
								hidden: !chart.isDatasetVisible(i),
								fontColor: 'white',
								index: i,
							}))
							.filter((item) => item.text !== ''); //hide bar legend
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true
			}
		}
		//disable animation for dataset 4
		, animation: {
			duration: 0
		}
	}
});
chartContainer.appendChild(canvas);
chart.resize();

//create a function to update the data of the chart
function updateChart() {
	chart.data.datasets[0].data = matter;
	chart.data.datasets[1].data = energy;
	chart.data.datasets[2].data = workerCounts.map((x) => x * 10);
	chart.data.datasets[3].data = chartBarData;
	chart.update();
	updateUnits();
}


export { stratView, updateUnits, stratInit }