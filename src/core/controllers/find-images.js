
const differenceWith = require('lodash.differencewith');

const findImageFiles = require("../operations/find-image-files");
const findSkinImages = require("../operations/find-skin-images");
const findWidgetImages = require("../operations/find-widget-images");
const findAppIconImages = require("../operations/find-app-icon-images");
const findSlashScreenImages = require("../operations/find-splash-screen-images");

const Image = require("../models/Image");

async function findUsed(projectPath, viewType, channel, viewName, verbose){
	var splashImages = await findSlashScreenImages(projectPath,/* channel,*/ verbose);
	var widgetImages = await findWidgetImages(projectPath, viewType, channel, viewName, verbose);
	var appIconsImages = await findAppIconImages(projectPath, channel, verbose);
	var skinImages = await findSkinImages(projectPath, null, verbose);
	var all = splashImages.concat(widgetImages).concat(appIconsImages).concat(skinImages);
	return all;
}

async function findImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){

	var imageFiles = await findImageFiles(projectPath, channel, verbose);
	var usedImages = await findUsed(projectPath, viewType, channel, viewName, verbose);
	var unusedImages = differenceWith(imageFiles, usedImages, Image.matches);
	var missingImages = differenceWith(usedImages, imageFiles, Image.matches);

	return {
		all: imageFiles,
		used: usedImages,
		unused: unusedImages,
		missing: missingImages
	};
}

module.exports = findImages;
