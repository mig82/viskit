
const fs = require('fs-extra');
const findFile = require('find').file;
const findDir = require('find').dir;
const Q = require('q');
Q.longStackSupport = true;
const channels = require("../../config/channels");
const views = require("../../config/views");
const Widget = require("../../models/widget");
const View = require("../../models/view");
const searchAll = require("../search-all");
const stripPathEndSlash = require("../strip-path-end-slash");

function buildSearchPath(searchFor, projectPath, viewType, channel, viewName){
	var path;

	var viewNameOptions = searchAll(viewName) ? ".*" : viewName;
	var channelOptions = searchAll(channel) ? "(" + channels.types.join("|") + ")" : channel;
	var viewTypeOptions = searchAll(viewType) ? concatOptions(views.standardTypes) : viewType;

	if(searchAll(viewType)) {
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

function patchViewName(viewName){
	if(viewName && viewName.substr(-3) === '.sm'){
		return viewName.substr(0, viewName.length -3);
	}
	return viewName;
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
	var patchedProjectPath = stripPathEndSlash(projectPath);
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
	var patchedProjectPath = stripPathEndSlash(projectPath);
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
			Widget.setProjectPath(projectPath);
			//Let's add the children of this widget to the list we're iterating over.
			descendants = descendants.concat(widget.children.map(child => {
				var absPath;

				//TabPanes have a nested structure. The Tab is a child if the TabPane.
				if(Widget.isTabPane(widget)){
					absPath = view.absDir + "/__" + widget.id + "__/" + child + ".json";
				}
				else{
					absPath = view.absDir + "/" + child + ".json";
				}
				return new Widget(absPath);
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
				return new Widget(absPath);
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
