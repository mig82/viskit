"use strict";

const fs = require("fs-extra");
const forOwn = require('lodash.forown');

const flattenObject = require("../../common/object/flatten");
const findWidgets = require("./find-widgets");
const Action = require("../models/Action");

const colors = require("colors");
const theme = require("../config/theme.js");
colors.setTheme(theme);

/**
 * findWidgetActions - Parse each widget and look for attributes -e.g.:
 * "onclick": "AS_Button_a8bfa9510246463ab518f540d0279e13"
 *
 * @return {type}  description
 */
async function findWidgetActions(projectPath, viewType, channel, viewName, nonCompliantActionNames, verbose){

	var widgetEvents;
	var widgetActions = [];
	var widgets = await findWidgets(projectPath, viewType, channel, viewName, verbose);

	for (var widget of widgets) {
		var json = await fs.readJson(widget.absPath);
		json = flattenObject(json);
		forOwn(json, (value, key) => {
			if(typeof value === "string" && (
				Action.regex.test(value) ||
				nonCompliantActionNames.indexOf(value) >= 0
			)){
				var ref = `${widget.relPath}/${key}`;
				if(verbose)console.log("Found action ref at %s: %s".debug, ref, value);
				widgetActions.push({
					ref: ref,
					actionName: value
				});
			}
		});
	}

	return widgetActions;
}

module.exports = findWidgetActions;
