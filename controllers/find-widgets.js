const find = require('find');

const Q = require('q');
Q.longStackSupport = true;

const globals = require("../config/globals");

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
	var searchPath = projectPath;

	//templates/mobile/segments/segmentRowTemplate.sm
	//forms/tablet/cardsForm.sm
	//popups/desktop/PopupQuickMenu.sm: 13
	//userwidgets/dbx.Avatar/userwidgetmodel.sm

	var widgetPath = "^$";
	var uiNameOptions = searchAll(uiName) ? ".*" : uiName;
	var channelOptions = searchAll(channel) ? "(" + globals.channels.join("|") + ")" : channel;
	var uiTypeOptions = searchAll(uiType) ? concatOptions(globals.uiSTypes) : uiType;

	if(searchAll(uiType)) {
		widgetPath = "^(" +
			`${projectPath}/${uiTypeOptions}/${channelOptions}/${uiNameOptions}\\.sm/.*\\.json` +
			"|" +
			`${projectPath}/userwidgets/${uiNameOptions}/userwidgetmodel\\.sm/.*\\.json` +
			")$";
	}
	else if(uiType === "userwidgets"){
		widgetPath = `^${projectPath}/userwidgets/${uiNameOptions}/userwidgetmodel\\.sm/.*\\.json$`
	}
	//Search forms, popups and templates only.
	else{
		var wIndex = globals.uiTypes.indexOf("userwidgets");
		widgetPath = `^${projectPath}/${uiTypeOptions}/${channelOptions}/${uiNameOptions}\\.sm/.*\\.json$`;
	}

	if(verbose)
	console.log("Looking for:\n\t%s\n".debug, widgetPath);

	var widgetPathRegex = new RegExp(widgetPath);
	var projectPathRegex = new RegExp("^" + projectPath + "/");
	var uiExtensionRegex = new RegExp(".sm$");

	return Q.Promise(function(resolve, reject, notify) {
		try{
			find.file(widgetPathRegex, searchPath, (filePaths) => {
				//console.log("%o".debug, filePaths);
				resolve(filePaths.map(filePath => {
					return parseWidgetPath(filePath, projectPathRegex, uiExtensionRegex);
				}));
			})
		}
		catch(e){
			reject(e);
		}
	});
}

function parseWidgetPath(widgetPath, projectPathRegex, uiExtensionRegex){

	var relPath = widgetPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var file = pathParts[pathParts.length - 1];
	var parent = pathParts[pathParts.length - 2];
	var gParent = pathParts[pathParts.length - 3];
	var uiType = pathParts[0];

	var channel, uiName;

	if(pathParts[1] === "userwidgets" || parent === "userwidgetmodel.sm"){
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
	findWidgets: findWidgets
};
