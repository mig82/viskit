"use strict";

const {buildSearchPath, find} = require("../helpers/ui-finder");
const isSearchAllOption = require("../helpers/is-search-all-option");
const stripPathEndSlash = require("../helpers/strip-path-end-slash");
const stripViewExtension = require("../helpers/strip-view-extension");

/**
 * findWidgets - Finds all the JSON files representing widgets in all the views matching a
 * specific channel, type of view, or view name.
 *
 * @param  String projectPath The path to the Visualizer project's root directory.
 * @param  String viewType    forms|popups|templates|userwidgets
 * @param  String channel     mobile|tablet|watch|androidwear|desktop
 * @param  String viewName    The name of the form, popup, template or component.
 * @param  Boolean verbose     Whether to print debug statements or not.
 * @return Array             An array of all the widget files contained in any view matching the input criteria.
 */
async function findWidgets(projectPath, viewType, channel, viewName, verbose){
	var patchedProjectPath = stripPathEndSlash(projectPath);
	var searchPath = buildSearchPath("widgets", patchedProjectPath, viewType, channel, stripViewExtension(viewName));
	return await find("widgets", searchPath, patchedProjectPath, verbose);
}

module.exports = findWidgets;
