"use strict";

const fs = require('fs-extra');
const path = require('path');

const viskitDir = require('../config/config').viskitDir;
const composeIvySettingsFilePath = require("../helpers/compose-ivy-paths").composeIvySettingsFilePath;

async function addVisPathToIvyResolvers(visPath, projectPath, verbose){
	// 1. Read Ivy settings file
	var ivySettingsXml = await fs.readFile(path.resolve(`${__dirname}/../../../resources/ivy/ivysettings.xml`), "utf8");

	// 2. Replace $VIS_HOME with the visPath
	ivySettingsXml = ivySettingsXml.replace(/VIS_HOME/g, visPath);

	// 3. Write the file back.
	const ivyFileSettingsPath = composeIvySettingsFilePath(projectPath);
	await fs.writeFile(ivyFileSettingsPath, ivySettingsXml);
}

module.exports = addVisPathToIvyResolvers;
