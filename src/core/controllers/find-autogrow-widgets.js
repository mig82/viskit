
const fs = require('fs-extra');
const colors = require('colors');
const views = require("../config/views");
const widgets = require("../config/widgets");
const findWidgets = require("../helpers/finders/ui-finder").findWidgets;

const viewTypes = views.types;
const containerTypes = widgets.containerTypes;

/**
 * Find all widgets for which the width or height properties are not defined.
 *
 * @param  String projectPath The absolute path to the Visualizer project's root directory.
 * @param  String viewType    The type of view to filter the search -i.e. forms, popups, templates, userwidgets.
 * @param  String channel     The channel to filter the search -i.e. mobile, tablet, watch, androidwear, desktop.
 * @param  String viewName    The name of the specific form, popup, template of userwidget to filter the search.
 * @param  Boolean showAll     Whether to include non redundant containers in the search or not.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return Array             An array of instances of MetaWidget representing all widgets which do not have a
 * defined width or height.
 */
async function findAutogrowWidgets(projectPath, viewType, channel, viewName, showAll, verbose){
	var widgetMetas = await findWidgets(projectPath, viewType, channel, viewName, verbose);
	var autogrowWidgets = [];
	for(const widgetMeta of widgetMetas){

		var widget = await fs.readJson(widgetMeta.absPath);

		var isWidthDef = isWidgetWidthDefined(widget);
		var isHeightDef = isWidgetHeightDefined(widget);
		if(!isForm(widget) && (!isWidthDef || !isHeightDef)){
			widgetMeta.info = `w: ${getWidgetWidth(widget)}\th: ${getWidgetHeight(widget)}`;
			if(!isWidthDef && !isHeightDef){
				widgetMeta.color = "red";
			}
			else{
				widgetMeta.color = "yellow";
			}
			autogrowWidgets.push(widgetMeta);
		}
	}
	return autogrowWidgets;
}

async function isAutogrowWidget(widgetDisplayName, widgetPath, showAll, verbose){

	var isAutogrow = false;
	var widget = await fs.readJson(widgetPath);

	if(verbose)
	console.log("\t%s\tw: %o\th: %o".debug, widgetDisplayName, widget._width_, widget._height_);

	if(!isForm(widget)){
		if(!isWidgetWidthDefined(widget) || !isWidgetHeightDefined(widget) || widget.autogrowmode){
			isAutogrow = true;
		}
	}
	return isAutogrow;
}

function isForm(widget){
	return widget.wType === "Form" || widget.name === "kony.ui.Form2";
}
function isWidgetHeightDefined(widget){
	return widget && widget._height_ && widget._height_.type !== "ref" && widget._height_.value !== "preferred";
}

function isWidgetWidthDefined(widget){
	return widget && widget._width_ && widget._width_.type !== "ref" && widget._width_.value !== "preferred";
}

function getWidgetHeight(widget){
	if(widget && widget._height_){
		return widget._height_.value;
	}
	else {
		return undefined;
	}
}

function getWidgetWidth(widget){
	if(widget && widget._width_){
		return widget._width_.value;
	}
	else {
		return undefined;
	}
}

module.exports = findAutogrowWidgets;
