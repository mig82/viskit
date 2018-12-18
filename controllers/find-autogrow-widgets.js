
const fs = require('fs-extra');
const colors = require('colors');
const views = require("../config/views");
const widgets = require("../config/widgets");
const findWidgets = require("../common/finder").findWidgets;

const viewTypes = views.types;
const containerTypes = widgets.containerTypes;

/**
* Find all widgets for which with or height are not defined.
*/
/*function findAutogrowWidgets(projectPath, viewType, channel, viewName, showAll, verbose){
	return findWidgets(projectPath, viewType, channel, viewName, verbose)
	.then(widgets => {
		widgets.forEach(widget => {
			isAutogrowWidget(widget.relPath, widget.absPath, showAll, verbose);
		});
	});
}*/
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
				widgetMeta.color = "error";
			}
			else{
				widgetMeta.color = "warn";
			}
			autogrowWidgets.push(widgetMeta);
		}
	}
	return autogrowWidgets;
}

/**
* Determine if a widget lacks a height or width definition.
*/
/*async function isAutogrowWidget(widgetDisplayName, widgetPath, showAll, verbose){

	var widget = await fs.readJson(widgetPath);

	if(verbose)
	console.log("\t%s\tw: %o\th: %o".debug, widgetDisplayName, widget._width_, widget._height_);

	if(!isForm(widget)){
		if(!isWidgetWidthDefined(widget) && !isWidgetHeightDefined(widget)){
			console.log("\t%s\tw: %s\th: %s".red, widgetDisplayName, getWidgetWidth(widget), getWidgetHeight(widget));
		}
		else if(!isWidgetWidthDefined(widget)){
			console.log("\t%s\tw: %s".yellow, widgetDisplayName, getWidgetWidth(widget));
		}
		else if(!isWidgetHeightDefined(widget)){
			console.log("\t%s\th: %s".yellow, widgetDisplayName, getWidgetHeight(widget));
		}
		else{
			if(showAll)
			console.log("\t%s\tw: %s\th: %s".green, widgetDisplayName, getWidgetWidth(widget), getWidgetHeight(widget));
		}
	}
}*/

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
