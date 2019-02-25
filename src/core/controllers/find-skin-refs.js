"use strict";

const fs = require("fs-extra");
const colors = require('colors');
const forOwn = require('lodash.forown');

const Skin = require("../models/Skin");
const findSkins = require("../operations/find-skins");
const findWidgets = require("../operations/find-widgets.js");

async function findSkinReferences(projectPath, viewType, channel, viewName, theme, verbose){
	//TODO: take the theme name as a paramter.
	if(typeof theme === "undefined"){
		theme = "defaultTheme";
	}
	var skins = await findSkins(projectPath, theme, verbose)

	//A map where the keys are skin names and the values are arrays of all the widgets that refer to them.
	var validSkinRefs = {};
	var brokenSkinRefs = {};

	//A map where the keys are the unique id's of skins and the values are their names.
	var skinIdToNameMap = {};

	for (var skin of skins) {

		skin.refs = [];
		validSkinRefs[skin.name] = skin;

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

				if(typeof skinName === "undefined" || typeof validSkinRefs[skinName] === "undefined"){
					//The widget is pointing to a skin that doesn't exist.
					if(verbose)console.log("Skin %s: %s does NOT exist".debug, value, skinName);
					if(typeof brokenSkinRefs[value] === "undefined"){
						brokenSkinRefs[value] = [];
					}
					brokenSkinRefs[value].push(`${widget.relPath}/${key}`);
				}
				else{
					validSkinRefs[skinName].refs.push(`${widget.relPath}/${key}`);
				}
			}
		});
	}

	return {
		valid: validSkinRefs,
		broken: brokenSkinRefs
	};
}

module.exports = findSkinReferences;
