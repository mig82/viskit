const groupBy = require('lodash.groupby');
const findSkins = require("../helpers/find-skins");

async function findAllSkins(projectPath, themeName, verbose){
	var skins = await findSkins(projectPath, themeName, verbose)
	return groupBy(skins, "theme");
}

async function countSkinUses(projectPath, themeName, verbose){
	//TODO: Return a count of how many times each skin is used.
}

module.exports = {
	findAllSkins
};
