import locales from './locale/locales.json';


const defaultLocale = 'en'
const localeList = [
	'en',
	'cn',
	'fr',
	'de',
	'es',
	'es-419',
	'jp',
	'kr',
	'pt'
]

const languageLongNameList = locales.languages
if (localStorage.getItem('locale') == null) localStorage.setItem('locale', defaultLocale)
var currentLocale = localStorage.getItem('locale');

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

function getLocaleList() {
	return localeList;
}

export { locale, setLocale, getLocale, getLocaleList, languageLongNameList };