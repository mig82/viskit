const find = require('find');
const fs = require('fs-extra');
const path = require('path');
const findIndex = require('lodash.findindex');
const Q = require('q');
Q.longStackSupport = true;

const findWidgets = require('../../common/finder').findWidgets;
//const findValuesForKeys = require('../../common/object/find-values').findValuesForKeys;
const findValuesMatching = require('../../common/object/find-values').findValuesMatching;
const searchAll = require('../../common/search-all');
const channels = require("../../config/channels");

const Image = require('../../models/image');
const Widget = require('../../models/widget');

function addUnique(images, newImage){

	//Never add falsy elements.
	if(newImage){

		//Determine whether this image is already in the array.
		var index = findIndex(images, image => {
			return image.matches(newImage);
		})

		//If this image is not already in the array, then add it.
		if(index < 0) {
			//console.log("Adding %o to %o".debug, newImage, images)
			images.push(newImage);
		}
	}
}

async function findSkinUsedImages(){
	/* TODO: Find images used as skin background images.
	*
	* {
		"background_image": "imagedrag.png",
		"bg_type": "image",
		"android": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"androidwearos": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"desktopweb": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"ipad": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"iphone": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"kiosk": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spaan": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spaandroidtablet": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spabb": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spaip": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spaipad": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spawindowstablet": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"spawinphone8": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"tabrcandroid": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"wType": "FlexContainer",
		"watchos": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"windows8": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		},
		"winphone8": {
			"background_image": "imagedrag.png",
			"bg_type": "image",
		}
	}
	*/
}

async function findAll(projectPath, channel, verbose){

	//TODO: Filter down by channel
	var imagesPath = path.resolve(`${projectPath}/resources`);

	var channelOptions = searchAll(channel) ?
		"(" + channels.types.concat("common").join("|") + ")" :
		`(${channel}|common)`;

	var searchPath = `resources/${channelOptions}/.*` +
		"\\.(jpg|ico|svg|png|gif)$"

	console.log("Finding all images\nLooking for:\n\t" + searchPath);
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

function addImagesFor(usedImages, referencedImages, channel, verbose){
	referencedImages.forEach(file => {
		if(verbose)console.log("\tvalue: %s".debug, file);
		addUnique(usedImages, new Image(
			file, //file
			channel, //channel,
			null, //nature,
			null, //platform,
			null, //relPath,
			null, //absPath
			"widget"
		));
	});
}

async function findUsed(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){

	if(verbose)console.log("Finding used images".debug);
	var widgets = await findWidgets(projectPath, viewType, channel, viewName, verbose);
	var usedImages = [];

	for(const widget of widgets){

		var imageKeys = [];
		var json = await fs.readJson(widget.absPath);

		if(verbose)console.log("\n%s".debug, widget.relPath);

		//var referencedImages = findValuesForKeys(json, imageKeys);
		var referencedImages = findValuesMatching(json, Image.regex);
		addImagesFor(usedImages, referencedImages, widget.channel, verbose);
	}

	// TODO: Find images used by Skins.
	// TODO: Find images used as app icons and splash screens.
	return usedImages;
}

module.exports = {
	findAll: findAll,
	findUsed: findUsed
};
