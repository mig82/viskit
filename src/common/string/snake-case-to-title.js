"use strict";

const capitalize = require("./capitalize");

function snakeCaseToTitle(string){
	var stringParts = string.split("_");
	var title = "";
	for (var i = 0; i < stringParts.length; i++) {
		if(i > 0) title += " ";
		title += capitalize(stringParts[i]);
	}
	return title;
}

module.exports = snakeCaseToTitle
