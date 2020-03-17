const findDupesI18ns = require("../operations/find-dupe-i18ns");

async function findDupes(projectPath, localeName, verbose){

	//TODO: Handle a comma separated list of locales.
	return await findDupesI18ns(projectPath, localeName, verbose)
}

module.exports = findDupes;
