"use strict";

const fs = require("fs-extra");
const colors = require('colors');
const forOwn = require('lodash.forown');

const Action = require("../models/Action");
const findActionFiles = require("../operations/find-action-files");
const findAppActions = require("../operations/find-app-actions");
const findWidgetActions = require("../operations/find-widget-actions");

async function findActionReferences(projectPath, viewType, channel, viewName, verbose){

	//Find all action editor files -e.g.: [studio]actions/mobile/AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5.json
	var actionFiles = await findActionFiles(projectPath, channel, verbose);

	//A map where the keys are action names and the values are arrays of all the widgets that refer to them.
	var validActionRefs = {};
	var brokenActionRefs = {};

	//An array for the action names which do not match Vis auto-generated names.
	var nonCompliantActionNames = [];

	for (var actionModel of actionFiles) {
		actionModel.refs = []; //An array to hold all the refernces to this file we find.
		validActionRefs[actionModel.name] = actionModel;

		if(!Action.regex.test(actionModel.name)){
			nonCompliantActionNames.push(actionModel.name);
		}
	}
	if(verbose)console.log("Found %d of %d non-compliant action names".debug,
		nonCompliantActionNames.length,
		actionFiles.length,
		nonCompliantActionNames
	);

	//Parse projectProperties.json and look for
	//	"appEvents": {
	//		"mobile": {
	//			"preappinit": "AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5"
	//		}
	//}	,
	var appActionsRefs = await findAppActions(projectPath, channel, verbose);

	//Parse each widget and look for attributes like "onclick": "AS_Button_a8bfa9510246463ab518f540d0279e13"
	var widgetActionRefs = await findWidgetActions(projectPath, viewType, channel, viewName, nonCompliantActionNames, verbose);

	var actionRefs = appActionsRefs.concat(widgetActionRefs);
	for (var actionRef of actionRefs) {
		if(validActionRefs[actionRef.actionName]){
			validActionRefs[actionRef.actionName].refs.push(actionRef.ref);
		}
		else{
			if(verbose)console.log("Found broken ref to %s at %s".debug, actionRef.actionName, actionRef.ref);
		}
	}

	return {
		valid: validActionRefs,
		broken: brokenActionRefs
	};
}

module.exports = findActionReferences;
