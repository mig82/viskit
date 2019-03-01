"use strict";

const fs = require("fs-extra");
const colors = require('colors');
const forOwn = require('lodash.forown');

//const Font = require("../models/Font");
const findFontFiles = require("../operations/find-font-files");
const findSkinFonts = require("../operations/find-skin-fonts");

async function findFontReferences(projectPath, viewType, channel, viewName, theme, verbose){

	var fontsFiles = await findFontFiles(projectPath, "common", verbose);
	var existingFonts = fontsFiles.map(fontFile => {
		return fontFile.name;
	});
	console.log(existingFonts);

	if(typeof theme === "undefined"){
		theme = "defaultTheme";
	}

	var skinFonts = await findSkinFonts(projectPath, theme, verbose);

	return [];//skinFonts;
}

module.exports = findFontReferences;
