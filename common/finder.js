
const fs = require('fs-extra');
const findFile = require('find').file;
const findDir = require('find').dir;
const Q = require('q');
Q.longStackSupport = true;
const globals = require("../config/globals");
const parser = require("./path-parser.js");

function buildSearchPath(searchFor, projectPath, uiType, channel, uiName){
	var path;

	var uiNameOptions = searchAll(uiName) ? ".*" : uiName;
	var channelOptions = searchAll(channel) ? "(" + globals.channels.join("|") + ")" : channel;
	var uiTypeOptions = searchAll(uiType) ? concatOptions(globals.uiSTypes) : uiType;

	if(searchAll(uiType)) {
		path = `^${projectPath}(` +
			`/${uiTypeOptions}/${channelOptions}/${uiNameOptions}` +
			"|" +
			`/userwidgets/${uiNameOptions}/userwidgetmodel` +
			")";
	}
	else if(uiType === "userwidgets"){
		path = `^${projectPath}/userwidgets/${uiNameOptions}/userwidgetmodel`
	}
	//Search forms, popups and templates only.
	else{
		path = `^${projectPath}/${uiTypeOptions}/${channelOptions}(/.*)*/${uiNameOptions}`;
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
	parser.setProjectPath(projectPath, true);

	return Q.Promise(function(resolve, reject, notify) {

		try{
			if(type === "w" || type === "widget" || type === "widgets"){
				findFile(searchPathRegex, projectPath, (filePaths) => {
					//console.log("%o".debug, filePaths);
					//parser.setProjectPath(projectPath);
					resolve(filePaths.map(filePath => {
						return parser.parseWidgetPath(filePath);
					}));
				})
			}
			else if(type === "v" || type === "view" || type === "views"){
				findDir(searchPathRegex, projectPath, (dirPaths) => {
					//console.log("%o".debug, dirPaths);
					//parser.setProjectPath(projectPath);
					resolve(dirPaths.map(dirPath => {
						return parser.parseViewPath(dirPath);
					}));
				})
			}
			else{
				reject(new Error("Unknown search type. Try 'views' or 'widgets'."));
			}
		}
		catch(e){
			reject(e);
		}
	});
}

function patchProjectPath(projectPath){
	if(projectPath.substr(-1) === '/'){
		return projectPath.slice(0, -1);
	}
	return projectPath;
}

function patchViewName(viewName){
	if(viewName && viewName.substr(-3) === '.sm'){
		return viewName.substr(0, viewName.length -3);
	}
	return viewName;
}

function searchAll(option){
	return !option || option.trim() === "all" || option.trim() === "";
}

function concatOptions(options){
	return "(" + options.join("|") + ")";
}

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
	var patchedProjectPath = patchProjectPath(projectPath);
	var searchPath = buildSearchPath("views", patchedProjectPath, viewType, channel, patchViewName(viewName));
	return await find("views", searchPath, patchedProjectPath, verbose);
}


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
	var patchedProjectPath = patchProjectPath(projectPath);
	var searchPath = buildSearchPath("widgets", patchedProjectPath, viewType, channel, patchViewName(viewName));
	return await find("widgets", searchPath, patchedProjectPath, verbose);
}

/**
 * findViewDescendants - Finds all widgets which descend from a given view -meaning that they are either
 * children of the view's top container or children of its children in any level.
 *
 * @param  Object view        An object containing the metadata for finding a view in the project structure. The
 * function findViews returns an array of such objects.
 * @param  String projectPath The path to the Visualizer project's root directory.
 * @param  Boolean verbose     Whether to print debug statements or not.
 * @return Array             An array of all the widgets descending from the given view.
 */
async function findViewDescendants(view, projectPath, verbose){

	var descendants = [view];

	if(verbose)console.log("\nAdding descendants of %s".debug, view.file);

	for(var k = 0; k < descendants.length; k++){
		if(verbose)console.log("\tdescendants[%d]".debug, k);

		var widget = fs.readJsonSync(descendants[k].absPath);
		//console.log("\t\t%s".debug, widget.children);
		if(widget.children){
			descendants = descendants.concat(widget.children.map(child => {
				var absPath = view.absDir + "/" + child + ".json";
				return parser.parseWidgetPath(absPath);
			}));
		}
		if(verbose)console.log("\t\t%s".debug, JSON.stringify(descendants.map(desc=>{
			return desc.file
		})));
	}

	//TODO: Implement the loop above in async mode. The code below won't work because
	//descendants doesn't get updated in time for the loop to continue.
	/*for (const desc of descendants) {
		const widget = await fs.readJson(desc.absPath);
		if(widget.children){
			descendants = descendants.concat(widget.children.map(child => {
				var absPath = view.absDir + "/" + child + ".json";
				return parser.parseWidgetPath(absPath);
			}));
		}
		if(verbose)logger.debug("\t\t%s", JSON.stringify(descendants.map(desc=>{
			return desc.file
		})));
	}*/

	return descendants;
}

module.exports = {
	findViews: findViews,
	findWidgets: findWidgets,
	findViewDescendants: findViewDescendants
};
