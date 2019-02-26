"use strict";

const fs = require('fs-extra');
const forOwn = require('lodash.forown');
const colors = require("colors");

const findSkins = require('./find-skin-files');
const addUnique = require("../helpers/add-unique-image");
const flattenObject = require('../../common/object/flatten');

const Image = require('../models/Image');

async function findSkinImages(projectPath, themeName, verbose){

	if(verbose)console.log("Searching for images in skins".debug);
	var skins = await findSkins(projectPath, themeName, verbose);
	var skinBackgroundImages = [];

	/* Look for images used as skin background images -e.g.:
	* {
		"background_image": "imagedrag.png",
		"bg_type": "image",
		"android": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spaip": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		}
		"wType": "FlexContainer"
	}*/

	for(const skin of skins){
		var json = await fs.readJson(skin.absPath);
		json = flattenObject(json);
		//if(verbose)console.log("Flattened skin:\n%o".debug, json);

		forOwn(json, (value, key) => {
			if(typeof value === "string" && Image.regex.test(value)){
				if(verbose)console.log("Found image ref in skin at %s/%s: %s".debug, skin.relPath, key, value);
				addUnique(skinBackgroundImages, new Image(
					value, //file
					"common", //channel,
					null, //nature,
					null, //platform,
					null, //relPath,
					null, //absPath
					skin.relPath + "/" + key //usedBy
				));
			}
		});
	}
	return skinBackgroundImages;
}

module.exports = findSkinImages;
