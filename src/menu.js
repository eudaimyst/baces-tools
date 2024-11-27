
import { locale, setLocale, getLocale, getLocaleList, languageLongNameList } from './locale';

const linkData = [{
	name: 'Battle Aces Official Website',
	url: 'https://www.playbattleaces.com'
}, {
	name: '- Units',
	url: 'https://www.playbattleaces.com/units'
}, {
	name: '- Leaderboards',
	url: 'https://www.playbattleaces.com/leaderboards'
}, {
	name: 'BA Strategy Planner',
	url: 'https://trevorcode.github.io/ba-strategy-planner/'
}, {
	name: 'Crablab.gg',
	url: 'https://crablab.gg/'
}, {
	name: 'SimpleAces',
	url: 'https://jackiefae.github.io/simpleaces.html'
}, {
	name: 'BA Units',
	url: 'https://baunits.com'
}, {
	name: "Empress' Stat Sheet",
	url: 'https://docs.google.com/spreadsheets/d/14bXhjgwADAZbQT-u2X1wj4SF_5uf6C43BsGCa9tFHdo/edit?pli=1&gid=0#gid=0'
}, {
	name: 'BA by Conqueror',
	url: 'https://docs.google.com/spreadsheets/d/1Y5sro2kxbDu2fCmKHcKmEFuzjpDd8SsFaifKDFY1SIg/edit?gid=0#gid=0'
}
]


//# left sidebar (burger menu on vertical)
const sidebar = document.createElement('div');
sidebar.id = 'sidebar';


const sidebarLogoImg = document.createElement('img');
sidebarLogoImg.src = 'images/baces_tools.png';
sidebarLogoImg.alt = 'BACES Tools';

sidebarLogoImg.id = 'sidebarLogoImg';
sidebarLogoImg.style.width = '50px';

sidebar.appendChild(sidebarLogoImg);



//add a button to the sidebar to toggle the sidebar
const toggleSidebarButton = document.createElement('button');
toggleSidebarButton.id = 'toggleSidebarButton';
sidebar.classList.add('sidebarInactive');
sidebar.appendChild(toggleSidebarButton);
//create a button image and add it to the toggleSidebarButton
const toggleSidebarButtonImg = document.createElement('img');
toggleSidebarButtonImg.src = 'images/burgericon.png';
toggleSidebarButtonImg.classList.add('sidebarBtnImg');
toggleSidebarButton.appendChild(toggleSidebarButtonImg);


const deckBuilderBtn = document.createElement('button');
deckBuilderBtn.id = 'toggleSidebarButton';
sidebar.appendChild(deckBuilderBtn);
//create a button image and add it to the toggleSidebarButton
const deckBuilderButtonImg = document.createElement('img');
deckBuilderButtonImg.src = 'images/pageicons/deckbuilder.png';
deckBuilderButtonImg.classList.add('sidebarBtnImg');
deckBuilderBtn.appendChild(deckBuilderButtonImg);

deckBuilderBtn.addEventListener('click', () => {
	// Update the fragment identifier
	window.location.hash = 'deckbuilder';

	console.log('URL updated to:', window.location.href);
});

const stratPlannerBtn = document.createElement('button');
stratPlannerBtn.id = 'toggleSidebarButton';
sidebar.appendChild(stratPlannerBtn);
//create a button image and add it to the toggleSidebarButton
const stratPlannerImg = document.createElement('img');
stratPlannerImg.src = 'images/pageicons/resources.png';
stratPlannerImg.classList.add('sidebarBtnImg');
stratPlannerBtn.appendChild(stratPlannerImg);

stratPlannerBtn.addEventListener('click', () => {
	// Update the fragment identifier
	window.location.hash = 'stratplanner';

	console.log('URL updated to:', window.location.href);
});

var sidebarActive = true;
const sidebarTitleDiv = document.createElement('div');
sidebarTitleDiv.id = 'sidebarTitleDiv';
sidebarTitleDiv.innerHTML = '';
const sidebarTitleVDiv = document.createElement('div');
sidebarTitleVDiv.id = 'sidebarTitleDivV';
sidebarTitleVDiv.innerHTML = '';
const sidebarContentDiv = document.createElement('div');
sidebarContentDiv.id = 'sidebarContentDiv';


const sidebarFooterDiv = document.createElement('div');
sidebarFooterDiv.classList.add('sidebarFooterDiv')
const sidebarFooterContents = document.createElement('div');
sidebarFooterDiv.appendChild(sidebarFooterContents);
sidebarFooterContents.innerHTML = "<b>BACES Tools has no association with Uncapped Games. All rights to any game-related content remain the exclusive property of Uncapped Games.";

//make a region element that hides footerContents2 and 3 until it is clicked
const sidebarFooterContentsRegion = document.createElement('div');
sidebarFooterContentsRegion.innerText = '[legal]'
sidebarFooterDiv.appendChild(sidebarFooterContentsRegion);
//set icon to pointer when mouse is over the region
sidebarFooterContentsRegion.style.cursor = 'pointer';
//when region is clicked, toggle the visibility of the children using an event
sidebarFooterContentsRegion.addEventListener('click', function () {
	if (sidebarFooterContents2.style.display == 'none') {
		sidebarFooterContents2.style.display = 'block';
		sidebarFooterContents3.style.display = 'block';
	} else {
		sidebarFooterContents2.style.display = 'none';
		sidebarFooterContents3.style.display = 'none';
	}
});




const sidebarFooterContents2 = document.createElement('div');
sidebarFooterContentsRegion.appendChild(sidebarFooterContents2);
sidebarFooterContents2.classList.add('sidebarExtraSmallFont');
sidebarFooterContents2.style.display = 'none';
sidebarFooterContents2.innerHTML = "This software is provided 'as is' with NO warranty or guarantee regarding the accuracy, completeness, or current relevance of the game data displayed. The use of this software does not grant any rights to the underlying intellectual property or game content of Battle Aces, which remains the sole property of its respective owners.";
const sidebarFooterContents3 = document.createElement('div');
sidebarFooterContentsRegion.appendChild(sidebarFooterContents3);
sidebarFooterContents3.innerHTML = "By using this software, you acknowledge that the developers are not responsible for any claims, liabilities, or damages that may arise from the use of this software. The software is intended solely for informational purposes.";
sidebarFooterContents3.classList.add('sidebarExtraSmallFont');
sidebarFooterContents3.style.display = 'none';
//sidebarFooterDiv.innerHTML = '<b></b>.<br> <br>';


function expandMenu(expand) {
	sidebarLogoImg.style.width = '100%';
	//if the sidebar is inactive, reduce the width to 50px, otherwise restore it to 200px
	if (expand) {
		sidebar.classList.add('sidebarExpanded')
		sidebar.classList.remove('sidebarContracted')
		// wrapper.style.marginLeft = '200px';
		sidebar.appendChild(sidebarTitleDiv);
		sidebar.appendChild(sidebarContentDiv);
		sidebar.appendChild(sidebarFooterDiv);
		// if sidebarTitleVDiv exists in sidebar
		if (sidebar.contains(sidebarTitleVDiv)) {
			sidebar.removeChild(sidebarTitleVDiv);
		};
	} else {
		sidebar.classList.remove('sidebarExpanded')
		sidebar.classList.add('sidebarContracted')
		// wrapper.style.marginLeft = '50px';
		//if children exist
		if (sidebar.children.length > 0) {
			// if it is a child
			if (sidebar.contains(sidebarTitleDiv)) {
				sidebar.removeChild(sidebarTitleDiv);
				sidebar.removeChild(sidebarContentDiv);
				sidebar.removeChild(sidebarFooterDiv);
			}
			sidebar.appendChild(sidebarTitleVDiv);
		}
	}
}
toggleSidebarButton.addEventListener('click', () => {
	sidebarActive = !sidebarActive;
	expandMenu(!sidebarActive);
});
expandMenu(false);

//#tag sidebar-content this is where everything in the sidebar goes


//create a drop down to select a language
const languageSelectDiv = document.createElement('div');
languageSelectDiv.textContent = locale('language') + ': ';
languageSelectDiv.classList.add('languageSelectDiv');
sidebarContentDiv.appendChild(languageSelectDiv);
const languageSelect = document.createElement('select');
languageSelect.classList.add('languageSelect');
languageSelectDiv.appendChild(languageSelect);
//create an option for each language in the localeData array
function createLanguageOption(value, text) {
	const languageSelectOption = document.createElement('option');
	languageSelectOption.value = value;
	languageSelectOption.innerHTML = text;
	languageSelect.appendChild(languageSelectOption);
}
//for each value in localeList
var localeList = getLocaleList();
for (let i = 0; i < localeList.length; i++) {
	createLanguageOption(localeList[i], languageLongNameList[localeList[i]]);
}
//when a language is selected set hte locale
languageSelect.addEventListener('change', () => {
	setLocale(languageSelect.value);
	location.reload();
});
//set the current option to the current locale
languageSelect.value = getLocale();
//create a div which has a menu of links. The div should have a header, which can be clicked to expand, to show the links
const linksDiv = document.createElement('div');
linksDiv.classList.add('linksDiv');
sidebarContentDiv.appendChild(linksDiv);

const linksHeader = document.createElement('div');
linksHeader.classList.add('linksHeader');
linksHeader.innerHTML = locale('links');
linksDiv.appendChild(linksHeader);

const linksContent = document.createElement('div');
linksContent.classList.add('linksContent');
linksDiv.appendChild(linksContent);
//for each link in linkData, create a link
linkData.forEach((link) => {
	const linkElement = document.createElement('a');
	linkElement.href = link.url;
	linkElement.target = '_blank';
	linkElement.innerHTML = link.name + '<br>';
	linksContent.appendChild(linkElement);
});
//add event when links header is pressed
linksHeader.addEventListener('click', () => {
	//toggle the links div
	linksDiv.classList.toggle('linksDivActive');
});

//create a div for a countdown to the beta release date
const countdownDiv = document.createElement('div');
countdownDiv.classList.add('countdownDiv');
//sidebarContentDiv.appendChild(countdownDiv);
const counDownDivCountdownText = document.createElement('p');
counDownDivCountdownText.classList.add('countdownText');
countdownDiv.appendChild(counDownDivCountdownText);
//get the remaining time in days hours minutes and secionds until the 6th of November, 12pm, PST American West Coast using an online time library
//returns a string
/**
function getRemainingTime() {
	const now = new Date();
	const targetDate = new Date('2024-11-06T12:00:00Z');
	const timeDifference = targetDate - now;
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
	//return the remaining time in a string
	return `${days + 1}d ${hours}h ${minutes}m ${seconds}s`;
}

// set countdown div text to the remaining time using the function
setInterval(() => {
	counDownDivCountdownText.innerHTML = 'Release Countdown (estimate):<br>Closed Beta 2: ' + getRemainingTime();
}, 1000);
*/
//create a new div for setting the background image with a select element and append it to sidebarContentDiv 
const bgImgSelectDiv = document.createElement('div');
bgImgSelectDiv.classList.add('bgImgSelectDiv');
sidebarContentDiv.appendChild(bgImgSelectDiv);

//create a select element and append it to bgImgSelectDiv
const bgImgSelect = document.createElement('select');
bgImgSelect.classList.add('bgImgSelect');
bgImgSelectDiv.appendChild(bgImgSelect);

//add a random toggle
const randomToggle = document.createElement('input');
randomToggle.type = 'checkbox';
randomToggle.id = 'randomToggle';
//add a mouseover title that says it will load a random bg on load
randomToggle.title = 'Load a random background each visit';
randomToggle.classList.add('randomToggle');
bgImgSelectDiv.appendChild(randomToggle);
//save the value of the toggle to local storage
randomToggle.addEventListener('change', () => {
	localStorage.setItem('randomToggle', randomToggle.checked);
	//if the random toggle is set to on, set a random background
	//if the random toggle is set to off, set the background to the selected value
	if (randomToggle.checked) {
		updateBG(document.getElementById('wrapper'));
	}
});
//load the value of the toggle from local storage
randomToggle.checked = localStorage.getItem('randomToggle') === 'true';
//if the toggle is checked, load a random background image

function updateBG(wrapper) {

	if (randomToggle.checked) {
		//get a random number between 1 and 19
		const randomNum = Math.floor(Math.random() * 19) + 1;
		//set the background image to the random number
		wrapper.style.backgroundImage = 'url(images/bg/' + randomNum + '.jpg)';
		//set the current option to the randomly selected image
		bgImgSelect.value = 'images/bg/' + randomNum + '.jpg';
		//save the selected value to local storage
		localStorage.setItem('bgImgSelect', bgImgSelect.value);
	}
	else {
		//if there is a value in image select
		if (localStorage.getItem('bgImgSelect')) {
			//if the background image is set to none, set the background color to black
			if (localStorage.getItem('bgImgSelect') == 'none') {
				wrapper.style.backgroundImage = 'none';
			}
			else {
				//set the background image to the value of the select element
				wrapper.style.backgroundImage = 'url(' + localStorage.getItem('bgImgSelect') + ')';
				//set the current option to the value of the select element
				bgImgSelect.value = localStorage.getItem('bgImgSelect');
			}
		}
	}
}
//add a label for the random toggle
const randomToggleLabel = document.createElement('label');
randomToggleLabel.for = 'randomToggle';
randomToggleLabel.innerHTML = locale('random');
bgImgSelectDiv.appendChild(randomToggleLabel);
//create an option element for each background image and append it to bgImgSelect
function createOption(value, text) {
	const bgImgSelectOption1 = document.createElement('option');
	bgImgSelectOption1.value = value;
	bgImgSelectOption1.innerHTML = text;
	bgImgSelect.appendChild(bgImgSelectOption1);
}
//for each background image in the images/bg folder, create an option
for (let i = 1; i <= 19; i++) {
	createOption('images/bg/' + (20 - i) + '.jpg', locale('background') + ' ' + i);
}
//when the select element is changed, set the background image to the selected value
bgImgSelect.addEventListener('change', () => {
	//get the element with the id wrapper
	document.getElementById('wrapper').style.backgroundImage = 'url(' + bgImgSelect.value + ')';
	//save the selected value to local storage
	localStorage.setItem('bgImgSelect', bgImgSelect.value);
});
//add a final text box under the select element that says 'select a background image'
const bgImgSelectText = document.createElement('p');
bgImgSelectText.innerHTML = 'all artwork credit <a href = "https://www.playbattleaces.com" target="_blank"> playbattleaces.com</a > ';
const bgImgSelectText2 = document.createElement('p');
bgImgSelectText2.classList.add('menuCredits')
bgImgSelectText2.innerHTML = 'uniforms: <a href = "https://discord.com/channels/1187021578333073418/1248357473421758586/1253092940486803569" target="_blank">Sepic</a >';
const bgImgSelectText3 = document.createElement('p');
bgImgSelectText3.classList.add('menuCredits')
bgImgSelectText3.innerHTML = 'scraper: <a href = "https://github.com/Zaokret/battle-aces" target="_blank">Zaokret</a >';


const plainBGButton = document.createElement('button');
plainBGButton.innerHTML = locale('plainbg');
plainBGButton.classList.add('plainBGButton');
bgImgSelectDiv.appendChild(plainBGButton);
plainBGButton.addEventListener('click', () => {
	document.getElementById('wrapper').style.backgroundImage = 'none';
	bgImgSelect.value = 'none';
	localStorage.setItem('bgImgSelect', 'none');
});
bgImgSelectDiv.appendChild(bgImgSelectText);
bgImgSelectDiv.appendChild(bgImgSelectText2);
bgImgSelectDiv.appendChild(bgImgSelectText3);


function information() {
	//create a div for ads, make it a box with lots of dollar signs that looks like money and says 'this is where the money I don't have goes'
	const infoDiv = document.createElement('div');
	infoDiv.classList.add('infoDiv');
	infoDiv.innerHTML = 'Note: Only bonus damage for ANTI-AIR units are shown currently. Will work on adding the other bonus damages';
	infoDiv.style.margin = '5px';
	return infoDiv;
}

function socials() {
	const socialsDiv = document.createElement('div');
	socialsDiv.classList.add('socialsDiv');
	socialsDiv.textContent = 'feedback welcome:';
	//add a clickable image link
	const discordImg = document.createElement('img');
	discordImg.src = 'images/feedback/discord.png';
	discordImg.classList.add('socialsImg');
	//add a link to the socials image
	discordImg.addEventListener('click', () => {
		window.open('https://discord.gg/KUC223kV', '_blank');
	});
	//make hover icon
	discordImg.addEventListener('mouseover', () => {
		discordImg.style.cursor = 'pointer';
	});

	const emailImg = document.createElement('img');
	emailImg.src = 'images/feedback/email.png';
	emailImg.classList.add('socialsImg');
	//add a link to the socials image
	emailImg.addEventListener('click', () => {
		window.open('mailto: baces.tools@gmail.com', '_blank');
	});
	//make hover icon
	emailImg.addEventListener('mouseover', () => {
		emailImg.style.cursor = 'pointer';
	});

	socialsDiv.appendChild(discordImg);
	socialsDiv.appendChild(emailImg);
	return socialsDiv;
}
sidebarContentDiv.appendChild(socials());
sidebarContentDiv.appendChild(information());
console.log("sidebarlog")
console.log(sidebarContentDiv)

export { sidebar, updateBG };




