"use strict";

const fs = require('fs-extra');
const findFile = require('find').file;
const Q = require('q');
Q.longStackSupport = true;

const Widget = require("../models/Widget");

const concatOptions = require("../helpers/concat-options");
const isSearchAllOption = require("../helpers/is-search-all-option");
const buildSearchPath = require("../helpers/build-ui-search-path");
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

	if(verbose)
	console.log("Looking for:\n\t%s\n".debug, searchPath);

	var patchedProjectPath = stripPathEndSlash(projectPath);
	var searchPath = buildSearchPath("widgets", patchedProjectPath, viewType, channel, stripViewExtension(viewName));

	var searchPathRegex = new RegExp(searchPath);

	return Q.Promise(function(resolve, reject, notify) {

		fs.pathExists(projectPath)
		.then(exists => {
			if(exists){
				//console.log("Looking for widgets...".debug);
				findFile(searchPathRegex, projectPath, (filePaths) => {
					Widget.setProjectPath(projectPath, true);
					resolve(filePaths.map(filePath => {
						return new Widget(filePath);
					}));
				})
			}
			else {
				reject(new Error("Project path does not exist."));
			}
		})
		.catch(error => {
			reject(error);
		});
	});
}

module.exports = findWidgets;
