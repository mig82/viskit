"use strict";

const fs = require('fs-extra');
const forOwn = require('lodash.forown');
const colors = require("colors");

const findSkins = require('./find-skin-files');
const addUnique = require("../helpers/add-unique-image");
const flattenObject = require('../../common/object/flatten');

const Font = require('../models/Font');

async function findSkinFonts(projectPath, themeName, verbose){

	if(verbose)console.log("Searching for fonts in skins".debug);
	var skins = await findSkins(projectPath, themeName, verbose);
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

	for(const skin of skins){
		var json = await fs.readJson(skin.absPath);
		json = flattenObject(json);
		//if(verbose)console.log("Flattened skin:\n%o".debug, json);

		forOwn(json, (value, key) => {
			if(typeof value === "string" && Font.regex.test(key)){
				if(verbose)console.log("Found font ref in skin at %s/%s: %s".debug, skin.relPath, key, value);
				// skinFonts.push(new Font(value, null, null, key, json.wType, skin.relPath, skin.absPath));
				skinFonts.push({
					skin: skin.relPath.split("/").slice(1).join("/"),
					wType: json.wType,
					channel: key.split("/")[0],
					font: value
				});
			}
		});
	}
	return skinFonts;
}

module.exports = findSkinFonts;
