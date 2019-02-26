const path = require("path");
const findFile = require("find").file;
const fs = require("fs-extra");
const colors = require("colors");
const theme = require("../config/theme.js");
colors.setTheme(theme);
const Q = require("q");
Q.longStackSupport = true;

const stripPathEndSlash = require("../helpers/strip-path-end-slash");
const Action = require("../models/Action")


/**
 * findActionFiles - Find all action editor files -e.g.:
 * actions/mobile/AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5.json
 * studioactions/mobile/AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5.json
 *
 * @param  {type} projectPath description
 * @param  {type} channel     description
 * @param  {type} verbose     description
 * @return {type}             description
 */
function findActionFiles(projectPath, channel, verbose){
	var projectRootPath = stripPathEndSlash(projectPath);

	//TODO: Include option for studioactions
	var searchPath = "/(studioactions|actions)/";
	searchPath += channel?channel:".*";
	searchPath += "/.*\\.json$";
	var searchPathRegex = new RegExp(searchPath, "i");

	if(verbose) console.log(colors.debug("Looking for actions:\n\tRegexp: %s\n\tProject actions: %s"),
		searchPathRegex,
		projectRootPath
	);

	return Q.Promise(function(resolve, reject, notify) {

		fs.pathExists(projectRootPath)
		.then(exists => {
			if(exists){
				findFile(searchPathRegex, projectRootPath, (actionPaths) => {
					Action.setProjectPath(projectPath, true);
					var actionPaths = actionPaths.map(actionPath => {
						return Action.fromPath(actionPath);
					});
					//console.log(actionPaths);
					resolve(actionPaths);
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

module.exports = findActionFiles;
