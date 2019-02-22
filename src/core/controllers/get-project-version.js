"use strict";

const colors = require("colors");
const fs = require("fs-extra");
const parseProjectPlugins = require("../operations/parse-project-plugins");
const readProjectPropertiesJson = require("../operations/read-project-properties-json");

/**
 * getProjectVersion - Determines the version of a project given path to its root
 * directory.
 *
 * @param  String projectPath  The absolute path to the Visualizer project's root directory.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return String             The version of the project.
 */

async function getProjectVersion(projectPath, verbose){

	try{
		if(verbose)console.log("Attempting to read project version from plugins file".debug);
		var pluginsInfo = await parseProjectPlugins(projectPath, verbose);
		return pluginsInfo.projectVersion;
	}
	catch(e){
		if(verbose)console.log("Attempting to read project version from properties file".debug);
		var properties = await readProjectPropertiesJson(projectPath, verbose);
		return properties.currentgaversion;
	}
}

module.exports = {
	getProjectVersion: getProjectVersion
	// Exporting an object instead of the fuction makes sure we have room in the
	// future for isFabricProject, isComponent, etc.
};
