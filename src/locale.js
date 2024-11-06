import locales from './locale/locales.json';


const defaultLocale = 'en'

if (localStorage.getItem('locale') == null) localStorage.setItem('locale', defaultLocale)
var currentLocale = localStorage.getItem('locale');
currentLocale = 'cn'; //for testing

//create locale function which takes a string and returns a translated string from a json file
function locale(key) {
	console.log('locale key: ' + key + ' locale: ' + currentLocale)
	console.log(locales);
	if (locales[key] == undefined) {
		return '$' + key;
	}
	else if (locales[key][currentLocale] == undefined) {
		return locales[key][defaultLocale];
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