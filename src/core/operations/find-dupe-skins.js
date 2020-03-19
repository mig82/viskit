const path = require('path');
const fs = require('fs-extra')
const hash = require('object-hash');
//const forOwn = require('lodash.forown');
//const keys = require('lodash.keys');
const pickBy = require('lodash.pickby');
const findSkins = require("./find-skin-files");
const color = require('colors');

//TODO: All this logic should be in an operation. Not in the controller.
async function findDupes(skins, verbose){

	var exactCount = 0;
	var skinCount = skins.length;
	var uniqueSkinsCount = 0
	var maxDuplicates = 0
	var minDuplicates = 1

	var start = Date.now();

	dupes = {
		//md51: [{skin-1}, {}, ..., {}], //duplicates of skin-1
		//md52: [{skin-2}, {}, ..., {}], //duplicates of skin-2
		//...
		//md5N: [{skin-N}, {}, ..., {}] //duplicates of skin-N
	};

	//if(verbose)console.log("Skins found: %s".debug, JSON.stringify(skins));

	for (var skin of skins) {
		var json = await fs.readJson(skin.absPath);

		//Duplicates are those which are completely the same except for the kuid
		delete json.kuid

		/* TODO: Implement a mechanism to allow for a certain tolerance on certain properties
		 * —e.g. on font size, or very similar colors— to be able to find near duplicates */

		//Note: Vis already guarantees the JSON stays sorted. Otherwise we'd have to sort the keys and nested arrays.

		//Calculate the md5 for comparison.
		var md5 = hash(json, {
			algorithm: "md5"//,
			//excludeKeys: (key) => {return key === "kuid"}
		});
		//if(verbose)console.log(`\tSkin '%s':\t%s`.debug, skin.name, JSON.stringify(json));
		if(verbose)console.log(`Skin %s:\tMD5: %s`.debug, skin.name, md5);

		if(typeof dupes[md5] === "undefined"){
			dupes[md5] = [];
			uniqueSkinsCount++;
		}
		else{
			if(verbose)console.log(`\t%s is a duplicate of %s\n`.debug, skin.name, dupes[md5][0].name);
			exactCount++;
		}
		dupes[md5].push(skin)
	}

	//Keep only the skins with duplicates.
	dupes = pickBy(dupes, (skins) => {

		//Abuse pickBy to get the max and min number of duplicates as a side effect.
		maxDuplicates = Math.max(maxDuplicates, skins.length-1);
		minDuplicates = Math.min(minDuplicates, skins.length-1);

		return skins.length > 1;
	});

	var elapsed = Date.now() - start;
	var stats = {
		"Skins scanned": skinCount,
		"Unique skins": uniqueSkinsCount,
		"Dupe skins": exactCount,
		"Dupe ratio": (exactCount/skinCount * 100).toFixed(2) + "%",
		"Max dupes": maxDuplicates,
		"Min dupes": minDuplicates,
		"Elapsed time": elapsed/1000 + "s"
	}
	return {dupes, stats};
}

async function findDupeSkins(projectPath, themeName, verbose){

	themeName = themeName || "defaultTheme";
	projectPath = path.resolve(projectPath);
	if(verbose)console.log(`Looking for dupes in theme '${themeName}' of project ${projectPath}`.debug)


	try{
		var skins = await findSkins(projectPath, themeName, verbose);
		return await findDupes(skins, verbose);
	}
	catch(e){
		console.error(`Theme ${themeName} does not exist, is corrupt or`.red +
		` this process does not have sufficient permissions to read it.\n${e.message}`.red);
	}
}

module.exports = findDupeSkins;
