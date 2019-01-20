
const differenceWith = require('lodash.differencewith');
const findAll = require("../core/finders/image-finder").findAll;
const findUsed = require("../core/finders/image-finder").findUsed;
const Image = require("../models/image");

async function findUnusedImages(projectPath, viewType, channel, viewName, ignoreEmpty, verbose){

	var allImages = await findAll(projectPath, channel, verbose);
	var usedImages = await findUsed(projectPath, viewType, channel, viewName, ignoreEmpty, verbose);
	var unusedImages = differenceWith(allImages, usedImages, Image.matches);

	var countAll = allImages.length;
	var countUsed = usedImages.length;
	var countUnused = unusedImages.length;

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
	}

	var total = countUsed + countUnused;
	if(countAll === total){
		console.log("Images in project %d == Total %d = Used %d + Unused %d".green, countAll, total, countUsed, countUnused);
	}
	else{
		console.log("Images in project %d != Total %d = Used %d + Unused %d".warn, countAll, total, countUsed, countUnused);
	}

	return unusedImages;
}

module.exports = findUnusedImages;
