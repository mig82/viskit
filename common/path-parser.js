const colors = require("colors");
const uiExtensionRegex = new RegExp(".sm$");
var projectPathRegex;
const noProjectPathErrorMsg = "Can't parse ${target} path without a project " +
" path. Must first call setProjectPathRegex('path/to/workspace/project')";


/**
 * setProjectPath - Parse the path to a view's .sm directory to produce a map of metadata
 * that can be more easily used to refer to the view, print a short name for it, group
 * it with others by channel, view type, etc.
 *
 * @param  String projectPath The absolute path to the Visualizer project root.
 * @param  Boolean force       Whether to reset the project path despite it being already set.
 */
function setProjectPath(projectPath, force){
	if(projectPath){

		if(!projectPathRegex || force){
			if(process.env.verbose)console.warn("Setting project path to %s. Do NOT do this more than once.".warn, projectPath);
			projectPathRegex = new RegExp("^" + projectPath + "/");
		}
		else{
			if(process.env.verbose)console.warn("Project path is already set.".warn);
		}

	}
	else{
		throw new Error("Cannot set project path to null.");
	}
}
/**
 * parseWidgetPath - Parse the path to a widget's JSON file to produce a map of metadata
 * that can be more easily used to refer to the widget, print a short name for it, group
 * it with others by channel, view type or view, etc.
 *
 * @param  String widgetPath  description
 * @return Object             A map of metadata on the widget, including its absolute path,
 * path relative to the project root, channel, type of view and JSON file name.
 */
function parseWidgetPath(widgetPath){

	if(!projectPathRegex){
		throw new Error(noProjectPathErrorMsg.replace("${target}", "widget"));
	}
	var relPath = widgetPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var file = pathParts[pathParts.length - 1];
	var parent = pathParts[pathParts.length - 2];
	var gParent = pathParts[pathParts.length - 3];
	var uiType = pathParts[0];

	var channel, uiName;
	if(uiType === "userwidgets" || parent === "userwidgetmodel.sm"){
		channel = "all";
		uiName = gParent;
	}
	else{
		channel = pathParts[1];
		uiName = parent.replace(uiExtensionRegex, "");
	}

	return {
		file: file,
		uiName: uiName,
		uiType: uiType,
		channel: channel,
		relPath: relPath,
		absPath: widgetPath
	}
}

/**
 * parseViewPath - TODO
 *
 * @param  String viewPath    description
 * @return Object             A map of metadata on the view, including its absolute path,
 * path relative to the project root, channel, type of view and directory name.
 */
function parseViewPath(viewPath){

	if(!projectPathRegex){
		throw new Error(noProjectPathErrorMsg.replace("${target}", "view"));
	}

	var relPath = viewPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var uiType = pathParts[0];
	var lastDir = pathParts[pathParts.length - 1];

	var file, channel, uiName;
	if(uiType === "userwidgets" || lastDir === "userwidgetmodel.sm"){
		channel = "all";
		uiName = pathParts[pathParts.length - 2];
		//uiName will be name-spaced -e.g. com.acme.FooComponent
		//file = uiName.substring(uiName.lastIndexOf(".")+1) + ".json";
		file = "userwidgetmodel.json"
	}
	else{
		channel = pathParts[1];
		uiName = lastDir.replace(uiExtensionRegex, "");
		file = uiName + ".json";
	}

	return {
		file: file,
		uiName: uiName,
		uiType: uiType,
		channel: channel,
		absDir: viewPath,
		relPath: relPath += "/" + file,
		absPath: viewPath += "/" + file
	}
}

module.exports = {
	setProjectPath: setProjectPath,
	parseWidgetPath: parseWidgetPath,
	parseViewPath: parseViewPath
};
