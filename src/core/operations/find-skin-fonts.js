"use strict";

const fs = require('fs-extra');
const forOwn = require('lodash.forown');
const colors = require("colors");

const findSkins = require('./find-skin-files');
const addUnique = require("../helpers/add-unique-image");
const flattenObject = require('../../common/object/flatten');
const getChannelFromPlatform = require("../config/channels").getChannelFromPlatform;

const Font = require('../models/Font');

async function findSkinFonts(projectPath, channel, theme, except, verbose){

	if(verbose)console.log("Searching for fonts in skins".debug);
	var skins = await findSkins(projectPath, theme, verbose);
	var skinFonts = [];

	/* Look for fonts used as skin background fonts -e.g.:
	* {
		"background_font": "fontdrag.png",
		"bg_type": "font",
		"android": {
			"background_font": "fontdrag.png",
			"bg_type": "font",
		},
		"spaip": {
			"background_font": "fontdrag.png",
			"bg_type": "font",
		}
		"wType": "FlexContainer"
	}*/

	var platforms = new Set();

	for(const skin of skins){
		var json = await fs.readJson(skin.absPath);
		json = flattenObject(json);
		//if(verbose)console.log("Flattened skin:\n%o".debug, json);

		forOwn(json, (value, key) => {
			if(typeof value === "string" && Font.familyRegex.test(key)){
				//if(verbose)console.log("Found font ref in skin at %s/%s: %s".debug, skin.relPath, key, value);

				// Let's keep record of all the platforms found so that if these values change in the future it
				// will be easier to debug why we can't find what we're looking for.
				var platform = "";
				var keyParts = key.split("/");
				//The key will either be font_name of [channel]/font_name -e.g. ipad/font_name
				switch (keyParts.length) {
					case 1:
						platform = "common"
						break;
					case 2:
						platform = keyParts[0];
						break;
					default:
						console.log(`Unrecognised font property '${key}'`.error);
						platform = keyParts[0];
				}
				platforms.add(platform);

				var fontChannel = getChannelFromPlatform(platform);
				if ( (channel === "common" || fontChannel === channel) && except.indexOf(value)<0 ){
					if(verbose)console.log("Found font ref match in skin at %s/%s: %s".debug, skin.relPath, key, value);
					/*skinFonts.push({
						skin: skin.relPath.split("/").slice(1).join("/"),
						wType: json.wType,
						channel: fontChannel, //mobile|tablet|watch|androidwear|desktop
						platform: platform, //android|kiosk|spaan|spaandroidtablet etc.
						font: value
					});*/
					skinFonts.push(new Font(
						value, //font family name
						null, //format
						fontChannel,
						platform,
						json.wType,
						skin.relPath.split("/").slice(1).join("/"), //defaultTheme/redFlexSkin.json
						skin.absPath
					));
				}
			}
		});
	}
	console.log(`This project has fonts for the following platforms: ${JSON.stringify(Array.from(platforms))}`.warn);
	return skinFonts;
}

module.exports = findSkinFonts;
