"use strict";

const forOwn = require('lodash.forown');

const flattenObject = require("../../common/object/flatten");
const readProjectPropertiesJson = require("./read-project-properties-json");

const colors = require("colors");
const theme = require("../config/theme.js");
colors.setTheme(theme);

/**
 * findAppActions - Parse projectProperties.json and look for
 * "appEvents": {
 * 	"mobile": {
 * 		"preappinit": "AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5"
 * 	}
 *
 * @return {type}  description
 */
async function findAppActions(projectPath, channel, verbose){

	var eventsKey, appEvents;
	var appActions = [];
	var projectProperties = await readProjectPropertiesJson(projectPath, verbose);

	if(projectProperties.appEvents){
		eventsKey = "appEvents";
		appEvents = projectProperties.appEvents;
	}
	else if(projectProperties.ide_appEvents){
		eventsKey = "ide_appEvents"
		appEvents = projectProperties.ide_appEvents;
	}

	if(appEvents){
		//console.log(appEvents);
		appEvents = flattenObject(appEvents);
		forOwn(appEvents, (actionName, eventName) => {
			var ref = `projectProperties.json/${eventsKey}/${eventName}`;
			if(verbose)console.log("Found action ref at %s: %s".debug, ref, actionName);
			appActions.push({
				ref: ref,
				actionName: actionName
			});
		});
	}
	else{
		if(verbose)console.log("No app events found".debug);
	}
	return appActions;
}

module.exports = findAppActions;
