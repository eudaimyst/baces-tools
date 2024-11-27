
import { locale } from "./locale";

const logging = false;
function myLog(message) {
	if (logging) console.log(message);
}

function makeDiv(_class, _id, _parent) {
	const div = document.createElement('div');
	if (_id) div.id = _id;
	else div.id = _class;
	if (_class) div.classList.add(_class);
	if (_parent) _parent.appendChild(div);
	return div;
}

function makeBtn(localeString, classname, onclick) {
	const button = document.createElement('button');
	button.innerHTML = locale(localeString);
	button.classList.add(classname);
	button.onclick = onclick;
	return button;
}

function makeInput(_class, _id, _parent, _type, _placeholder, _onInput, _change) {
	const input = document.createElement('input');
	if (_id) input.id = _id;
	if (_class) input.classList.add(_class);
	if (_parent) _parent.appendChild(input);
	if (_type) input.type = _type;
	if (_placeholder) input.placeholder = _placeholder;
	if (_onInput) input.oninput = _onInput;
	if (_change) input.onchange = _change;
	return input;
}

function makeImg(_src, _class, _id, _parent, _alt) {
	const img = document.createElement('img');
	if (_id) img.id = _id;
	if (_class) img.classList.add(_class);
	if (_parent) _parent.appendChild(img);
	if (_src) img.src = _src;
	if (_alt) {
		img.alt = _alt;
		img.title = _alt;
	};

	return img;
}

function makeDropDown(_class, _id, _parent, _options) {
	const dropdown = document.createElement('select');
	if (_id) dropdown.id = _id;
	if (_class) dropdown.classList.add(_class);
	if (_parent) _parent.appendChild(dropdown);
	if (_options) _options.forEach((option) => {
		dropdown.add(new Option(option[0], option[1]))
	});
	return dropdown;
}

function makeHeaderBtn(localeString, id, onclick) {
	const button = makeBtn(localeString, 'headerElement', onclick)
	button.id = id;
	return button;
}

function makeP(_class, _id, _parent, _text) {
	const p = document.createElement('p');
	if (_id) p.id = _id;
	if (_class) p.classList.add(_class);
	if (_parent) _parent.appendChild(p);
	if (_text) p.textContent = _text;
	return p;
}

function cleanText(input) {
	if (typeof input !== 'string') {
		input = String(input);
	}
	return input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}
export { myLog, makeHeaderBtn, makeBtn, makeDiv, cleanText, makeDropDown, makeP, makeImg, makeInput }