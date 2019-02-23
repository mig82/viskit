
const differenceWith = require('lodash.differencewith');

const findImageFiles = require("../operations/find-image-files");
const findSkinImages = require("../operations/find-skin-images");
const findWidgetImages = require("../operations/find-widget-images");
const findAppIconImages = require("../operations/find-app-icon-images");
const findSlashScreenImages = require("../operations/find-splash-screen-images");

const Image = require("../models/Image");

async function findImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){

	var splashImageRefs = await findSlashScreenImages(projectPath,/* channel,*/ verbose);
	var widgetImageRefs = await findWidgetImages(projectPath, viewType, channel, viewName, verbose);
	var appIconsImageRefs = await findAppIconImages(projectPath, channel, verbose);
	var skinImageRefs = await findSkinImages(projectPath, null, verbose);
	var usedImageRefs = splashImageRefs.concat(widgetImageRefs).concat(appIconsImageRefs).concat(skinImageRefs);

	var imageFiles = await findImageFiles(projectPath, channel, verbose);
	//var unusedImages = differenceWith(imageFiles, usedImageRefs, Image.matches);
	var unusedImages = differenceWith(imageFiles, usedImageRefs, (imageFile, imageRef) => {
		return Image.referenceMatchesFile(imageRef, imageFile);
	});

	//var brokenReferences = differenceWith(usedImageRefs, imageFiles, Image.matches);
	var brokenReferences = differenceWith(usedImageRefs, imageFiles, (imageRef, imageFile) => {
		return Image.referenceMatchesFile(imageRef, imageFile);
	});

	return {
		image_files: imageFiles,
		splash_screen_references: splashImageRefs,
		widget_image_references: widgetImageRefs,
		app_icon_references: appIconsImageRefs,
		skin_background_references: skinImageRefs,
		//used: usedImageRefs,
		unused_files: unusedImages,
		broken_references: brokenReferences
	};
}

module.exports = findImages;
