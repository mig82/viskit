const find = require('find');
const fs = require('fs-extra');
const path = require('path');
const findIndex = require('lodash.findindex');
const forOwn = require('lodash.forown');
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

function addImagesFor(usedImages, referencedImages, channel, usedBy, verbose){
	referencedImages.forEach(file => {
		if(verbose)console.log("\tvalue: %s".debug, file);
		addUnique(usedImages, new Image(
			file, //file
			channel, //channel,
			null, //nature,
			null, //platform,
			null, //relPath,
			null, //absPath
			usedBy
		));
	});
}

async function findSlashScreenImages(projectPath,/*channel,*/ verbose){
	//Read splashscreenproperties.json -> splashScreen.(mobile|tablet|desktop)
	var splashPropsFilePath = path.resolve(`${projectPath}/splashscreenproperties.json`);
	if(verbose)console.log("Searching for images in splash screens in:\n\t%s".debug, splashPropsFilePath);

	var usedImages = [];
	var json = await fs.readJson(splashPropsFilePath);

	var splashScreen = new Object(json.splashScreen);
	//console.log(splashScreen);

	forOwn(splashScreen, (channelObj, channelName) => {
		if(verbose)console.log("Splash screens for %s:".debug, channelName);
		var referencedImages = findValuesMatching(channelObj, Image.regex);
		addImagesFor(usedImages, referencedImages, channelName, "splash", verbose);
	});

	return usedImages;
}

async function findAppIcons(){
	//Read projectprop.xml
	//	<attributes name="applogokey" value="0=app_icon.png,1=app_icon_iphone.png,8=app_icon_android.png,50=,42=,16=,18=,48=,43=,1000=,1001=,1002=,9999=,9998=,9997="/>
	//	<attributes name="ipad_appicon_1x_76" value="app_icon_76x76_1x.png"/>
	//	<attributes name="ipad_appicon_2x_76" value="app_icon_76x76_2x.png"/>
	//	<attributes name="ipad_notificationicon_1x_20" value="app_icon_20x20_1x.png"/>
	//	<attributes name="ipad_notificationicon_2x_20" value="app_icon_20x20_2x.png"/>
	//	<attributes name="ipad_proappicon_2x_83Point5" value="app_icon_83_5x83_5_2x.png"/>
	//	<attributes name="ipad_settingsicon_1x_29" value="app_icon_29x29_1x.png"/>
	//	<attributes name="ipad_settingsicon_2x_29" value="app_icon_29x29_2x.png"/>
	//	<attributes name="ipad_spotlighticon_1x_40" value="app_icon_40x40_1x.png"/>
	//	<attributes name="ipad_spotlighticon_2x_40" value="app_icon_40x40_2x.png"/>
	//	<attributes name="iphoneipad_appstoreicon_1x_1024" value="itunes_artwork.png"/>
	//	<attributes name="iphone_appicon_2x_60" value="app_icon_60x60_2x.png"/>
	//	<attributes name="iphone_appicon_3x_60" value="app_icon_60x60_3x.png"/>
	//	<attributes name="iphone_notificationicon_2x_20" value="app_icon_20x20_2x.png"/>
	//	<attributes name="iphone_notificationicon_3x_20" value="app_icon_20x20_3x.png"/>
	//	<attributes name="iphone_spotlighticon_2x_29" value="app_icon_29x29_2x.png"/>
	//	<attributes name="iphone_spotlighticon_2x_40" value="app_icon_40x40_2x.png"/>
	//	<attributes name="iphone_spotlighticon_3x_29" value="app_icon_29x29_3x.png"/>
	//	<attributes name="iphone_spotlighticon_3x_40" value="app_icon_40x40_3x.png"/>
}

async function findViewImages(projectPath, viewType, channel, viewName, verbose){

	if(verbose)console.log("Searching for images in views".debug);
	var widgets = await findWidgets(projectPath, viewType, channel, viewName, verbose);
	var usedImages = [];

	for(const widget of widgets){

		var imageKeys = [];
		var json = await fs.readJson(widget.absPath);

		if(verbose)console.log("\n%s".debug, widget.relPath);

		//var referencedImages = findValuesForKeys(json, imageKeys);
		var referencedImages = findValuesMatching(json, Image.regex);
		addImagesFor(usedImages, referencedImages, widget.channel, "view", verbose);
	}

	// TODO: Find images used by Skins.
	// TODO: Find images used as app icons and splash screens.
	return usedImages;
}

async function findUsed(projectPath, viewType, channel, viewName, verbose){
	var splashImages = await findSlashScreenImages(projectPath,/* channel,*/ verbose);
	var viewImages = await findViewImages(projectPath, viewType, channel, viewName, verbose);
	var all = splashImages.concat(viewImages);
	return all;
}

module.exports = {
	findAll: findAll,
	findUsed: findUsed
};
