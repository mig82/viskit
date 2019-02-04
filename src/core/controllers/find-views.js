const finder = require("../helpers/finders/ui-finder.js");

/**
 * findViews - Finds all the directories representing forms, templates, popups
 * and reusable components matching a specific criteria.
 *
 * @param  {type} projectPath description
 * @param  {type} viewType    description
 * @param  {type} channel     description
 * @param  {type} viewName    description
 * @param  {type} verbose     description
 * @return {type}             description
 */
async function findViews(projectPath, viewType, channel, viewName, verbose) {
	if(verbose)console.log(
		"viewType: %s\nchannel: %s\nviewName: %s".debug,
		viewType,
		channel,
		viewName
	);
	return await finder.findViews(projectPath, viewType, channel, viewName, verbose);
}

module.exports = findViews;
