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
		//json = flattenObject(json);
		//if(verbose)console.log("Flattened skin:\n%o".debug, json);

		/*Get the font properties at the root.
			"font_name": "Helvetica",
			"font_color": "000000ff",
			"font_size": 118,
			"font_style": "normal",
			"font_weight": "normal"
		*/

		//Capture whether the font size is specified in px or %.
		var units = json.fontSizeInPx?"px":"%";

		if(json.font_name && except.indexOf(json.font_name) < 0){

			var baseFont = new Font(
				json.font_name,
				json.font_color,
				`${json.font_size}${units}`,
				json.font_style,
				json.font_weight,
				null, //format
				"common", //channel
				"common", //platform
				json.wType, //widgetType
				skin.relPath.split("/").slice(1).join("/"), //defaultTheme/redFlexSkin.json
				skin.absPath
			);
			if(verbose)console.log("Found font ref match in skin at %s: %o".debug, skin.relPath, baseFont);
			skinFonts.push(baseFont);
		}

		//Get the fonts for each specific channel.
		forOwn(json, (value, key) => {
			/* Where the key is something like spaip, spaan, desktopweb, etc,
			* and value is the object that holds font_name, font_color and the other font properties*/

			if(typeof value === "object" && value.font_name){

				// Let's keep record of all the platforms found so that if these values change in the future it
				// will be easier to debug why we can't find what we're looking for.
				// The key will be ipad, spawinphone8, spaan, etc.
				platforms.add(key);

				var fontChannel = getChannelFromPlatform(key);

				//console.log(`${except} ${value.font_name} ${except.indexOf(value.font_name)}`)

				if ( (channel === "common" || fontChannel === channel) && except.indexOf(value.font_name) < 0 ){
					if(verbose)console.log("Found font ref match in skin at %s/%s: %o".debug, skin.relPath, key, value);

					var font = new Font(
						value.font_name,
						value.font_color,
						`${value.font_size}${units}`,
						value.font_style,
						value.font_weight,
						null, //format
						fontChannel,
						key, //platform
						json.wType,
						skin.relPath.split("/").slice(1).join("/"), //defaultTheme/redFlexSkin.json
						skin.absPath
					);
					//if(verbose)console.log("Found font ref match in skin at %s/%s: %o".debug, skin.relPath, key, font);

					skinFonts.push(font);
				}
			}
		});
	}
	if(verbose)console.log(`Platforms found: ${JSON.stringify(Array.from(platforms))}`.debug);
	return skinFonts;
}

module.exports = findSkinFonts;
