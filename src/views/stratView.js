/* eslint-disable no-unused-vars */
import { Chart } from "chart.js";
import { makeBtn, makeDiv, makeImg } from "../utils";

const stratView = makeDiv('view', 'stratView-h')
const stratViewHeader = makeDiv('viewHeader', 'stratHeader', stratView);
const stratViewContent = makeDiv('viewContent', 'stratContent', stratView);

var currentTime = 0; //game time in seconds
var currentM = 0;
var currentE = 0;
var currentWorkerCount = 0;

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

const matter = [];
const energy = [];
const workerCounts = [];
const expandTimings = []; //the time each expand or tech is started in seconds are stored in the array
const techTimings = [];
const chartBarData = [];


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
	updateChart();
	console.log(techTimings);
});
const expandButton = makeBtn('expand', 'expandButton', function () {
	console.log('expand pressed');
	updateCurrents();
	if (currentE >= expandCostE && currentM >= expandCostE) {
		expandTimings.push(Number(currentTime));
		updateCurrents();
	} else {
		console.log('not enough resources');
	}
	calculateMatterAndEnergy();
	updateChart();
	console.log(expandTimings);
});
buttonsContainer.appendChild(techButton)
buttonsContainer.appendChild(expandButton)

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


function calculateMatterAndEnergy() {
	//calculate the matter and energy for the current time
	matter[0] = initialMatter;
	energy[0] = initialEnergy;
	workerCounts[0] = coreWorkerCount;
	const max = Math.max(...matter, ...energy)
	for (let i = 0; i < gameLength - 1; i++) {
		if (i == currentTime) chartBarData[i] = max;
		else chartBarData[i] = 0;
		if (i > 0) {
			workerCounts[i] = workerCounts[i - 1]
			matter[i] = matter[i - 1] + (workerCounts[i] * matterPerWorker);
			energy[i] = energy[i - 1] + (workerCounts[i] * energyPerWorker);
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
				matter[i] -= expandCostM;
				energy[i] -= expandCostE;
			}
		}
		for (let j = 0; j < techTimings.length; j++) {
			if (i == techTimings[j]) {
				matter[i] -= expandCostM;
				energy[i] -= expandCostE;
			}
		}
	}

	//get the max value of matter and energy arrays and add 10% to it
	updateCurrents();
}
calculateMatterAndEnergy();
updateCurrents();



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
								fontColor: 'white', // Ensure legend text is white
								index: i,
							}))
							.filter((item) => item.text !== ''); // Exclude 'Dataset 2'
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
}


export { stratView }