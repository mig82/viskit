
const colors = require('colors');
const views = require("../config/views");
const widgets = require("../config/widgets");
const finder = require("../common/finder");
const differenceBy = require('lodash.differenceby');
const viewTypes = views.types;
const containerTypes = widgets.containerTypes;

/**
 * findOrphans - description
 *
 * @param  {type} projectPath description
 * @param  {type} viewType      description
 * @param  {type} channel     description
 * @param  {type} viewName      description
 * @param  {type} showAll     description
 * @param  {type} verbose     description
 * @return {type}             description
 */
async function findOrphans(projectPath, viewType, channel, viewName, showAll, verbose){
	const views = await finder.findViews(projectPath, viewType, channel, viewName, verbose);
	var projectOrphans = {};

	for(const view of views){
		var descendants = await finder.findViewDescendants(view, projectPath, verbose);
		if(verbose)console.debug("Descendants of: %s\n%o".debug,
			view.file,
			descendants.map(d=>{
				return d.file;
			})
		);
		var widgets = await finder.findWidgets(projectPath, view.viewType, view.channel, view.viewName, verbose);
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
		projectOrphans[view.viewName] = orphans;
	}
	return projectOrphans;
}

module.exports = findOrphans;
