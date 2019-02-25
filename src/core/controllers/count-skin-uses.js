"use strict";

const fs = require("fs-extra");
const colors = require('colors');
const forOwn = require('lodash.forown');

const Skin = require("../models/Skin");
const findSkins = require("../operations/find-skins");
const findWidgets = require("../operations/find-widgets.js");

async function countSkinUses(projectPath, viewType, channel, viewName, verbose){
	//TODO: take the theme name as a paramter.
	var skins = await findSkins(projectPath, "defaultTheme", verbose)

	//A map where the keys are skin names and the values are arrays of all the widgets that refer to them.
	var skinRefs = {};
	var brokenSkinRefs = {};

	//A map where the keys are the unique id's of skins and the values are their names.
	var skinIdToNameMap = {};

	for (var skin of skins) {
		skinRefs[skin.name] = [];

		let json = await fs.readJson(skin.absPath);
		skinIdToNameMap[json.kuid] = skin.name;
	}
	if(verbose)console.log("Skin kuid's to names: %o".debug, skinIdToNameMap);

	var widgets = await findWidgets(projectPath, viewType, channel, viewName, verbose);

	//console.log("Found %d widgets", widgets.length);
	for (var widget of widgets) {
		let json = await fs.readJson(widget.absPath);
		//console.log("Read json for %s", json.id);

		forOwn(json, (value, key) => {
			//console.log("\tprop %s for %s", key, json.id);
			if(typeof value === "string" && Skin.regex.test(key)){
				//If the JSON attribute is a skin one, then the value is the skin's kuid.
				let skinName = skinIdToNameMap[value];
				if(verbose) console.log("Found skin ref at %s/%s: %s %s".debug, widget.relPath, key, skinName, value);

				if(typeof skinName === "undefined" || typeof skinRefs[skinName] === "undefined"){
					//The widget is pointing to a skin that doesn't exist.
					if(typeof brokenSkinRefs[value] === "undefined"){
						brokenSkinRefs[value] = [];
					}
					brokenSkinRefs[value].push(`${widget.relPath}/${key}`);
					console.log("Skin %s: %s does not exist".red, value, skinName);
				}
				else{
					skinRefs[skinName].push(`${widget.relPath}/${key}`);
				}
			}
		});
	}

	return skinRefs;
}

module.exports = countSkinUses;
