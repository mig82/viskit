//const find = require('find');
const fs = require('fs-extra');
//const colors = require('colors');
//const views = require("../config/views");
//const widgets = require("../config/widgets");
//const viewTypes = views.types;
//const containerTypes = widgets.containerTypes;
const differenceBy = require('lodash.differenceby');
const findWidgets = require("../common/finder").findWidgets;

function addUnique(array, element){
	if(element && array.indexOf(element) < 0) {
		array.push(element);
	}
}

async function findUsedImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){

	if(verbose)console.log("Finding unused images".debug);
	var metaWidgets = await findWidgets(projectPath, viewType, channel, viewName, verbose);
	var usedImages = [];

	for(const metaWidget of metaWidgets){
		var widget = await fs.readJson(metaWidget.absPath);
		if(widget.wType === "Image" || widget.name === "kony.ui.Image2"){
			addUnique(usedImages, widget["_src_"]);
			addUnique(usedImages, widget.imagewhenfailed);
			addUnique(usedImages, widget.imagewhiledownloading);
		}
	}
	return usedImages;
}

async function findSkinUsedImages(){
	/* TODO: Find images used as skin background images.
	* 
	* themes/defaultTheme/myBlackFlexSkin.json
	* 	"background_image": "option4.png",
	* 	"bg_type": "image",
	* 	"iphone": {
	* 		"background_image": "calbtn.png",
	* 		"bg_type": "image"
	* 	}
	*/
}

async function findImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){
	//TODO
}

async function findUnusedImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){

	var allImages = await findImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose);
	var usedImages = await findUsedImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose);
	var unusedImages = differenceBy(allImages, usedImages, image => {
		//return widget.absPath;
		return image.relPath.toLowerCase();
	});

	//return unusedImages;
	return usedImages;
}

module.exports = findUnusedImages;
