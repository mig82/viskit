const groupBy = require('lodash.groupby');
const findSkins = require("../operations/find-skins");

async function findAllSkins(projectPath, themeName, verbose){
	var skins = await findSkins(projectPath, themeName, verbose)
	return groupBy(skins, "theme");
}

module.exports = findAllSkins;
