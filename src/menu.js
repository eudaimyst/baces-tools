

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
	name: 'Battle Aces Stats',
	url: 'https://battle-aces-stats.com'
}, {
	name: 'SimpleAces',
	url: 'https://jackiefae.github.io/simpleaces.html'
}, {
	name: 'BA by Conqueror',
	url: 'https://docs.google.com/spreadsheets/d/1Y5sro2kxbDu2fCmKHcKmEFuzjpDd8SsFaifKDFY1SIg/edit?gid=0#gid=0'
}
]


//# left sidebar (burger menu on vertical)
const sidebar = document.createElement('div');
sidebar.id = 'sidebar';


const sidebarLogoImg = document.createElement('img');
sidebarLogoImg.src = 'images/baces_tools2.svg';
sidebarLogoImg.alt = 'BAces_Tools';

sidebarLogoImg.id = 'sidebarLogoImg';
sidebarLogoImg.style.width = '50px';

sidebar.appendChild(sidebarLogoImg);



//add a button to the sidebar to toggle the sidebar
const toggleSidebarButton = document.createElement('button');
toggleSidebarButton.id = 'toggleSidebarButton';
sidebar.classList.add('sidebar_inactive');
sidebar.appendChild(toggleSidebarButton);
//create a button image and add it to the toggleSidebarButton
const toggleSidebarButtonImg = document.createElement('img');
toggleSidebarButtonImg.src = 'images/burgericon.png';
toggleSidebarButtonImg.id = 'toggleSidebarButtonImg';
toggleSidebarButton.appendChild(toggleSidebarButtonImg);

var sidebarActive = true;
const sidebar_title_div = document.createElement('div');
sidebar_title_div.id = 'sidebar_title_div';
sidebar_title_div.innerHTML = 'BAces_Tools';
const sidebar_title_v_div = document.createElement('div');
sidebar_title_v_div.id = 'sidebar_title_div_v';
sidebar_title_v_div.innerHTML = 'BAces_Tools';
const sidebar_content_div = document.createElement('div');
sidebar_content_div.id = 'sidebar_content_div';
const sidebar_footer_div = document.createElement('div');
sidebar_footer_div.classList.add('sidebar_footer_div')
const sidebar_footer_contents = document.createElement('div');
sidebar_footer_div.appendChild(sidebar_footer_contents);
sidebar_footer_contents.innerHTML = "<b>BACES Tools has no association with Uncapped Games. All rights to any game-related content remain the exclusive property of Uncapped Games.";
const sidebar_footer_contents2 = document.createElement('div');
sidebar_footer_div.appendChild(sidebar_footer_contents2);
sidebar_footer_contents2.classList.add('extraSmallFont');
sidebar_footer_contents2.innerHTML = "This software is provided 'as is' warranty or guarantee regarding the accuracy, completeness, or current relevance of the game data displayed. The use of this software does not grant any rights to the underlying intellectual property or game content of Battle Aces, which remains the sole property of its respective owners.";
const sidebar_footer_contents3 = document.createElement('div');
sidebar_footer_div.appendChild(sidebar_footer_contents3);
sidebar_footer_contents3.innerHTML = "By using this software, you acknowledge that the developers are not responsible for any claims, liabilities, or damages that may arise from the use of this software. The software is intended solely for informational purposes, and any reliance on the data provided is at the user’s own risk.";
sidebar_footer_contents3.classList.add('extraSmallFont');
//sidebar_footer_div.innerHTML = '<b></b>.<br> <br>';
function expandMenu(expand) {
	sidebarLogoImg.style.width = '100%';
	//if the sidebar is inactive, reduce the width to 50px, otherwise restore it to 200px
	if (expand) {
		sidebar.style.width = '200px';
		// wrapper.style.marginLeft = '200px';
		sidebar.appendChild(sidebar_title_div);
		sidebar.appendChild(sidebar_content_div);
		sidebar.appendChild(sidebar_footer_div);
		// if sidebar_title_v_div exists in sidebar
		if (sidebar.contains(sidebar_title_v_div)) {
			sidebar.removeChild(sidebar_title_v_div);
		};
	} else {
		sidebar.style.width = '50px';
		// wrapper.style.marginLeft = '50px';
		//if children exist
		if (sidebar.children.length > 0) {
			// if it is a child
			if (sidebar.contains(sidebar_title_div)) {
				sidebar.removeChild(sidebar_title_div);
				sidebar.removeChild(sidebar_content_div);
				sidebar.removeChild(sidebar_footer_div);
			}
			sidebar.appendChild(sidebar_title_v_div);
		}
	}
}
toggleSidebarButton.addEventListener('click', () => {
	sidebarActive = !sidebarActive;
	expandMenu(!sidebarActive);
});
expandMenu(false);

//#tag sidebar-content this is where everything in the sidebar goes

//create a div which has a menu of links. The div should have a header, which can be clicked to expand, to show the links
const linksDiv = document.createElement('div');
linksDiv.classList.add('links_div');
sidebar_content_div.appendChild(linksDiv);

const linksHeader = document.createElement('div');
linksHeader.classList.add('links_header');
linksHeader.innerHTML = 'Links';
linksDiv.appendChild(linksHeader);

const linksContent = document.createElement('div');
linksContent.classList.add('links_content');
linksDiv.appendChild(linksContent);
//for each link in linkData, create a link
linkData.forEach((link) => {
	const linkElement = document.createElement('a');
	linkElement.href = link.url;
	linkElement.innerHTML = link.name + '<br>';
	linksContent.appendChild(linkElement);
});
//add event when links header is pressed
linksHeader.addEventListener('click', () => {
	//toggle the links div
	linksDiv.classList.toggle('links_div_active');
});

//create a div for a countdown to the beta release date
const countdownDiv = document.createElement('div');
countdownDiv.classList.add('countdown_div');
sidebar_content_div.appendChild(countdownDiv);
const counDownDivCountdownText = document.createElement('p');
counDownDivCountdownText.classList.add('countdown_text');
countdownDiv.appendChild(counDownDivCountdownText);
//get the remaining time in days hours minutes and secionds until the 6th of November, 12pm, PST American West Coast
//returns a string
function getRemainingTime() {
	const now = new Date();
	const targetDate = new Date('2024-11-06T12:00:00Z');
	const timeDifference = targetDate - now;
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
	//return the remaining time in a string
	return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

//set countdown div text to the remaining time using the function
setInterval(() => {
	counDownDivCountdownText.innerHTML = 'COUNTDOWN:<br>Closed Beta 2 Release: ' + getRemainingTime();
}, 1000);


function advertisement() {
	//create a div for ads, make it a box with lots of dollar signs that looks like money and says 'this is where the money I don't have goes'
	const adsDiv = document.createElement('div');
	adsDiv.classList.add('ads_div');
	//adsDiv.innerHTML = '💸💰💲🤑 This is where the money I don\'t have goes 💰💸🤑🤑💸💲💰💸🤑💲💰💲';
	adsDiv.style.textAlign = 'center';
	adsDiv.style.fontWeight = 'bold';
	adsDiv.style.color = 'gold';
	adsDiv.style.textShadow = '0 0 10px black';
	adsDiv.style.top = '50%';
	//line spacing small
	adsDiv.style.lineHeight = '.5';

	adsDiv.style.fontSize = '60px';
	return adsDiv;
}




export { sidebar, advertisement };




