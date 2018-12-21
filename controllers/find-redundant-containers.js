
const find = require('find');
const fs = require('fs-extra');
const colors = require('colors');
const views = require("../config/views");
const widgets = require("../config/widgets");
const viewTypes = views.types;
const containerTypes = widgets.containerTypes;
const findWidgets = require("../common/finder").findWidgets;

/**
 * findRedundantContainers - Find any container widgets -i.e. instances of
 * FlexContainer and VBox or HBox- which contain one or no children widgets.
 *
 * @param  String projectPath The absolute path to the Visualizer project's root directory.
 * @param  String viewType    The type of view to filter the search -i.e. forms, popups, templates, userwidgets.
 * @param  String channel     The channel to filter the search -i.e. mobile, tablet, watch, androidwear, desktop.
 * @param  String viewName    The name of the specific form, popup, template of userwidget to filter the search.
 * @param  Boolean ignoreEmpty Whether to include the empty containers in the results or not.
 * @param  Boolean showAll     Whether to include non redundant containers in the search or not.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return Array             An array of instances of MetaWidget representing all container widgets containing
 * fewer than two children widgets.
 */
async function findRedundantContainers(projectPath, viewType, channel, viewName, ignoreEmpty, showAll, verbose){
	var metaWidgets = await findWidgets(projectPath, viewType, channel, viewName, verbose);
	var redundantContainers = [];
	for(const metaWidget of metaWidgets){

		var widget = await fs.readJson(metaWidget.absPath);

		if(containerTypes.indexOf(widget.name) >= 0){

			var childCount = widget.children.length;
			metaWidget.info = `type: ${widget.wType}\tcount: ${childCount}`;

			switch (childCount) {
				case 0:
					if(!ignoreEmpty){
						metaWidget.color = "red";
						redundantContainers.push(metaWidget);
					}
					break;
				case 1:
					metaWidget.color = "yellow";
					redundantContainers.push(metaWidget);
					break;
				default:
					if(showAll){
						metaWidget.color = "green";
						redundantContainers.push(metaWidget);
					}
			}
		}
	}
	return redundantContainers;
}

module.exports = findRedundantContainers;
