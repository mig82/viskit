"use strict";

const find = require('find');
const path = require('path');
const colors = require("colors");

const Q = require('q');
Q.longStackSupport = true;

const isSearchAllOption = require('../helpers/is-search-all-option');
const channels = require("../config/channels");

const Image = require('../models/Image');

async function findImageFiles(projectPath, channel, verbose){

	//TODO: Filter down by channel
	var imagesPath = path.resolve(`${projectPath}/resources`);

	var channelOptions = isSearchAllOption(channel) ?
		"(" + channels.types.concat("common").join("|") + ")" :
		`(${channel}|common)`;

	var searchPath = `resources/${channelOptions}/.*` +
		"\\.(jpg|ico|svg|png|gif)$"

	if(verbose)console.log("Searching for all images with:\n\t%s".debug, searchPath);
	var searchPathRegex = new RegExp(searchPath, "");

	return Q.Promise(function(resolve, reject, notify) {

		try{
			//find.file(/\.(jpg|ico|svg|png|gif)$/, imagesPath, function(imagePaths) {
			find.file(searchPathRegex, imagesPath, function(imagePaths) {
				Image.setProjectPath(projectPath, true);
				resolve(imagePaths.map(imagePath => {
					return Image.fromPath(imagePath);
				}));
			});
		}
		catch(e){
			reject(e);
		}
	});
}

module.exports = findImageFiles;
