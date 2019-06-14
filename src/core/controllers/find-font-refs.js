"use strict";

const fs = require("fs-extra");
const colors = require('colors');
const forOwn = require('lodash.forown');

//const Font = require("../models/Font");
const findFontFiles = require("../operations/find-font-files");
const findSkinFonts = require("../operations/find-skin-fonts");

async function findFontReferences(projectPath, channel, theme, except, verbose){

	/*var fontsFiles = await findFontFiles(projectPath, "common", verbose);
	var existingFonts = fontsFiles.map(fontFile => {
		return fontFile.name;
	});
	console.log(`Font files: ${existingFonts}`);*/

	if(typeof theme === "undefined"){
		theme = "defaultTheme";
	}

	if(typeof channel === "undefined"){
		channel = "common";
	}

	var skinFonts = await findSkinFonts(projectPath, channel, theme, except, verbose);
	//TODO: Color-code results, red if the value does not match one of the existing fonts? What about system fonts?

	return skinFonts;
}

module.exports = findFontReferences;
