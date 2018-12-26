
const find = require('find');
const fs = require('fs-extra');
const colors = require('colors');
const viewTypes = require("../config/views.js").types;
const finder = require("../common/finder");

/**
*
*/


/**
 * countWidgets - Count the widgets for each form, template, popup or component according to the
 * project structure -i.e. the number of widget JSON files in each view directory, regardless of
 * whether those widgets are orphaned or not.
 *
 * @param  String projectPath The absolute path to the Visualizer project's root directory.
 * @param  String viewType    The type of view to filter the search -i.e. forms, popups, templates, userwidgets.
 * @param  String channel     The channel to filter the search -i.e. mobile, tablet, watch, androidwear, desktop.
 * @param  String viewName    The name of the specific form, popup, template of userwidget to filter the search.
 * @param  Boolean showAll     Whether to include non redundant containers in the search or not.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return Object             A map where each property is the name of a view type -e.g. forms, popups, templates
 * or components- and the value is an array of the views returned with the widget count for each.
 */
async function countWidgets(projectPath, viewType, channel, viewName, verbose){
	if(verbose)console.log('Counting widgets for project %s'.debug, projectPath);

	var counts = {
		/*forms: []
		*/
	};

	for(viewType of viewTypes){

		var viewTypePath = projectPath + "/" + viewType;
		var viewTypePathExists = await fs.pathExists(viewTypePath);
		if(viewTypePathExists){

			if(verbose)console.log('Counting widgets for view type: %s'.debug, viewType);
			counts[viewType] = [];
			var views = await finder.findViews(projectPath, viewType, channel, viewName, verbose);

			for(view of views){
				if(verbose)console.log('Counting widgets for view: %s'.debug, view.viewName);
				var widgets = await finder.findWidgets(projectPath, viewType, channel, view.viewName, verbose);
				var widgetCount = widgets.length;
				view.info = widgetCount;
				if(widgetCount <= 200){
					view.color = "green";
				}
				else if(widgetCount > 400){
					view.color = "red";
				}
				else{
					view.color = "yellow";
				}
				counts[viewType].push(view);
			}
		}
	}
	return counts;
}

module.exports = countWidgets;
