//create 3 divs called unitView, deckView and statsView, and a wrapper to contain them

import { sidebar, updateBG } from './menu';
import { deckView } from './views/deckView';
import { redrawUnitContent, unitView, unitsInit } from './views/unitView';
import { locale } from './locale';
import { units, setCurrentUnit } from './units';
import { myLog } from './utils';
import {
	unitMouseOverAndTapped,
	statsView,
	createStarchart,
	updateResourceCharts,
	refreshStatViewContent,
} from './views/statsView';

var unitList = Object.values(units);


//#region views-contents-headers definitions for all 3 views



//add a banner that says the unit content is out of date
//if the unit content is out of date
var unitContentOutOfDate = false;
if (unitContentOutOfDate) {
	var outOfDateBanner = document.createElement('div');
	outOfDateBanner.classList.add('outOfDateBanner');
	outOfDateBanner.textContent = locale("statsOutdated");
	//make the banner the will width of the parent div and only the height of the text
	//unitView.appendChild(outOfDateBanner);
	//make the div a clickable link to 
	//when the div is clicked, open the link in a new tab
	outOfDateBanner.addEventListener('click', function () {
		window.open('https://www.reddit.com/r/BattleAces/comments/1gly8hp/balanceUpdateTomorrow_118/', '_blank');
	});
	//change the icon cursor the standard hyperlink cursor
	//make the banner text bold
	outOfDateBanner.style.cursor = 'pointer';
}



const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
const app = document.createElement('div');
app.id = 'app';
wrapper.appendChild(sidebar);
updateBG(wrapper); //needs to load the background After wrapper has been created
wrapper.appendChild(app);

//#endregion

document.body.appendChild(wrapper);



//#region window-resize

//create a function that runs when the window is resized
function resize() {
	myLog('resized');
	//get the width and height of the window
	const width = window.innerWidth;
	const height = window.innerHeight;
	if (width > height) {
		unitView.id = 'unitView-h';
		deckView.id = 'deckView-h';
		statsView.id = 'statsView-h';
	} else {
		unitView.id = 'unitView-v';
		deckView.id = 'deckView-v';
		statsView.id = 'statsView-v';
	}
}

//#endregion

setCurrentUnit(unitList[0]);

var oldE = null
function unitMouseOver(e) {
	//if we are
	if (e.target.id == oldE) return;
	oldE = e.target.id;
	var unit = units[e.target.id];
	setCurrentUnit(unit);
	unitMouseOverAndTapped(unit);
}
/*
deprecated, we now add the listener to the cell when its created
//when a cell in the unit table is mouseover get the unit name from the cell and print to console
var unitTable = document.getElementsByClassName('unitTableNameCell');
for (var i = 0; i < unitTable.length; i++) {
	unitTable[i].addEventListener('mouseover', statRedrawMouseOver);
}
	*/


unitsInit(unitMouseOver);

redrawUnitContent();
unitMouseOverAndTapped(unitList[0]);
createStarchart(0);
createStarchart(1);
updateResourceCharts();
refreshStatViewContent();

//force the page to re-render
//rewrite this to work: $(window).trigger('resize');

window.addEventListener('resize', resize);
resize();


app.appendChild(unitView);
app.appendChild(deckView);
app.appendChild(statsView);