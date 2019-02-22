"use strict";

const path = require('path');
const viskitDir = require('../config/config').viskitDir;
const ivyFileName = require('../config/config').ivyFileName;

function composeIvyFilePath(projectPath){
	return path.resolve(`${projectPath}/${viskitDir}/${ivyFileName}`);
}

function composeIvySettingsFilePath(projectPath){
	return path.resolve(`${projectPath}/${viskitDir}/ivysettings.xml`);
}

module.exports = {
	composeIvyFilePath: composeIvyFilePath,
	composeIvySettingsFilePath: composeIvySettingsFilePath
};
