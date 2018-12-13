
const fs = require('fs-extra');
const colors = require('colors');
const globals = require("../config/globals");
const widgetFinder = require("./find-widgets");
const parser = require("../common/path-parser.js");
const differenceBy = require('lodash.differenceby');

const uiTypes = globals.uiTypes;
const containerTypes = globals.containerTypes;

/**
 * findOrphanWidgets - description
 *
 * @param  {type} projectPath description
 * @param  {type} uiType      description
 * @param  {type} channel     description
 * @param  {type} uiName      description
 * @param  {type} showAll     description
 * @param  {type} verbose     description
 * @return {type}             description
 */
async function findOrphanWidgets(projectPath, uiType, channel, uiName, showAll, verbose){
	const views = await widgetFinder.findViews(projectPath, uiType, channel, uiName, verbose);
	var projectOrphans = {};

	for(const view of views){
		var descendants = await findViewDescendants(view, projectPath, verbose);
		if(verbose)console.debug("Descendants of: %s\n%o".debug,
			view.file,
			descendants.map(d=>{
				return d.file;
			})
		);
		var widgets = await widgetFinder.findWidgets(projectPath, view.uiType, view.channel, view.uiName, verbose);
		if(verbose)console.debug("Widgets of: %s\n%o".debug,
			view.file,
			widgets.map(w=>{
				return w.file;
			})
		);
		var orphans = differenceBy(widgets, descendants, widget => {
			//return widget.absPath;
			return widget.absPath.toLowerCase();
		});
		if(verbose)console.debug("Orphans of: %s\n%o".debug,
			view.file,
			orphans.map(o=>{
				return o.file;
			})
		);
		projectOrphans[view.uiName] = orphans;
	}
	return projectOrphans;
}

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
	findOrphanWidgets: findOrphanWidgets
};
