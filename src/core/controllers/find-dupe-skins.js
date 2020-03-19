const findDupeSkins = require("../operations/find-dupe-skins");

async function findDupes(projectPath, themeName, verbose){

	return await findDupeSkins(projectPath, themeName, verbose)
}

module.exports = findDupes;
