"use strict";

const fs = require('fs-extra');
const path = require('path');
const colors = require("colors");

//const DOMParser = require('xmldom').DOMParser;
const xsltProcessor = require('xslt-processor');

const Image = require('../models/Image');

async function findAppIconImages(projectPath, channel, verbose){

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

module.exports = findAppIconImages;
