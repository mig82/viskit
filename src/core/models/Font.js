"use strict";

//Private non-static?
var projectPathRegex = undefined;
const hexToDecimal = require("../helpers/hex-to-decimal");


/**
 * Font - description
 *
 * @param  {String} name       description
 * @param  {String} color      The RGBA hexadecimal color code ff0000ff for 100% opaque red.
 * @param  {String} style      description
 * @param  {String} size       description
 * @param  {String} weight     description
 * @param  {String} format     description
 * @param  {String} channel    description
 * @param  {String} platform   description
 * @param  {String} widgetType description
 * @param  {String} relPath    The relative path to the skin JSON file with the reference to this font.
 * @param  {String} absPath    description
 * @return {Font}            description
 */
function Font(name, color, style, size, weight, format, channel, platform, widgetType, relPath, absPath){

	this.name = name;
	this.color = color?"#"+color.substring(0,6):undefined;

	var alpha = color?color.substring(6):undefined;
	if(alpha){
		var decAlpha = hexToDecimal(alpha);
		this.opacity = `α${Math.round(decAlpha*100/255)}%`;
	}

	this.style = style;
	this.size = size;
	this.weight = weight;

	this.format = format;
	this.channel = channel;
	this.platform = platform;
	this.widgetType = widgetType;
	this.relPath = relPath;
	this.absPath = absPath;

	//defaultTheme/tabPressedButtonSkin.json
	var relPathParts = relPath.split("/");
	this.theme = relPathParts[0];
	this.skin = relPathParts[1].split(".")[0];
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

	var platform, channel;
	// resources/VisualizerFontIcon.ttf
	if(pathParts.length === 2){
		channel = "common";
	}
	// resources/fonts/iPhone/Karbon-Regular.ttf
	else if(pathParts.length === 4){
		platform = pathParts[2];
		if(["Android", "iPhone", "SPA Android", "SPA Blackberry",
			"SPA iPhone", "SPA Windows", "WinPhone8"].indexOf(platform) >= 0){
			channel = "mobile";
		}
		else if(["Android Tablet", "iPad", "SPA Android Tablet",
			"SPA iPad", "SPA Windows Tablet", "Windows8"].indexOf(platform) >= 0){
			channel = "tablet";
		}
		else if("Android Wear OS" === platform){
			channel = "androidwear";
		}
		else if("Apple Watch OS" === platform){
			channel = "watch";
		}
		else if(["Desktop_web", "Kiosk"].indexOf(platform) >= 0){
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

	return new Font(
		name,
		null, //color,
		null, //style,
		null, //size,
		null, //weight,
		format,
		channel,
		platform,
		null,
		relPath,
		fontPath
	);
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

	//var s = `${this.channel}\t${this.file}`;
	//if(this.info) s+= `\t${this.info}`;
	var s = `${this.channel}\t${this.platform}\t${this.theme}\t${this.skin}\t${this.widgetType}`;
	s += `\t${this.name}\t${this.color}\t${this.opacity}\t${this.style}\t${this.size}\t${this.weight}`;
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
//Font.regex = /.*font_.*/i;
Font.colorRegex = /.*font_color.*/i;
Font.familyRegex = /.*font_name.*/i;
Font.styleRegex = /.*font_style.*/i;
Font.weightRegex = /.*font_weight.*/i;

module.exports = Font;
