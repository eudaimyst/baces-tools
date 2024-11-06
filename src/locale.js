import locales from './locale/locales.json';


const defaultLocale = 'en'

if (localStorage.getItem('locale') == null) localStorage.setItem('locale', defaultLocale)
var currentLocale = localStorage.getItem('locale');

//create locale function which takes a string and returns a translated string from a json file
function locale(key) {
	if (locales[key][currentLocale] == undefined) {
		return key;
	}
	return locales[key][currentLocale];
}

function setLocale(locale) {
	currentLocale = locale;
	localStorage.setItem('locale', locale);
}

function getLocale() {
	return currentLocale;
}


export { locale, setLocale, getLocale };