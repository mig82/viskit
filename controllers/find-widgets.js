const find = require('find');
const Q = require('q');
Q.longStackSupport = true;

const globals = require("../config/globals");

var uiExtensionRegex = new RegExp(".sm$");

function searchAll(option){
	return !option || option.trim() === "all" || option.trim() === "";
}

function concatOptions(options){
	return "(" + options.join("|") + ")";
}

function findWidgets(projectPath, uiType, channel, uiName, verbose){

	if(verbose)
	console.log("uiType: %s\nchannel: %s\nuiName: %s".debug, uiType, channel, uiName);

	if(projectPath.substr(-1) === '/'){
		projectPath = projectPath.slice(0, -1);
	}
	if(uiName && uiName.substr(-3) !== '.sm'){
		//uiName += '.sm';
	}

	var widgetPath = "^$";
	var uiNameOptions = searchAll(uiName) ? ".*" : uiName;
	var channelOptions = searchAll(channel) ? "(" + globals.channels.join("|") + ")" : channel;
	var uiTypeOptions = searchAll(uiType) ? concatOptions(globals.uiSTypes) : uiType;

	if(searchAll(uiType)) {
		widgetPath = `^${projectPath}(` +
			`/${uiTypeOptions}/${channelOptions}/${uiNameOptions}` +
			"|" +
			`/userwidgets/${uiNameOptions}/userwidgetmodel` +
			")\\.sm/.*\\.json$";
	}
	else if(uiType === "userwidgets"){
		widgetPath = `^${projectPath}/userwidgets/${uiNameOptions}/userwidgetmodel\\.sm/.*\\.json$`
	}
	//Search forms, popups and templates only.
	else{
		//var wIndex = globals.uiTypes.indexOf("userwidgets");
		widgetPath = `^${projectPath}/${uiTypeOptions}/${channelOptions}(/.*)*/${uiNameOptions}\\.sm/.*\\.json$`;
	}

	if(verbose)
	console.log("Looking for:\n\t%s\n".debug, widgetPath);

	var widgetPathRegex = new RegExp(widgetPath);

	return Q.Promise(function(resolve, reject, notify) {
		try{
			find.file(widgetPathRegex, projectPath, (filePaths) => {
				//console.log("%o".debug, filePaths);
				resolve(filePaths.map(filePath => {
					return parseWidgetPath(filePath, projectPath);
				}));
			})
		}
		catch(e){
			reject(e);
		}
	});
}

/**
 * findViews - Finds all forms, templates, popups and reusable components by looking for the
 * following paths:
 * <ul>
 * 		<li>templates/[mobile|tablet|desktop|watch|androidwear]/segments/[template name].sm</li>
 * 		<li>forms/[mobile|tablet|desktop|watch|androidwear]/[form name].sm</li>
 * 		<li>popups/[mobile|tablet|desktop|watch|androidwear]/[pop-up name].sm</li>
 * 		<li>userwidgets/[component name]/userwidgetmodel.sm</li>
 * </ul>
 *
 * @param  {type} projectPath description
 * @param  {type} uiType      description
 * @param  {type} channel     description
 * @param  {type} uiName      description
 * @param  {type} verbose     description
 * @return {type}             description
 */
function findViews(projectPath, uiType, channel, uiName, verbose) {

	if(verbose)
	console.log("uiType: %s\nchannel: %s\nuiName: %s".debug, uiType, channel, uiName);

	if(projectPath.substr(-1) === '/'){
		projectPath = projectPath.slice(0, -1);
	}
	if(uiName && uiName.substr(-3) !== '.sm'){
		//uiName += '.sm';
	}

	var widgetPath = "^$";
	var uiNameOptions = searchAll(uiName) ? ".*" : uiName;
	var channelOptions = searchAll(channel) ? "(" + globals.channels.join("|") + ")" : channel;
	var uiTypeOptions = searchAll(uiType) ? concatOptions(globals.uiSTypes) : uiType;

	if(searchAll(uiType)) {
		widgetPath = `^${projectPath}(` +
			`/${uiTypeOptions}/${channelOptions}/${uiNameOptions}` +
			"|" +
			`/userwidgets/${uiNameOptions}/userwidgetmodel` +
			")\\.sm$";
	}
	else if(uiType === "userwidgets"){
		widgetPath = `^${projectPath}/userwidgets/${uiNameOptions}/userwidgetmodel\\.sm$`
	}
	//Search forms, popups and templates only.
	else{
		widgetPath = `^${projectPath}/${uiTypeOptions}/${channelOptions}(/.*)*/${uiNameOptions}\\.sm$`;
	}

	if(verbose)
	console.log("Looking for:\n\t%s\n".debug, widgetPath);

	var widgetPathRegex = new RegExp(widgetPath);

	return Q.Promise(function(resolve, reject, notify) {
		try{
			find.dir(widgetPathRegex, projectPath, (dirPaths) => {
				//console.log("%o".debug, dirPaths);
				resolve(dirPaths.map(dirPath => {
					return parseViewPath(dirPath, projectPath);
				}));
			})
		}
		catch(e){
			reject(e);
		}
	});
}

function parseViewPath(viewPath, projectPath){
	var projectPathRegex = new RegExp("^" + projectPath + "/");
	var relPath = viewPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var uiType = pathParts[0];
	var lastDir = pathParts[pathParts.length - 1];

	var file, channel, uiName;
	if(uiType === "userwidgets" || lastDir === "userwidgetmodel.sm"){
		channel = "all";
		uiName = pathParts[pathParts.length - 2];
		//uiName will be name-spaced -e.g. com.acme.FooComponent
		//file = uiName.substring(uiName.lastIndexOf(".")+1) + ".json";
		file = "userwidgetmodel.json"
	}
	else{
		channel = pathParts[1];
		uiName = lastDir.replace(uiExtensionRegex, "");
		file = uiName + ".json";
	}

	return {
		file: file,
		uiName: uiName,
		uiType: uiType,
		channel: channel,
		absDir: viewPath,
		relPath: relPath += "/" + file,
		absPath: viewPath += "/" + file
	}
}

function parseWidgetPath(widgetPath, projectPath){
	var projectPathRegex = new RegExp("^" + projectPath + "/");
	var relPath = widgetPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var file = pathParts[pathParts.length - 1];
	var parent = pathParts[pathParts.length - 2];
	var gParent = pathParts[pathParts.length - 3];
	var uiType = pathParts[0];

	var channel, uiName;
	if(uiType === "userwidgets" || parent === "userwidgetmodel.sm"){
		channel = "all";
		uiName = gParent;
	}
	else{
		channel = pathParts[1];
		uiName = parent.replace(uiExtensionRegex, "");
	}

	return {
		file: file,
		uiName: uiName,
		uiType: uiType,
		channel: channel,
		relPath: relPath,
		absPath: widgetPath
	}
}

module.exports = {
	findWidgets: findWidgets,
	findViews: findViews,
	parseWidgetPath: parseWidgetPath
};
