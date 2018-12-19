
const viewExtensionRegex = new RegExp(".sm$");

//Private non-static?
var projectPathRegex = undefined;

function View(viewPath, projectPath){

	if(projectPath){
		View.setProjectPath(projectPath);
	}
	else if(!projectPathRegex){
		throw new Error(
			"Cannot parse a view path without the project path. " +
			"Call View.setProjectPath(projectPath) at least once."
		);
	}

	var relPath = viewPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var viewType = pathParts[0];
	var lastDir = pathParts[pathParts.length - 1];

	var file, channel, viewName;
	if(viewType === "userwidgets" || lastDir === "userwidgetmodel.sm"){
		channel = "all";
		viewName = pathParts[pathParts.length - 2];
		//viewName will be name-spaced -e.g. com.acme.FooComponent
		//file = viewName.substring(viewName.lastIndexOf(".")+1) + ".json";
		file = "userwidgetmodel.json"
	}
	else{
		channel = pathParts[1];
		viewName = lastDir.replace(viewExtensionRegex, "");
		file = viewName + ".json";
	}

	this.file = file;
	this.viewName = viewName;
	this.viewType = viewType;
	this.channel = channel;
	this.absDir = viewPath;
	this.relPath = `${relPath}/${file}`;
	this.absPath = `${viewPath}/${file}`;
}

View.setProjectPath = function _setProjectPath(projectPath, force){

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

View.getProjectPath = function _getProjectPath(){
	return projectPathRegex;
}
View.resetProjectPath = function _resetProjectPath(){
	projectPathRegex = null;
}

module.exports = View;
