
const viewExtensionRegex = new RegExp(".sm$");

//Private non-static?
var projectPathRegex = undefined;

function Widget(widgetPath, projectPath){

	if(projectPath){
		Widget.setProjectPath(projectPath);
	}
	else if(!projectPathRegex){
		throw new Error(
			"Cannot parse a widget path without the project path. " +
			"Call Widget.setProjectPath(projectPath) at least once."
		);
	}

	var relPath = widgetPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var file = pathParts[pathParts.length - 1];
	var parent = pathParts[pathParts.length - 2];
	var gParent = pathParts[pathParts.length - 3];
	var viewType = pathParts[0];

	var channel, viewName;
	if(viewType === "userwidgets" || parent === "userwidgetmodel.sm"){
		channel = "all";
		viewName = gParent;
	}
	else{
		channel = pathParts[1];
		viewName = parent.replace(viewExtensionRegex, "");
	}

	this.file = file;
	this.viewName = viewName;
	this.viewType = viewType;
	this.channel = channel;
	this.relPath = relPath;
	this.absPath = widgetPath;
}

Widget.setProjectPath = function _setProjectPath(projectPath, force){

	if(!projectPath || projectPath.trim() === ""){
		throw new Error("Cannot set project path to null nor blank.");
	}

	if(!projectPathRegex || force){
		if(process.env.verbose){
			console.warn("Setting project path to %s. Do NOT do this more than once.", projectPath);
		}
		if(projectPath instanceof RegExp){
			projectPathRegex = projectPath;
		}
		else if(typeof projectPath === "string"){
			projectPathRegex = new RegExp("^" + projectPath + "/");
		}
		else{
			throw new Error("Cannot set project path a " + typeof projectPath);
		}
	}
	else{
		if(process.env.verbose)console.warn("Project path is already set.");
	}
}

Widget.getProjectPath = function _getProjectPath(){
	return projectPathRegex;
}
Widget.resetProjectPath = function _resetProjectPath(){
	projectPathRegex = null;
}

module.exports = Widget;
