const finder = require("../rules/ui-finder.js");

/**
 * findWidgets - Finds all widget files contained in all the forms, templates, popups
 * and reusable components matching a specific criteria.
 *
 * @param  {type} projectPath description
 * @param  {type} viewType    description
 * @param  {type} channel     description
 * @param  {type} viewName    description
 * @param  {type} verbose     description
 * @return {type}             description
 */
async function findWidgets(projectPath, viewType, channel, viewName, verbose){
	if(verbose)console.debug(
		"projectPath: %s\nviewType: %s\nchannel: %s\nviewName: %s".debug,
		projectPath,
		viewType,
		channel,
		viewName
	);
	return await finder.findWidgets(projectPath, viewType, channel, viewName, verbose);
}

module.exports = findWidgets;
