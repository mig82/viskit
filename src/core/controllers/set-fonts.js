"use strict";

const fs = require("fs-extra");
const colors = require('colors');
const forOwn = require('lodash.forown');

const findFontFiles = require("../operations/find-font-files");
const findSkinFiles = require("../operations/find-skin-files");
const getChannelFromPlatform = require("../config/channels").getChannelFromPlatform;

async function setFonts(font, projectPath, channel, theme, fontsWhitelist, force, verbose){
	//console.log(`Channel: ${channel}`)
	if(verbose)console.log(`Excepted fonts: ${JSON.stringify(fontsWhitelist)}`.debug);

	/*var fontsFiles = await findFontFiles(projectPath, channel?channel:"common", verbose);
	var existingFonts = fontsFiles.map(fontFile => {
		return fontFile.name;
	});
	if(verbose)console.log(`Font files found: ${JSON.stringify(existingFonts)}`.debug);*/

	if(typeof theme === "undefined"){
		theme = "defaultTheme";
	}
	console.log("channel:"+channel)

	//Find all the skin files which we'll have to update.
	var skinFiles = await findSkinFiles(projectPath, theme, verbose);

	for (var skinFile of skinFiles) {

		var dirty = false;

		//Read the skin's JSON file.
		var json = await fs.readJson(skinFile.absPath);

		//console.log(json.font_name)
		if(typeof channel === "undefined" || channel === "common" //If common or not passed
		&& font !== json.font_name //And if the font is not already the one we want to set.
		&& fontsWhitelist.indexOf(json.font_name) < 0 ){ //And if the font is not white-listed.

			//Then set the default font at the root of the skin.
			if(verbose)console.log((`Setting ${skinFile.theme}/${skinFile.name}`+
				`\tplatform:common`+
				`\ttype:${json.wType}`+
				`\tfrom:${json.font_name}`+
				`\tto:${font}`).debug);
			json.font_name = font;
			dirty = true; //Write to file only if one or more platform fonts are set.
		}

		//Get the fonts for each specific channel.
		forOwn(json, (value, key) => {
			/* Where the key is something like spaip, spaan, desktopweb, etc,
			* and value is the object that holds font_name, font_color and the other font properties*/

			if(typeof value === "object" && value.font_name){

				if ( (typeof channel === "undefined" //If no channel was specified
				|| channel === getChannelFromPlatform(key)) //Or if the channel specified matches the skin platform
				&& font !== value.font_name //And if the font is not already the one we want to set.
				&& fontsWhitelist.indexOf(value.font_name) < 0 ){ //And if the font is not white-listed.

					//Then set the font for the specific platform.
					if(verbose)console.log((`Setting ${skinFile.theme}/${skinFile.name}`+
						`\tplatform:${key}`+
						`\ttype:${json.wType}`+
						`\tfrom:${json[key].font_name}`+
						`\tto:${font}`).debug);
					json[key].font_name = font;
					dirty = true; //Write to file only if one or more platform fonts are set.
				}
			}
		});

		if(dirty && force){
			//if(verbose)console.log(`Updating ${skinFile.relPath}`.debug);
			try{
				await fs.writeJson(skinFile.absPath, json, {
					spaces: 2
				});
				//if(verbose)console.log(`Updated ${skinFile.relPath}`.debug);
			}
			catch(e){
				console.error(`Error updating skin file ${skinFile.relPath}: ${e}`.error);
			}
		}
		else if(dirty){ // and !force
			//if(verbose)console.log(`Will not update without force option`.debug);
		}
	}


	return [];//skinFonts;
}

module.exports = setFonts;
