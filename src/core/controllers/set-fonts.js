"use strict";

const fs = require("fs-extra");
const colors = require('colors');
const forOwn = require('lodash.forown');

const findFontFiles = require("../operations/find-font-files");
const findSkinFiles = require("../operations/find-skin-files");

async function setFonts(font, projectPath, channel, theme, fontsWhitelist, verbose){
	//console.log(`Channel: ${channel}`)
	console.log(`Except: ${fontsWhitelist}`)
	var fontsFiles = await findFontFiles(projectPath, channel?channel:"common", verbose);
	var existingFonts = fontsFiles.map(fontFile => {
		return fontFile.name;
	});
	if(verbose)console.log(`Font files found: ${JSON.stringify(existingFonts)}`.debug);

	if(typeof theme === "undefined"){
		theme = "defaultTheme";
	}

	if(channel === "desktop"){
		channel = "desktopweb";
	}
	var skinFiles = await findSkinFiles(projectPath, theme, verbose);
	for (var skinFile of skinFiles) {
		var json = await fs.readJson(skinFile.absPath);
		if(channel){
			if(json[channel] && json[channel].font_name && fontsWhitelist.indexOf(json[channel].font_name) < 0){
				if(verbose)console.log(`Setting skin: ${skinFile.relPath}\ttype: ${json.wType}\tfont: ${json[channel].font_name}`);
				json[channel].font_name = font;
				try{
					await fs.writeJson(skinFile.absPath, json, {
						spaces: 2
					});
				}
				catch(e){
					console.error(`Error updating skin file ${skinFile.relPath}: ${e}`.error);
				}
			}
		}
		else{
			//TODO: forOwn()
		}

	}


	return [];//skinFonts;
}

module.exports = setFonts;
