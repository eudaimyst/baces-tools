
import { locale } from "./locale";

const logging = false;
function myLog(message) {
	if (logging) console.log(message);
}


function createHeaderButton(localeString, id, onclick) {
	const button = document.createElement('button');
	button.innerHTML = locale(localeString);
	button.id = id;
	button.classList.add('headerElement');
	button.onclick = onclick;
	return button;
}

export { myLog, createHeaderButton }