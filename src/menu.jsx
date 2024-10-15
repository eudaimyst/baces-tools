import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom';


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


const SidebarLogo = () => {
	return (
		<div>
			<img src='images/baces_tools.svg' alt='BAces_Tools' id='sidebarLogoImg' style={{ width: '100%' }} />
		</div>
	)
}



const MenuFooter = () => {
	return (
		<div class='sidebar_footer_div'>
			<b>BAces_Tools has no affiliation with Uncapped Games</b>
			<p>All rights to any content displayed remain the property of Uncapped Games.</p>
			<p style={{ fontSize: '8px' }} >No warranties or guarantees are provided regarding the accuracy or completeness of the game data displayed. This toolkit is provided ‘as is’ and is for informational purposes only. Use of this toolkit does not grant any rights to the underlying intellectual property or game content of Battle Aces, which remains with its respective owner.</p>
		</div>
	)
}


const Menu = () => {
	const [menuVisible, setMenuVisible] = useState(false);
	return (
		<div style={{ width: menuVisible ? '200px' : '50px' }}>
			<SidebarLogo />
			<button id='toggleSidebarButton' onClick={() => setMenuVisible(!menuVisible)}>
				<img src='images/burgericon.png' alt='burgericon' id='toggleSidebarButtonImg' onClick={() => setMenuVisible(!menuVisible)} />
			</button>
			<div id={!menuVisible ? 'sidebar_title_div_v' : 'sidebar_title_div'}>BAces_Tools</div>
			{menuVisible && (
				<div>
					<ul>
						{linkData.map((link) => (
							<li key={link.url}>
								<a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
							</li>
						))}
					</ul>
					<ReleaseCountdown />
					<AdvertisementDiv />
					<MenuFooter />
				</div>
			)}
		</div>
	)
}

function getRemainingTime() {
	//get the remaining time in days hours minutes and secionds until the 6th of November, 12pm, PST American West Coast
	//returns a string
	const now = new Date();
	const targetDate = new Date('2024-11-06T12:00:00Z');
	const timeDifference = targetDate - now;
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
	return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}


const ReleaseCountdown = () => {
	const [remainingTime, setRemainingTime] = useState(getRemainingTime());
	useEffect(() => {
		const interval = setInterval(() => {
			setRemainingTime(getRemainingTime());
		}, 1000);
		return () => clearInterval(interval);
	})
	return (
		<div>
			<p>Closed Beta 2 Release:<br />
				{remainingTime}</p>
		</div>
	)
}

const AdvertisementDiv = () => {
	return (
		<div style={{ textAlign: 'center', color: 'gold', fontWeight: 'bold', textShadow: '0 0 10px black', lineHeight: '.5', fontSize: '60px', display: window.location.hostname === 'localhost' ? 'block' : 'none' }}>
			💸💰💲🤑 This is where the money I don't have goes 💰💸🤑🤑💸💲💰💸🤑💲💰💲
		</div>
	)
}


const sidebar = document.createElement('div');
sidebar.id = 'sidebar';
const sidebarMenu = createRoot(sidebar);
sidebarMenu.render(
	<Menu />
);


export { sidebar };




