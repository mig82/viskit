"use strict";

const channels = require("../config/channels");
const views = require("../config/views");
const isSearchAllOption = require("./is-search-all-option");
const concatOptions = require("./concat-options");

function buildUiSearchPath(searchFor, projectPath, viewType, channel, viewName){
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

module.exports = buildUiSearchPath;
