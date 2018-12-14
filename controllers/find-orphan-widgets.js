
const colors = require('colors');
const globals = require("../config/globals");

const widgetFinder = require("./find-widgets");
const finder = require("../common/finder");

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
		var descendants = await finder.findViewDescendants(view, projectPath, verbose);
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

module.exports = {
	findOrphanWidgets: findOrphanWidgets
};
