
import { locale } from "./locale";

const logging = false;
function myLog(message) {
	if (logging) console.log(message);
}


function createButton(localeString, classname, onclick) {
	const button = document.createElement('button');
	button.innerHTML = locale(localeString);
	button.classList.add(classname);
	button.onclick = onclick;
	return button;
}

function createHeaderButton(localeString, id, onclick) {
	const button = createButton(localeString, 'headerElement', onclick)
	button.id = id;
	return button;
}

export { myLog, createHeaderButton, createButton }