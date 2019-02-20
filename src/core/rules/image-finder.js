const find = require('find');
const fs = require('fs-extra');
const path = require('path');
const findIndex = require('lodash.findindex');
const forOwn = require('lodash.forown');
const colors = require("colors");

//const DOMParser = require('xmldom').DOMParser;
const xsltProcessor = require('xslt-processor');

const Q = require('q');
Q.longStackSupport = true;

const findWidgets = require('./ui-finder').findWidgets;
const findSkins = require('./find-skins');
const flattenObject = require('../../common/object/flatten');
const isSearchAllOption = require('../helpers/is-search-all-option');
const channels = require("../config/channels");

const Image = require('../models/image');
const Widget = require('../models/widget');

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

async function findAll(projectPath, channel, verbose){

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

async function findAppIcons(projectPath, channel, verbose){

	//TODO: Starting with v8 SP4 these are found in projecProperties.json
	var projectPropXmlFilePath = path.resolve(`${projectPath}/projectprop.xml`);
	if(verbose)console.log("Searching for images in:\n\t%s".debug, projectPropXmlFilePath);

	var usedImages = [];
	var xml = await fs.readFile(projectPropXmlFilePath, "utf8");
	if(verbose)console.log(colors.debug(xml));

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

	var doc = xsltProcessor.xmlParse(xml);
	var attributes = doc?doc.getElementsByTagName("attributes"):[];
	if(verbose)console.log("Found %d attributes".debug, attributes.length);
	attributes.forEach(attribute => {

		var key = attribute.getAttribute("name");
		var value = attribute.getAttribute("value");
		var values = value.split(",");

		values.forEach(val => {
			if(Image.regex.test(val)){
				var imageFileName, channel, device;
				if(key === "applogokey" || key === "splashlogokey"){
					imageFileName = val.split("=")[1];
					channel = "common"
				}
				else{
					imageFileName = val;
					var keyParts = key.split("_");
					device = keyParts[0];

					if(device === "iphone"){
						channel = "mobile"
					}
					else if(device === "ipad"){
						channel = "tablet"
					}
					else if(device === "iphoneipad"){
						channel = "common"
					}
				}
				if(verbose)console.log("\t%s:\t%s".debug, key, imageFileName);
				addUnique(usedImages, new Image(
					imageFileName, //file
					channel, //channel,
					null, //nature,
					null, //platform,
					null, //relPath,
					null, //absPath
					"projectprop.xml/" + key //usedBy
				));
			}
		});
	});
	return usedImages;
}

async function findViewImages(projectPath, viewType, channel, viewName, verbose){

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

async function findUsed(projectPath, viewType, channel, viewName, verbose){
	var splashImages = await findSlashScreenImages(projectPath,/* channel,*/ verbose);
	var viewImages = await findViewImages(projectPath, viewType, channel, viewName, verbose);
	var appIcons = await findAppIcons(projectPath, channel, verbose);
	var skinImages = await findSkinImages(projectPath, null, verbose);
	var all = splashImages.concat(viewImages).concat(appIcons).concat(skinImages);
	return all;
}

module.exports = {
	findAll: findAll,
	findUsed: findUsed
};
