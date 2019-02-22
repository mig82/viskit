"use strict";

const fs = require('fs-extra');
const path = require('path');
const forOwn = require('lodash.forown');
const colors = require("colors");

const flattenObject = require('../../common/object/flatten');
const Image = require('../models/Image');
const addUnique = require("../helpers/add-unique-image");

async function findSlashScreenImages(projectPath,/*channel,*/ verbose){
	//Read splashscreenproperties.json -> splashScreen.(mobile|tablet|desktop)
	var splashPropsFilePath = path.resolve(`${projectPath}/splashscreenproperties.json`);
	if(verbose)console.log("Searching for splash screen images in:\n\t%s".debug, splashPropsFilePath);

	var usedImages = [];
	var json = await fs.readJson(splashPropsFilePath);

	//if(verbose)console.log("Original splash screens config:\n%o".debug, json.splashScreen);
	var splashScreen = flattenObject(json.splashScreen);
	//if(verbose)console.log("Flattened splash screens config:\n%o".debug, splashScreen);

	forOwn(splashScreen, (value, key) => {
		if(typeof value === "string" && Image.regex.test(value)){
			addUnique(usedImages, new Image(
				value, //file
				key.split("/")[0], //channel,
				null, //nature,
				null, //platform,
				null, //relPath,
				null, //absPath
				"splashscreenproperties.json/" + key //usedBy
			));
		}
	});

	return usedImages;
}

module.exports = findSlashScreenImages;
