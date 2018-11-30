
const fs = require('fs-extra');
const colors = require('colors');
const globals = require("../config/globals");
const widgetFinder = require("./find-widgets");

const uiTypes = globals.uiTypes;
const containerTypes = globals.containerTypes;

/**
* Find all widgets for which with or height are not defined.
*/
function findAutogrowWidgets(projectPath, uiType, channel, uiName, showAll, verbose){
	return widgetFinder.findWidgets(projectPath, uiType, channel, uiName, verbose)
	.then(widgets => {
		widgets.forEach(widget => {
			isAutogrowWidget(widget.relPath, widget.absPath, showAll, verbose);
		});
	});
}

/**
* Determine if a widget lacks a height or width definition.
*/
function isAutogrowWidget(widgetDisplayName, widgetPath, showAll, verbose){

	fs.readJson(widgetPath)
	.then(widget => {

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
	})
	.catch(err => {
		console.error(err)
	})
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

module.exports = {
	findAutogrowWidgets: findAutogrowWidgets
};
