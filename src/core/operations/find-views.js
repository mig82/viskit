"use strict";

const fs = require('fs-extra');
const findDir = require('find').dir;
const Q = require('q');
Q.longStackSupport = true;

const View = require("../models/View");

const concatOptions = require("../helpers/concat-options");
const isSearchAllOption = require("../helpers/is-search-all-option");
const buildSearchPath = require("../helpers/build-ui-search-path");
const stripPathEndSlash = require("../helpers/strip-path-end-slash");
const stripViewExtension = require("../helpers/strip-view-extension");

 /**
 * findViews - Finds all the .sm directories representing views matching a
 * specific channel, type of view, or view name.
 *
 * @param  String projectPath The path to the Visualizer project's root directory.
 * @param  String viewType    form|popup|template|userwidget
 * @param  String channel     mobile|tablet|watch|androidwear|desktop
 * @param  String viewName    The name of the form, popup, template or component.
 * @param  Boolean verbose     Whether to print debug statements or not.
 * @return Array             An array of all the widgets matching the input criteria.
 */
 async function findViews(projectPath, viewType, channel, viewName, verbose){

	var patchedProjectPath = stripPathEndSlash(projectPath);
 	var searchPath = buildSearchPath("views", patchedProjectPath, viewType, channel, stripViewExtension(viewName));

	if(verbose)
	console.log("Looking for:\n\t%s\n".debug, searchPath);

	var searchPathRegex = new RegExp(searchPath);

	return Q.Promise(function(resolve, reject, notify) {

		fs.pathExists(projectPath)
		.then(exists => {
			if(exists){
				//console.log("Looking for views...".debug);
				findDir(searchPathRegex, projectPath, (dirPaths) => {
					View.setProjectPath(projectPath, true);
					resolve(dirPaths.map(dirPath => {
						return new View(dirPath);
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

module.exports = findViews;
