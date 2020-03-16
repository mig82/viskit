"use strict";

const fs = require('fs-extra');
const colors = require('colors');
const path = require('path');

/**
 * getQuantumVersion - Returns the current Visualizer Quantum GA version of a project
 * according to the projectProperties.json file in its root folder.
 *
 * @param  String projectPath  The absolute path to the Visualizer project's root directory.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return Boolean             Whether the path provided points to a Visualizer project or not.
 */

async function getQuantumVersion(projectPath, verbose){

	if(verbose)console.log("Validating whether Vis Quantum...".debug);
	var isProject = false;
	var propsPath = path.resolve(`${projectPath}/projectProperties.json`);
	var pathExists = await fs.pathExists(propsPath);

	if(pathExists){
		if(verbose)console.log("File %s exists. Trying to load...".debug, propsPath);

		try{
			var projectProperties = await fs.readJson(propsPath);
			if(verbose)console.log("Loading file %s. Validating...".debug, propsPath);

			/*
			"createdVizVersion": "8.0.5",
			"createdgaversion": "8.0.5",
			"currentgaversion": "8.4.69",
			*/

			var created = projectProperties.createdVizVersion || projectProperties.createdgaversion;
			var current = projectProperties.currentgaversion
			if(verbose)console.log("Created GA version: %s.".debug, created);
			if(verbose)console.log("Current GA version: %s.".debug, current);

			//isProject = created && current;
			isProject = {created, current};
		}
		catch(e){
			console.error(e.message.debug);
		}
	}
	else{
		if(verbose)console.log("File %s does not exist.".debug, propsPath);
	}
	if(verbose)console.log("Done validating whether Vis Quantum...".debug);
	return isProject;
}

module.exports = getQuantumVersion;
