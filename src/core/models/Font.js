"use strict";

//Private non-static?
var projectPathRegex = undefined;

function Font(name, format, channel, subChannel, widgetType, relPath, absPath){

	this.name = name;
	this.format = format;
	this.channel = channel;
	this.subChannel = subChannel;
	this.widgetType = widgetType;
	this.relPath = relPath;
	this.absPath = absPath;
}

Font.fromPath = (fontPath, projectPath) => {

	if(projectPath){
		Font.setProjectPath(projectPath);
	}
	else if(!projectPathRegex){
		throw new Error(
			"Cannot parse an font path without the project path. " +
			"Call Font.setProjectPath(projectPath) at least once."
		);
	}

	var relPath = fontPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	//console.log(pathParts);

	var subChannel, channel;
	// resources/VisualizerFontIcon.ttf
	if(pathParts.length === 2){
		channel = "common";
	}
	// resources/fonts/iPhone/Karbon-Regular.ttf
	else if(pathParts.length === 4){
		subChannel = pathParts[2];
		if(["Android", "iPhone", "SPA Android", "SPA Blackberry",
			"SPA iPhone", "SPA Windows", "WinPhone8"].indexOf(subChannel) >= 0){
			channel = "mobile";
		}
		else if(["Android Tablet", "iPad", "SPA Android Tablet",
			"SPA iPad", "SPA Windows Tablet", "Windows8"].indexOf(subChannel) >= 0){
			channel = "tablet";
		}
		else if("Android Wear OS" === subChannel){
			channel = "androidwear";
		}
		else if("Apple Watch OS" === subChannel){
			channel = "watch";
		}
		else if(["Desktop_web", "Kiosk"].indexOf(subChannel) >= 0){
			channel = "desktop";
		}
	}
	else{
		throw new Error("Don't know how to parse font path %s", relPath);
	}
	var file = pathParts[pathParts.length - 1];
	var fileParts = file.split(".");
	var name = fileParts[0];
	var format = fileParts[1];

	return new Font(name, format, channel, subChannel, null, relPath, fontPath);
}

Font.setProjectPath = function _setProjectPath(projectPath, force){

	if(!projectPath || projectPath.trim() === ""){
		throw new Error("Cannot set project path to null nor blank.");
	}

	if(!projectPathRegex || force){
		if(process.env.verbose){
			console.warn("Setting project path to %s. Do NOT do this more than once.".warn, projectPath);
		}
		if(projectPath instanceof RegExp){
			projectPathRegex = projectPath;
		}
		else if(typeof projectPath === "string"){
			projectPathRegex = new RegExp("^" + projectPath + "/");
		}
		else{
			throw new Error("Cannot set project path a " + typeof projectPath);
		}
	}
	else{
		if(process.env.verbose)console.log("Project path is already set.".debug);
	}
}

Font.getProjectPath = function _getProjectPath(){
	return projectPathRegex;
}
Font.resetProjectPath = function _resetProjectPath(){
	projectPathRegex = null;
}

Font.prototype.toTabbedString = function _toTabbedString() {
	var s = `${this.channel}\t${this.file}`;
	if(this.info) s+= `\t${this.info}`;
	return s;
};

/**
 * equals - Determines whether to fonts are the same according to the path of
 * the JSON file which defines them, relative to the project root.
 *
 * @param  {type} font description
 * @return {type}       description
 */
Font.prototype.equals = function _equals(font){
	return font instanceof Font &&
		this.relPath === font.relPath;
}

Font.equals = function _equals(font1, font2){
	return font1 instanceof Font &&
		font1.equals(font2);
}

//Matches any property used for skins to refer to fonts -e.g.: foo/bar/font_name.
Font.regex = /.*font_.*/i;

module.exports = Font;
