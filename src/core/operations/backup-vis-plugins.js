"use strict";

const fs = require('fs-extra');
const path = require('path');

const pluginsBackupDir = require('../config/config').pluginsBackupDir;

async function backupVisPlugins(visPath, verbose){
	const pluginsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/plugins`);
	const pluginsBackupDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/${pluginsBackupDir}`);
	var isBackedUp = await fs.pathExists(pluginsBackupDirPath);
	if(!isBackedUp){
		if(verbose)console.log("Backing up original installatioin plugins to %s".debug, pluginsBackupDirPath);
		try {
			await fs.copy(pluginsDirPath, pluginsBackupDirPath)
			console.log("The original installation plugins have been backed up at %s".info, pluginsBackupDirPath);
			isBackedUp = true;
		}
		catch (err) {
			console.error(err);
		}
	}
	else{
		console.log("The original installation plugins are already backed up at %s".info, pluginsBackupDirPath);
	}
	return isBackedUp;
}


module.exports = backupVisPlugins;
