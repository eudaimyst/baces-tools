import { makeDiv } from "../utils";

const stratView = makeDiv('view', 'stratView-h')
const stratViewHeader = makeDiv('viewHeader', 'stratHeader', stratView);
const stratViewContent = makeDiv('viewContent', 'stratContent', stratView);

var gameTime = 0; //game time in seconds

//create a dragable bar that allows the gameTime to be set between 0 and 600
const stratViewTimeBar = makeDiv('stratViewTimeBar', null, stratViewContent);
const stratViewTimeBarHandle = makeDiv('stratViewTimeBarHandle', null, stratViewTimeBar);
stratViewTimeBarHandle.addEventListener('mousedown', function (e) {
	var drag = function (e) {
		var x = e.clientX;
		var rect = stratViewTimeBar.getBoundingClientRect();
		var percent = (x - rect.left) / rect.width;
		percent = Math.min(1, Math.max(0, percent));
		gameTime = Math.round(percent * 600);
		stratViewTimeBarHandle.style.left = percent * 100 + '%';
	}
	document.addEventListener('mousemove', drag);
	document.addEventListener('mouseup', function () {
		document.removeEventListener('mousemove', drag);
	});
});
stratViewTimeBar.appendChild(stratViewTimeBarHandle);


export { stratView }