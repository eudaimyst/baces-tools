/* eslint-disable no-unused-vars */

import { makeBtn, makeDiv, makeImg } from "../utils";

const stratView = makeDiv('view', 'stratView-h')
const stratViewHeader = makeDiv('viewHeader', 'stratHeader', stratView);
const stratViewContent = makeDiv('viewContent', 'stratContent', stratView);

var currentTime = 0; //game time in seconds
var currentMatter = 0;
var currentEnergy = 0;
var currentWorkerCount = 0;

const coreWorkerCount = 32;
const expansionWorkerCount = 16;
const workerSpawnTime = 60;

const initialMatter = 400;
const initialEnergy = 400;
const expandCostEnergy = 400;
const expandCostMatter = 400;
const techCostEnergy = 400;
const techCostMatter = 400;

const matterPerWorker = .75;
const energyPerWorker = .3;

const gameLength = 600;
const coreWorkerStopTime = 480;

const matter = [];
const energy = [];
const workerCounts = [];
const expandTimings = []; //the time each expand or tech is started in seconds are stored in the array
const techTimings = [];


const gameTimeContainer = makeDiv('stratTimeContainer', null, stratViewContent);
const buttonsContainer = makeDiv('stratButtonsContainer', null, stratViewContent);
const resourceContainer = makeDiv('stratResourceContainer', null, buttonsContainer);
const chartContainer = makeDiv('stratChartContainer', null, stratViewContent);

//make buttons for tech and expansion and add to buttons container
const techButton = makeBtn('tech', 'techButton', function () {
	console.log('tech pressed');
});
const expandButton = makeBtn('expand', 'expandButton', function () {
	console.log('expand pressed');
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
	currentTime = stratViewTimeInput.value;
	//update the game time div
	updateGameTimeDiv(currentTime);
	updateCurrents();
});
updateGameTimeDiv(currentTime);
gameTimeContainer.appendChild(stratViewTimeInput);


function calculateMatterAndEnergy() {
	//calculate the matter and energy for the current time
	for (let i = 0; i < gameLength; i++) {
		workerCounts[i] = coreWorkerCount;
	}
	matter[0] = initialMatter;
	energy[0] = initialEnergy;
	for (let i = 1; i < gameLength; i++) {
		matter[i] = (matter[i - 1] || 0) + (workerCounts[i] * matterPerWorker);
		energy[i] = (energy[i - 1] || 0) + (workerCounts[i] * energyPerWorker);
	}
}
calculateMatterAndEnergy();
updateCurrents();


export { stratView }