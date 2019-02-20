"use strict";

const {buildSearchPath, find} = require("../helpers/ui-finder");
const isSearchAllOption = require("../helpers/is-search-all-option");
const stripPathEndSlash = require("../helpers/strip-path-end-slash");
const stripViewExtension = require("../helpers/strip-view-extension");

/**
 * findViews - Finds all the .sm directories representing views matching a
 * specific channel, type of view, or view name.
 *
 * @param  String projectPath The path to the Visualizer project's root directory.
 * @param  String viewType    forms|popups|templates|userwidgets
 * @param  String channel     mobile|tablet|watch|androidwear|desktop
 * @param  String viewName    The name of the form, popup, template or component.
 * @param  Boolean verbose     Whether to print debug statements or not.
 * @return Array             An array of all the widgets matching the input criteria.
 */
async function findViews(projectPath, viewType, channel, viewName, verbose){
	var patchedProjectPath = stripPathEndSlash(projectPath);
	var searchPath = buildSearchPath("views", patchedProjectPath, viewType, channel, stripViewExtension(viewName));
	return await find("views", searchPath, patchedProjectPath, verbose);
}

module.exports = findViews;
