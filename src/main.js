//create 3 divs called unitView, deckView and statsView, and a wrapper to contain them

import { sidebar, updateBG } from './menu';
import { deckView } from './views/deckView';
import { unitView, unitsInit } from './views/unitView';
import { units, setCurrentUnit } from './units';
import { myLog } from './utils';
import {
	unitMouseOverAndTapped,
	statsView
} from './views/statsView';
import { stratView } from './views/stratView';

var unitList = Object.values(units);

const wrapper = document.createElement('div');
wrapper.id = 'wrapper';
const app = document.createElement('div');
app.id = 'app';
wrapper.appendChild(sidebar);
updateBG(wrapper); //needs to load the background After wrapper has been created
wrapper.appendChild(app);

document.body.appendChild(wrapper);

setCurrentUnit(unitList[0]);

var oldE = null
function unitMouseOver(e) {
	if (e.target.id == oldE) return;
	oldE = e.target.id;
	var unit = units[e.target.id];
	setCurrentUnit(unit);
	unitMouseOverAndTapped(unit);
}


//change view id's when page is resized
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
window.addEventListener('resize', resize);
//set the initial fragment identifier else if ()
function loadPage() {
	const suffix = window.location.hash.slice(1); // Remove the '#'
	console.log('Current suffix:', suffix);
	//loop through children of app and remove them from the dom using for each
	for (var i = app.children.length - 1; i >= 0; i--) {
		app.removeChild(app.children[i]);
	}
	if (window.location.hash == '') {
		window.location.hash = 'deckbuilder';
	}
	if (suffix == 'deckbuilder') {
		unitsInit(unitMouseOver); //also redraws unit content after decks have been initialised
		app.appendChild(unitView);
		app.appendChild(deckView);
		app.appendChild(statsView);
	}
	else if (suffix == 'stratplanner') {
		app.appendChild(stratView);
	}
	resize();
}
loadPage();
// Read the fragment identifier
window.addEventListener('hashchange', () => {
	loadPage();
});

