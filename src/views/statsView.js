/* eslint-disable no-redeclare */
import { sort } from 'fast-sort';
import Chart from 'chart.js/auto';
import { unitViewMode, tableUnitRows, unitCards } from './unitView';
import { decks } from './deckView';
import { locale } from '../locale';
import { unitList, getCurrentUnit } from '../units';
import { myLog, cleanText } from '../utils';

//in some places I'm using this, in others I'm using keys of unit objects or stat labels
var unitStatLabelNames = ['health', 'speed', 'range', 'damage', 'dps', 'damagea', 'dpsa'];

function simpleSort(list, key, sortedArray) {

	var sortedList = []

	sort(list).asc((u) => u[key]).forEach(function (unit) {
		var sortObject = {};
		sortObject.label = unit['name']
		sortObject.data = unit[key];
		sortedArray.push(unit[key])
		sortedList.push(unit.name);
	});
	return sortedList;
}

const statsView = document.createElement('div');
statsView.id = 'statsView-h';
statsView.classList.add('view');
const statsViewHeader = document.createElement('div');
statsViewHeader.classList.add('viewHeader');
statsView.appendChild(statsViewHeader);
const statsContent = document.createElement('div');
statsContent.classList.add('viewContent');
statsContent.id = 'statsContent';
statsView.appendChild(statsContent);

//#region stats-header
var statsMode = 0 //0 = unit, 1 = compare
var compareMode = 0 //0= stats, 1 = resources, 2 = traits
const statsButton = document.createElement('button');
statsButton.innerHTML = locale('unit');
statsButton.id = 'statsButton';
statsButton.classList.add('headerElement');
statsViewHeader.appendChild(statsButton);
//when button is pressed set current mode to unit
statsButton.addEventListener('click', function () {
	statsMode = 0
	statsButton.classList.add('selected');
	compareButton.classList.remove('selected');
	statsModeSelect.disabled = true;
	refreshStatViewContent()
});
const compareButton = document.createElement('button');
compareButton.innerHTML = locale('compare');
compareButton.id = 'compareButton';
compareButton.classList.add('headerElement');
statsViewHeader.appendChild(compareButton);
//when deck 2 is pressed it should set current deck to 1
compareButton.addEventListener('click', function () {
	statsMode = 1;
	statsButton.classList.remove('selected');
	compareButton.classList.add('selected');
	statsModeSelect.disabled = false;
	refreshStatViewContent()
});
statsButton.classList.add('selected');

//dropdown to choose between stats, resource and traits comparison modes
const statsModeSelect = document.createElement('select');
statsModeSelect.disabled = true;
statsModeSelect.id = 'statsModeSelect';
statsModeSelect.classList.add('headerElement');
statsViewHeader.appendChild(statsModeSelect);
//add option to stats mode select for stats, resources and traits
var statsModeSelectOptions = [locale('stats'), locale('resources')]; //todo: add trait comparison
statsModeSelectOptions.forEach(function (option) {
	var optionElement = document.createElement('option');
	optionElement.value = option;
	optionElement.innerHTML = option;
	statsModeSelect.appendChild(optionElement);
});
//when an option is selected, set compareMode to the selected index
statsModeSelect.addEventListener('change', function () {
	compareMode = statsModeSelect.selectedIndex;
	refreshStatViewContent()
});

//#endregion



const minValues = [];
const maxValues = [];

//for each unit in unitlist
for (var unit of unitList) {
	myLog(unit);
	for (var [key, value] of Object.entries(unit)) {
		if (key == 'health' || key == 'damage' || key == 'damagea' || key == 'speed' || key == 'range' || key == 'dps' || key == 'dpsa') {
			if (minValues[key] == undefined || value <= minValues[key]) {
				minValues[key] = value;
				//if (key == 'speed') myLog(key, minValues[key]);
			}
			if (maxValues[key] == undefined || value > maxValues[key]) {

				if (key == 'health') maxValues[key] = 13000;
				else if (key == 'dps') maxValues[key] = 1800;
				else if (key == 'dpsa') maxValues[key] = 800;
				else maxValues[key] = value;
			}
		}
	}
}
myLog('minvalues', minValues);
myLog('maxvalues', maxValues);


//#region stats-content


var sortedUnitData = {
	health: [],
	speed: [],
	range: [],
	damage: [],
	dps: [],
	damagea: [],
	dpsa: [],
}
var sortData = {
	health: simpleSort(unitList, 'health', sortedUnitData.health),
	damage: simpleSort(unitList, 'damage', sortedUnitData.damage),
	damagea: simpleSort(unitList, 'damagea', sortedUnitData.damagea),
	speed: simpleSort(unitList, 'speed', sortedUnitData.speed),
	range: simpleSort(unitList, 'range', sortedUnitData.range),
	dps: simpleSort(unitList, 'dps', sortedUnitData.dps),
	dpsa: simpleSort(unitList, 'dpsa', sortedUnitData.dpsa),
}



//returns a colour on a gradient scale from red to green based on the value
function getColour(value, min, max) {
	if (value <= 0 || value == null) return 'black';
	//myLog('getColour:', value, min, max);
	var red = 0;
	var green = 0;
	//if value is less than min, return red
	if (value <= min) {
		red = 255;
		green = 0;
	}
	//if value is greater than max, return green
	else if (value >= max) {
		red = 0;
		green = 255;
	}
	//if value is between min and max, return a colour between red and green
	else {
		red = 255 - Math.round((value - min) / (max - min) * 255);
		green = Math.round((value - min) / (max - min) * 255);
	}
	//myLog('FJSDKALFJKL;SADFJSKLADFJKLASDFJKLADSFJKLADSFJNMKLSADF');
	//myLog('rgb(' + red + ', ' + green + ', 0)')
	return 'rgb(' + red + ', ' + green + ', 0)';

}


//data is sortdata for the label, 
function sortColors(Unit, label) {
	//get the unit by the unitName 
	//myLog('sortColors:', Unit, data, label);
	//myLog('huh?: ', Unit[label], minValues[label], maxValues[label]);
	var color = getColour(Unit[label], minValues[label], maxValues[label]);
	var sortedColors = [];

	var rank = sortedUnitData[label].length - sortedUnitData[label].lastIndexOf(Unit[label]);

	for (let i = 0; i < (sortedUnitData[label].length); i++) {
		if (i < sortedUnitData[label].length - (rank - 1)) sortedColors.push(color);
		else sortedColors.push('black');
	}

	sortedUnitData[label].forEach(function (unit) {
		sortedColors.push(color)
		if (unit == Unit) { //once we reaach the passed unit we set color to black which pushes the rest of the units as black bars
			color = 'black'
		}
	});

	return sortedColors
}


myLog('sorterd unit data')
myLog('------------------------------')
myLog(sortedUnitData)

const statsUnitRightContainer = document.createElement('div');
statsUnitRightContainer.id = 'statsUnitRightContainer';
statsContent.appendChild(statsUnitRightContainer);

const statsUnitTraitsContainer = document.createElement('div');
statsUnitTraitsContainer.id = 'statsUnitTraitsContainer';
statsUnitRightContainer.appendChild(statsUnitTraitsContainer);

var statsUnitTypeDiv = document.createElement('div');
statsUnitTypeDiv.classList.add('statsUnitTypeDiv');
statsUnitTypeDiv.textContent = 'test';
statsUnitTraitsContainer.appendChild(statsUnitTypeDiv);

var statsUnitTraitsDiv = document.createElement('div');
statsUnitTraitsDiv.classList.add('statsUnitTraitsDiv');
statsUnitTraitsContainer.appendChild(statsUnitTraitsDiv);

var statsUnitTraitCountersDiv = document.createElement('div');
statsUnitTraitCountersDiv.classList.add('statsUnitTraitsDiv');
statsUnitTraitsContainer.appendChild(statsUnitTraitCountersDiv);

var statsUnitTraitCounteredByDiv = document.createElement('div');
statsUnitTraitCounteredByDiv.classList.add('statsUnitTraitsDiv');
statsUnitTraitsContainer.appendChild(statsUnitTraitCounteredByDiv);

function updateTraitsContainer(Unit) {
	statsUnitTypeDiv.textContent = locale(Unit.type)
	//display traits as images
	if (Unit.name == 'raider') {
		statsUnitTraitsDiv.textContent = locale('traits') + ': ' + locale('raiderTraits');
		statsUnitTraitCountersDiv.textContent = locale('counters') + ': ' + locale('economy');
		statsUnitTraitCounteredByDiv.textContent = locale('counteredBy') + ': ' + locale('scouting');
	}
	else {
		statsUnitTraitsDiv.textContent = locale('traits') + ': ';
		Unit.traits.forEach(function (trait) {
			var traitImg = document.createElement('img');
			traitImg.classList.add('statsUnitTraitImg');
			traitImg.src = 'images/traits/' + trait + '.png';
			statsUnitTraitsDiv.appendChild(traitImg);
		});

		statsUnitTraitCountersDiv.textContent = locale('counters') + ': ';
		if (Unit.traitcounters) {
			Unit.traitcounters.forEach(function (trait) {
				var traitImg = document.createElement('img');
				traitImg.classList.add('statsUnitTraitImg');
				traitImg.src = 'images/traits/' + trait + '.png';
				statsUnitTraitCountersDiv.appendChild(traitImg);
			});
		}

		statsUnitTraitCounteredByDiv.textContent = locale('counteredBy') + ': ';
		if (Unit.traitcounteredby) {
			Unit.traitcounteredby.forEach(function (trait) {
				var traitImg = document.createElement('img');
				traitImg.classList.add('statsUnitTraitImg');
				traitImg.src = 'images/traits/' + trait + '.png';
				statsUnitTraitCounteredByDiv.appendChild(traitImg);
			});
		}
	}

}


const statsUnitChartContainer = document.createElement('div');
statsUnitChartContainer.id = 'statsUnitChartContainer';
statsUnitRightContainer.appendChild(statsUnitChartContainer);

var statsUnitRankDiv = document.createElement('div');
statsUnitRankDiv.id = 'statsUnitRankDiv';
statsUnitChartContainer.appendChild(statsUnitRankDiv);

var statsUnitRankTextDivs = {}
//for each label add a seperate div to statsUnitRankDiv
//for each label in statsUnitmyLog('statsUnit:', statsUnit); // Check content of statsUnit

for (var i = 0; i < unitStatLabelNames.length; i++) {
	var key = unitStatLabelNames[i];
	var statsUnitRankTextDiv = document.createElement('div');
	statsUnitRankTextDiv.classList.add('statsUnitRankTextDiv');
	statsUnitRankTextDiv.textContent = key; // Use textContent
	statsUnitRankTextDivs[key] = statsUnitRankTextDiv;

	statsUnitRankDiv.appendChild(statsUnitRankTextDiv);

}


const statsUnitBottomContainer = document.createElement('div');
statsUnitBottomContainer.id = 'statsUnitBottomContainer';
statsUnitBottomContainer.innerHTML = '';

const unitOfficialLinkDiv = document.createElement('div');
unitOfficialLinkDiv.id = 'unitOfficialLinkDiv';
const unitOfficialLink = document.createElement('a');
unitOfficialLink.id = 'unitOfficialLink';
unitOfficialLinkDiv.appendChild(unitOfficialLink);
unitOfficialLink.innerHTML = locale('unitLink');
unitOfficialLink.href = '';
unitOfficialLink.target = '_blank'

const statsUnitName = document.createElement('div');
statsUnitName.id = 'statsUnitName';
statsUnitName.innerHTML = 'test';

//using stats and matter div below as a template, make a function that creates such divs for other unit stats

function createStatsUnitBottomDiv(label) {
	var statsUnitDiv = document.createElement('div');
	statsUnitDiv.classList.add('statsUnitResourceDiv');
	var statsUnitImg = document.createElement('img');
	//set the src of the img to the relevant label icon
	if (label == 'Building') {
		statsUnitImg.src = 'images/techtiers/' + 'core' + '.svg';
		statsUnitImg.classList.add('statsUnitBuildingImg')
	}
	else if (label == 'Ability') {
		statsUnitImg.src = 'images/techtiers/' + 'core' + '.svg';
		statsUnitImg.classList.add('statsUnitBuildingImg')
	}
	else {
		statsUnitImg.src = 'images/resources/' + cleanText(label) + '.svg';
		statsUnitImg.classList.add('statsUnitResourceImg');
	}

	//add the img to the matterDivca
	statsUnitDiv.appendChild(statsUnitImg);
	//add a text value to energy div for the units energy value
	var statsUnitValue = document.createElement('div');
	statsUnitValue.id = 'statsUnit' + label + 'Value';
	statsUnitValue.classList.add('statsUnitResourceValue');
	statsUnitDiv.appendChild(statsUnitValue);
	return statsUnitDiv;
}

const statsUnitMatterDiv = createStatsUnitBottomDiv('Matter');
const statsUnitEnergyDiv = createStatsUnitBottomDiv('Energy');
const statsUnitBandwidthDiv = createStatsUnitBottomDiv('Bandwidth');
const statsUnitBuildingDiv = createStatsUnitBottomDiv('Building');
const statsUnitAbilityDiv = createStatsUnitBottomDiv('Ability');


statsUnitBottomContainer.appendChild(statsUnitBuildingDiv);
statsUnitBottomContainer.appendChild(statsUnitName);
statsUnitBottomContainer.appendChild(statsUnitMatterDiv);
statsUnitBottomContainer.appendChild(statsUnitEnergyDiv);
statsUnitBottomContainer.appendChild(statsUnitBandwidthDiv);
statsUnitBottomContainer.appendChild(statsUnitAbilityDiv);
4
var chartDivs = []
var statRankBarCharts = []

//video element
const video = document.createElement('video');
//video source is the units videoTurnaround key
video.src = unitList[1].videoturnaround;
//set video to repeat
video.loop = true;
//crop the right 30% of the video
const videoblind = document.createElement('div');
videoblind.id = 'videoblind';
videoblind.style = 'position: absolute; background-color: black; width: 100%; height: 100%;';

video.id = 'unitVideo';

function updateStatsUnit() {
	statsContent.appendChild(unitOfficialLinkDiv);
	statsContent.appendChild(video);
	//video.play();
	statsContent.appendChild(videoblind);
	statsContent.appendChild(statsUnitBottomContainer);
	statsContent.appendChild(statsUnitRightContainer);
}


function statRankChart(label) {

	var statsUnitChartDiv = document.createElement('div');
	chartDivs.push(statsUnitChartDiv);
	statsUnitChartDiv.classList.add('statsUnitChartDiv');
	statsUnitChartContainer.appendChild(statsUnitChartDiv);
	var barChart = document.createElement('canvas');
	barChart.classList.add('barchart');
	statsUnitChartDiv.appendChild(barChart);

	//create an img element of the relevant label icon
	var img = document.createElement('img');
	img.src = 'images/stats/' + label + '.png';
	img.classList.add('statsUnitChartImages');
	//set img colour using getColour()
	img.style.color = getColour(getCurrentUnit(), sortData[label], maxValues[label]);
	statsUnitChartDiv.appendChild(img);


	var chart = new Chart(barChart, {
		type: 'bar',
		data: {
			//labels: [unitList[1].name],
			//make a label for each unit in the unit lists name
			labels: sortData[label],
			datasets: [{
				label: label,
				//data: [12, 19, 3, 5, 2, 3],
				data: sortedUnitData[label],
				backgroundColor: getColour(getCurrentUnit().label, minValues[label], maxValues[label]), //TODO: GetColour is bugged, should be red to green based on value
				borderWidth: 0
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			barPercentage: 2,
			plugins: {
				tooltip: {
					enabled: false
				},
				legend: {
					display: false
				},
			},
			animation: false,
			scales: {
				//use the max value as the scale for each label from the minValues using the same keys as the data
				//use chartjs knowledge to accomplish this
				y: {
					grid: {
						display: false,
					},
					ticks: {
						display: false,
						suggestedMin: function () {
							return minValues[label];
						},
					},
					max: function () {
						if (label == 'health') return 13000;
						else if (label == 'dps') return 1800;
						else if (label == 'dpsa') return 800;
						else return maxValues[label];
					},
					min: function () {
						if (label == 'speed') return 3;
						else return minValues[label];
					},
				},
				x: {
					grid: {
						display: false,
					},
					ticks: {
						display: false,
					},
					display: false,
				}
			}
		}
	});

	statRankBarCharts[label] = chart;


}

//write a function to update the chart data backgroundColor
function updateStatRankChartColor(Unit, chart, label) {
	chart.data.datasets[0].backgroundColor = sortColors(Unit, label);
	chart.update();
}

//run updateStatRankChartColor on each label
function updateStatRankChartColors(Unit) {
	for (var [key] of Object.entries(sortedUnitData)) {
		updateStatRankChartColor(Unit, statRankBarCharts[key], key);
	}
}


//draw stat rank charts
for (var [key] of Object.entries(sortedUnitData)) {
	//myLog(key);
	statRankChart(key);
}

var prespan = '<span class = "rankchartsuperscript">';
var postspan = '</span>';
//add 'st', 'nd', 'rd', 'th' to the rank based on the rank number
function getRankSuffix(rank) {
	//if rank ends in 1
	var output = '';
	if (rank == 11 || rank == 12 || rank == 13) output = 'th';
	else if (rank % 10 == 1) output = 'st';
	//if rank ends in 2
	else if (rank % 10 == 2) output = 'nd';
	//if rank ends in 3
	else if (rank % 10 == 3) output = 'rd';
	else output = 'th';
	//add a HTML span lement to adjust the size of the text before and after the output
	output = prespan + output + postspan;
	return output;
}

function updateStatsUnitBottomContainer(name, matter, energy, bandwidth, building, ability) {
	statsUnitName.innerHTML = locale(name);
	//get the div by its id
	statsUnitMatterDiv.children[1].innerHTML = matter;
	statsUnitEnergyDiv.children[1].innerHTML = energy;
	statsUnitBandwidthDiv.children[1].innerHTML = bandwidth;
	statsUnitBuildingDiv.children[0].src = 'images/techtiers/' + building + '.svg';
	if (ability != ' ') {
		//show the element
		statsUnitAbilityDiv.children[0].style.display = 'inline';
		statsUnitAbilityDiv.children[0].src = 'images/abilities/' + ability + '.png';
	} else {
		//hide the element
		statsUnitAbilityDiv.children[0].style.display = 'none';
	}
}

var prevMouseoverUnit = null;


//#region unitMouseOverAndTapped here is the function which updates all the stat view divs when a unit is mouseOvered (either in deck or unit views)

function unitMouseOverAndTapped(unit) {
	if (!unit) return;
	if (prevMouseoverUnit == unit) {
		//skip this if it's the same unit, to prevent duplicate loadings of the video for same unit
		return;
	}
	prevMouseoverUnit = unit;
	//myLog(e.target.id);
	//add a mouseOverHighlighted class to the unit row in the unit table using tableUnitRows
	//remove the mouseOverHighlighted class from all other unit rows

	if (unitViewMode == 0) //if in table view
	{
		for (var [key] of Object.entries(tableUnitRows)) {
			tableUnitRows[key].classList.remove('mouseOverHighlighted');
		}
		tableUnitRows[unit.name].classList.add('mouseOverHighlighted');
	}
	else if (unitViewMode == 1) //if in card view mode
	{
		//for each unit in unitCards (these are divs), add the same classes above
		for (var [key] of Object.entries(unitCards)) {
			unitCards[key].classList.remove('mouseOverHighlighted');
		}
		unitCards[unit.name].classList.add('mouseOverHighlighted');
	}
	//get the unit from unit list by its name

	//return if in stats mode After mouseover highlight class added above
	if (statsMode != 0) return; //exits if in deck compare mode for the stats view

	//statsUnitName.innerHTML = e.target.id + '   ' + unit.matter + ' ' + unit.energy;
	//do the same as above, but add the matter and energy images before the values
	//for each key in statsUnitRankTextDivs, update the divs value to the units rank
	for (var [key] of Object.entries(statsUnitRankTextDivs)) {
		var rank = sortedUnitData[key].length - sortedUnitData[key].lastIndexOf(unit[key]);
		if (unit[key] == 0) statsUnitRankTextDivs[key].innerHTML = '';
		else {
			statsUnitRankTextDivs[key].innerHTML = rank + getRankSuffix(rank);
			//add the value of the key
			statsUnitRankTextDivs[key].innerHTML += ' |<i> ' + unit[key];
		}

	}



	videoblind.style.opacity = 1
	// periodically decrease the opacity of the video blind
	var fadein;
	unitOfficialLink.href = unit.website
	fadein = setInterval(() => {
		videoblind.style.opacity = videoblind.style.opacity -= .01
		if (videoblind.style.opacity <= 0) clearInterval(fadein);
	}, 40);
	//get the unit from unit list by its name
	//update the video source
	function fetchAndPlay() {
		var playVideo = false
		myLog('fetching ' + unit.videoturnaround)
		fetch(unit.videoturnaround)
			.then(response => response.blob())
			.then(blob => {
				if (unit.name == prevMouseoverUnit.name) {
					playVideo = true;
					video.src = URL.createObjectURL(blob);
					myLog(unit.name + ' ' + prevMouseoverUnit.name)
				}
			})
			.then(() => {
				if (playVideo) {
					video.play();
					// Video playback started ;)
					myLog('video playback started for ' + unit.name)
				}
			})
			.catch(() => {
				// Video playback failed ;(
				myLog('video playback failed')
			})
	}
	fetchAndPlay();
	//update the colors in the bar charts based on the unit id
	/**
	function updateChart(chart, label) {
		chart.data.datasets[0].data = sortedUnitData[label];
		chart.data.datasets[0].backgroundColor = sortColors(unit, sortData, label);
		chart.update();
	}
	//update the charts
	for (var [key] of Object.entries(sortedUnitData)) {
		updateChart(statRankBarCharts[key], key);
	} */
	myLog(unit);
	updateStatsUnitBottomContainer(unit.name, unit.matter, unit.energy, unit.bandwidth, unit.building, unit.ability)
	updateStatRankChartColors(unit);
	updateTraitsContainer(unit);
}


//#endregion


var statsComparisonChartContainer = document.createElement('div');
statsComparisonChartContainer.classList.add('comparisonChartContainer');
statsComparisonChartContainer.innerHTML = '';

var resourcesComparisonChartContainer = document.createElement('div');
resourcesComparisonChartContainer.classList.add('comparisonChartContainer');
resourcesComparisonChartContainer.innerHTML = '';

var traitsComparisonChartContainer = document.createElement('div');
traitsComparisonChartContainer.classList.add('comparisonChartContainer');
traitsComparisonChartContainer.innerHTML = 'traitsComparisonChart';


//#region statsComparisonChart "starchart", associated minmax and scaling functions

//create an example star chart in chartjs
//const DATACOUNT = 7;
//const NUMBERCFG = { count: DATACOUNT, min: 0, max: 100 };
var starchartStatsUnit = ['health', 'damage', 'damagea', 'speed', 'range'];
var starchartMinMax = {
	health: [5350, 64100],
	damage: [485, 4600],
	damagea: [0, 2000],
	speed: [26, 95],
	range: [13, 142]
}
var starchartUnitData = [];
const data = {
	labels: starchartStatsUnit,
	datasets: [
		{
			data: [0, 0, 0, 0, 0],
			borderColor: 'rgb(192, 162, 81)',
			backgroundColor: 'rgba(180, 255, 180, 0.137)',
			borderWidth: '8'
		},
	]
};
const data2 = {
	labels: starchartStatsUnit,
	datasets: [
		{
			data: [0, 0, 0, 0, 0],
			borderColor: 'rgb(192, 162, 81)',
			backgroundColor: 'rgba(255, 180, 180, 0.137)',
			borderWidth: '8'
		},
	]
};
starchartUnitData.push(data);
starchartUnitData.push(data2);
var canvases = []
var starcharts = []
function createStarchart(id) {
	canvases[id] = document.createElement('canvas');
	canvases[id].id = 'starchart' + id;
	canvases[id].classList.add('starchart');
	statsComparisonChartContainer.appendChild(canvases[id]);

	starcharts.push(new Chart(canvases[id], {
		type: 'radar',
		data: starchartUnitData[id],
		options: {
			elements: {
				line: {
					borderWidth: 3,
				},
				point: {
					radius: 0
				}
			},
			plugins: {
				// Accessing labels and making them images
				tooltip: {
					enabled: false
				},
				legend: {
					display: false
				},
			},
			scales: {
				r: {
					min: 0,
					max: 1,
					ticks: {
						display: false,
						maxTicksLimit: 10,
					},
					pointLabels: {
						display: false
					},
					grid: {
						circular: true,
						color: 'rgba(255, 255, 255, .1)'
					}
				},
			}
		}
	}));
}

function doScaling(deckID, input, min, max) { //given an input value, and a minimum and maximum, return a float such that  then the value is at the minimum value 0 is the returned value and when the value is at the maximum value 1 is the max
	var sf = (.125) * decks[deckID].length; //scale factor\
	var deckLength = 0
	//iterate through deck if slot not empty add to legnth var
	for (var i = 0; i < decks[deckID].length; i++) {
		if (decks[deckID][i] != undefined) deckLength++;
	}
	myLog('deck ' + deckID + ' length:' + deckLength)
	myLog('SF: ' + sf);
	var Min = min * sf
	var Max = max * sf
	var value = (input - Min) / (Max - Min);
	myLog(input, min, max, value);
	if (value < 0) value = 0;
	return value;
}

var deck1StatTotals = [];
var deck2StatTotals = [0, 0, 0, 0, 0];
function scaleDeckTotals(d, deckID) {
	//deck count scale factor
	starchartStatsUnit.forEach(function (stat, index) {
		d[index] = doScaling(deckID, d[index], starchartMinMax[stat][0], starchartMinMax[stat][1]);
	});
}


function updateDeckStatTotals(d, deckID) {
	//for each label in statsUnit, add the total of values of the stats for each unit in the deck
	//console.log('totals array: ' + d)
	//console.log(d);
	myLog('deck ' + deckID)
	myLog(decks[deckID]);
	starchartStatsUnit.forEach(function (label) {
		var total = 0;
		decks[deckID].forEach(function (unit) {
			total += (parseFloat(unit[label]) || 0);
		});
		d.push(total);
	});
}

function updateStarchartData() {
	deck1StatTotals = [];
	deck2StatTotals = [];
	updateDeckStatTotals(deck1StatTotals, 0);
	updateDeckStatTotals(deck2StatTotals, 1);
	scaleDeckTotals(deck1StatTotals, 0);
	scaleDeckTotals(deck2StatTotals, 1);
	starcharts[0].data.datasets[0].data = deck1StatTotals;
	starcharts[1].data.datasets[0].data = deck2StatTotals;
	starcharts[0].update();
	starcharts[1].update();
}

//#endregion

//#region resourcesComparisonChartContainer

var resourceChart
function createResourceChart(id) {
	var canvas = document.createElement('canvas');
	canvas.id = 'resourceChart' + id;
	canvas.classList.add('resourceChart');
	resourcesComparisonChartContainer.appendChild(canvas);
	var c1 = 'rgba(180, 255, 180, 0.05)';
	var c2 = 'rgba(255, 180, 180, 0.05)';
	var resourceChart = new Chart(canvas, {
		type: 'bar',
		data: {
			labels: ['T1', 'T2', 'T3', 'T1', 'T2', 'T3'],
			datasets: [
				{
					label: 'Bandwidth',
					grouped: false,
					type: 'bar',
					data: [6, 22, 30],
					borderColor: 'rgba(255, 206, 86, 1)',
					backgroundColor: [c1, c1, c1, c2, c2, c2],
					borderWidth: 2,
					yAxisID: 'test2'
				},
				{
					label: 'Energy',
					type: 'bar',
					grouped: false,
					data: [100, 250, 200],
					borderColor: 'rgba(54, 162, 235, 1)',
					backgroundColor: [c1, c1, c1, c2, c2, c2],
					position: 'right',
					borderWidth: 2,
					yAxisID: 'test1'
				},
				{
					label: 'Matter',
					grouped: false,
					type: 'bar',
					data: [150, 350, 500],
					borderColor: 'rgba(255, 99, 132, 1)',
					backgroundColor: [c1, c1, c1, c2, c2, c2],
					borderWidth: 2,
					yAxisID: 'test1'
				},
			]
		},
		options: {
			scales: {
				test1: {
					display: false
				},
				test2: {
					display: false
				},
				x: {
					ticks: {
						color: 'rgba(255, 255, 255, .8)',
						font: {
							size: 14
						}
					}

				}
			},
			plugins: {
				legend: {
					labels: {
						color: 'rgba(255, 255, 255, .8)',
						font: {
							size: 14
						}
					}
				},
			},
		}
	});
	return resourceChart;
}
resourceChart = createResourceChart(0)
var matterValues = []
var energyValues = []
var bandwidthValues = []

//calculate tier values based off the total matter, energy and bandwidth for units in each tier
//add units in the deck with tier 1 and push their matter, energy and bandwidth values to the respective arrays
function calculateTierValues() {
	//for each unit in the deck, add its tier values to the respective arrays
	var t1Totals = [0, 0, 0, 0, 0, 0];
	var t2Totals = [0, 0, 0, 0, 0, 0];
	var t3Totals = [0, 0, 0, 0, 0, 0];
	function perDeck(deckID, t1, t2, t3) {
		for (var i = 0; i < decks[deckID].length; i++) {
			var unit = decks[deckID][i];
			var x = (3 * deckID);
			if (unit) {
				if (unit.tier == 1) {
					t1[0 + x] += unit.bandwidth;
					t1[1 + x] += unit.energy;
					t1[2 + x] += unit.matter;
				}
				else if (unit.tier == 2) {
					t2[0 + x] += unit.bandwidth;
					t2[1 + x] += unit.energy;
					t2[2 + x] += unit.matter;
				}
				else if (unit.tier == 3) {
					t3[0 + x] += unit.bandwidth;
					t3[1 + x] += unit.energy;
					t3[2 + x] += unit.matter;
				}
			}
		}
	}
	myLog(t1Totals, t2Totals, t3Totals)
	perDeck(0, t1Totals, t2Totals, t3Totals)
	perDeck(1, t1Totals, t2Totals, t3Totals)
	matterValues = [t1Totals[0], t2Totals[0], t3Totals[0], t1Totals[3], t2Totals[3], t3Totals[3]]
	energyValues = [t1Totals[1], t2Totals[1], t3Totals[1], t1Totals[4], t2Totals[4], t3Totals[4]];
	bandwidthValues = [t1Totals[2], t2Totals[2], t3Totals[2], t1Totals[5], t2Totals[5], t3Totals[5]];
}



function updateResourceCharts() {
	calculateTierValues()
	resourceChart.data.datasets[0].data = matterValues;
	resourceChart.data.datasets[1].data = energyValues;
	resourceChart.data.datasets[2].data = bandwidthValues;
	resourceChart.update();
}



//#endregion

//#region traitsComparisonChartContainer

function updateTraitsChart() {
	myLog('todo');
}

//#endregion

function updateComparisonCharts() //called when a unit is added/removed from the deck, calls the current comparion charts update function
{
	if (statsMode == 1) {
		if (compareMode == 0) updateStarchartData();
		else if (compareMode == 1) updateResourceCharts();
		else if (compareMode == 2) updateTraitsChart();

	}
}

function refreshStatViewContent() {
	while (statsContent.firstChild) {
		statsContent.removeChild(statsContent.firstChild);
	};
	if (statsMode == 0) {
		updateStatsUnit();
	}
	if (statsMode == 1) {
		if (compareMode == 0) {
			updateStarchartData();
			statsContent.appendChild(statsComparisonChartContainer);
		}
		else if (compareMode == 1) {
			updateResourceCharts();
			statsContent.appendChild(resourcesComparisonChartContainer);
		}
		else if (compareMode == 2) {
			statsContent.appendChild(traitsComparisonChartContainer);
		}
		//updateComparisonChart();
		//remove all children from statsContent

	}
}

//#endregion

export { statsView, updateComparisonCharts, unitMouseOverAndTapped, createStarchart, updateResourceCharts, refreshStatViewContent }