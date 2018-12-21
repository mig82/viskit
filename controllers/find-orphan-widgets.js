
const colors = require('colors');
const views = require("../config/views");
const widgets = require("../config/widgets");
const finder = require("../common/finder");
const differenceBy = require('lodash.differenceby');
const viewTypes = views.types;
const containerTypes = widgets.containerTypes;

/**
 * findOrphans - Finds all widget JSON files which despite being part of the project structure are not a parent
 * of the corresponding view's tree. Meaning, the widget's JSON file is contained inside the view's .sm directory
 * but the widget is not a descendant of the view. So, for instance, a form fooForm.sm contains a fooForm.json files
 * which declares a children property that lists the view's top level descendants. Each one of those descendants
 * declares a children property of their own and so this builds a tree. If a widget's JSON file is not mentioned
 * anywhere in said tree, then it is not a descendant of the view and thus it is considered an orphan. Which means
 * it's not really part of the view nor the project, but rather just litter and so it should be removed.
 *
 * @param  String projectPath The absolute path to the Visualizer project's root directory.
 * @param  String viewType    The type of view to filter the search -i.e. forms, popups, templates, userwidgets.
 * @param  String channel     The channel to filter the search -i.e. mobile, tablet, watch, androidwear, desktop.
 * @param  String viewName    The name of the specific form, popup, template of userwidget to filter the search.
 * @param  Boolean showAll     Whether to include non redundant containers in the search or not.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return Array             An array of instances of MetaWidget representing all widgets declaring a parent which
 * does not declare them back as a child.
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
