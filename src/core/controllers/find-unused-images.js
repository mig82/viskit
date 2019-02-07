
const differenceWith = require('lodash.differencewith');
const {findAll, findUsed} = require("../helpers/finders/image-finder");
const Image = require("../models/image");

async function findUnusedImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){

	var allImages = await findAll(projectPath, channel, verbose);
	var usedImages = await findUsed(projectPath, viewType, channel, viewName, verbose);
	var unusedImages = differenceWith(allImages, usedImages, Image.matches);
	var missingImages = differenceWith(usedImages, allImages, Image.matches);

	/*var countAll = allImages.length;
	var countUsed = usedImages.length;
	var countUnused = unusedImages.length;
	var countMissing = missingImages.length;

	if(verbose){

		console.log("All count: %d".debug, countAll);
		allImages.forEach(image => {
			console.log("\t%s".debug, image.toTabbedString());
		});

		console.log("Used count: %d".debug, countUsed);
		usedImages.forEach(image => {
			console.log("\t%s".debug, image.toTabbedString());
		});

		console.log("Unused count: %d".debug, countUnused);
		unusedImages.forEach(image => {
			console.log("\t%s".debug, image.toTabbedString());
		});

		console.log("Missing count: %d".debug, countMissing);
		missingImages.forEach(image => {
			console.log("\t%s".debug, image.toTabbedString());
		});
	}*/

	return {
		all: allImages,
		used: usedImages,
		unused: unusedImages,
		missing: missingImages
	};
}

module.exports = findUnusedImages;
