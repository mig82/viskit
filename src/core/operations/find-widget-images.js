"use strict";

const fs = require('fs-extra');
const forOwn = require('lodash.forown');
const colors = require("colors");

const findWidgets = require('./find-widgets');
const addUnique = require("../helpers/add-unique-image");
const flattenObject = require('../../common/object/flatten');

const Image = require('../models/Image');

async function findWidgetImages(projectPath, viewType, channel, viewName, verbose){

	if(verbose)console.log("Searching for images in views".debug);
	var widgets = await findWidgets(projectPath, viewType, channel, viewName, verbose);
	var usedImages = [];

	for(const widget of widgets){

		//var imageKeys = [];
		var json = await fs.readJson(widget.absPath);

		json = flattenObject(json);
		//if(verbose)console.log("Flattened widget:\n%o".debug, json);

		forOwn(json, (value, key) => {
			if(typeof value === "string" && Image.regex.test(value)){
				addUnique(usedImages, new Image(
					value, //file
					widget.channel, //channel,
					null, //nature,
					null, //platform,
					null, //relPath,
					null, //absPath
					widget.relPath + "/" + key //usedBy
				));
			}
		});
	}
	return usedImages;
}

module.exports = findWidgetImages;
