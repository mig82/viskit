"use strict";

const fs = require('fs-extra');
const findFile = require('find').file;
const findDir = require('find').dir;
const Q = require('q');
Q.longStackSupport = true;
const channels = require("../config/channels");
const views = require("../config/views");
const Widget = require("../models/Widget");
const View = require("../models/View");
const isSearchAllOption = require("./is-search-all-option");
const concatOptions = require("./concat-options");

function buildSearchPath(searchFor, projectPath, viewType, channel, viewName){
	var path;

	var viewNameOptions = isSearchAllOption(viewName) ? ".*" : viewName;
	var channelOptions = isSearchAllOption(channel) ? "(" + channels.types.join("|") + ")" : channel;
	var viewTypeOptions = isSearchAllOption(viewType) ? concatOptions(views.standardTypes) : viewType;

	if(isSearchAllOption(viewType)) {
		path = `^${projectPath}(` +
			`/${viewTypeOptions}/${channelOptions}/${viewNameOptions}` +
			"|" +
			`/userwidgets/${viewNameOptions}/userwidgetmodel` +
			")";
	}
	else if(viewType === "userwidgets"){
		path = `^${projectPath}/userwidgets/${viewNameOptions}/userwidgetmodel`
	}
	//Search forms, popups and templates only.
	else{
		path = `^${projectPath}/${viewTypeOptions}/${channelOptions}(/.*)*/${viewNameOptions}`;
	}

	if(searchFor === "w" || searchFor === "widget" || searchFor === "widgets"){
		path += "\\.sm/.*\\.json$";
	}
	else if (searchFor === "v" || searchFor === "view" || searchFor === "views"){
		path += "\\.sm$";
	}
	return path;
}

function find(type, searchPath, projectPath, verbose){
	if(verbose)
	console.log("Looking for:\n\t%s\n".debug, searchPath);

	var searchPathRegex = new RegExp(searchPath);

	return Q.Promise(function(resolve, reject, notify) {

		fs.pathExists(projectPath)
		.then(exists => {
			if(exists){
				if(type === "w" || type === "widget" || type === "widgets"){
					//console.log("Looking for widgets...".debug);
					findFile(searchPathRegex, projectPath, (filePaths) => {
						Widget.setProjectPath(projectPath, true);
						resolve(filePaths.map(filePath => {
							return new Widget(filePath);
						}));
					})
				}
				else if(type === "v" || type === "view" || type === "views"){
					//console.log("Looking for views...".debug);
					findDir(searchPathRegex, projectPath, (dirPaths) => {
						View.setProjectPath(projectPath, true);
						resolve(dirPaths.map(dirPath => {
							return new View(dirPath);
						}));
					})
				}
				else{
					reject(new Error("Unknown search type. Try 'views' or 'widgets'."));
				}
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

module.exports = {
	find: find,
	buildSearchPath: buildSearchPath
};
