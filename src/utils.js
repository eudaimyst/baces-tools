
const logging = false;
function myLog(message) {
	if (logging) console.log(message);
}

export { myLog }