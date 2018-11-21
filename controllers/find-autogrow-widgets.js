
const find = require('find');
const fs = require('fs-extra');
const colors = require('colors');
const globals = require("../config/globals");

const uiTypes = globals.uiTypes;
const containerTypes = globals.containerTypes;

function findAutogrowWidgets(projectPath, channel, showAll, verbose){

	if(projectPath.substr(-1) !== '/'){
		projectPath += '/';
	}
	console.log('Finding auto-grow widgets for project %s'.info, projectPath);

	if(channel){

		var searchPath = projectPath + "forms/" + channel + "/";

		if(verbose)
		console.log('Searching in channel %s'.debug, searchPath);

		searchPathForAutoGrowWidgets(searchPath, showAll, verbose);
	}
	else{

		if(verbose)
		console.log('Searching all project %s'.debug, projectPath);

		uiTypes.forEach(uiType => {
			//Search in path/to/project/forms, path/to/project/templates, etc.
			var searchPath = projectPath + uiType + "/";

			searchPathForAutoGrowWidgets(searchPath, showAll, verbose);
		});
	}
}

function searchPathForAutoGrowWidgets(searchPath, showAll, verbose){

	fs.pathExists(searchPath)
	//TODO: If fs.emptyDir(searchPath).then say something.
	.then(exists => {
		if(exists){

			var searchPathRegex = new RegExp("^" + searchPath);

			find.eachfile(/\.json$/, searchPath, (widgetPath) => {

				var widgetDisplayName = widgetPath.replace(searchPathRegex, '');

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
			});
		}
		else{
			console.log("Path %s does NOT exist".warn, searchPath);
		}
	});
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
