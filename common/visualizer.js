const fs = require('fs-extra');
const path = require('path');

const pluginsBackupDir = require('../config/config').pluginsBackupDir;

async function isInstallation(visPath, verbose){
	const isVisPath = await fs.pathExists(path.resolve(visPath));
	if(!isVisPath){
		console.log("Could not find %s".error, visPath);
		return false;
	}

	const entPath = `${visPath}/Kony_Visualizer_Enterprise`;
	const isEntPath = await fs.pathExists(entPath);
	if(!isEntPath){
		console.log("Could not find %s".error, entPath);
		return false;
	}

	const entAppPath = `${entPath}/Kony Visualizer Enterprise.app`;
	const isEntAppPath = await fs.pathExists(entAppPath);
	if(!isEntAppPath){
		console.log("Could not find %s".error, entAppPath);
		return false;
	}
	if(verbose)console.debug("Found Vis installation at %s\n".debug, visPath);

	return true;
}

async function backupPlugins(visPath, verbose){
	const pluginsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/plugins`);
	const pluginsBackupDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/${pluginsBackupDir}`);
	var isBackedUp = await fs.pathExists(pluginsBackupDirPath);
	if(!isBackedUp){
		console.log("Backing up plugins to %s".debug, pluginsBackupDirPath);
		try {
			await fs.copy(pluginsDirPath, pluginsBackupDirPath)
			console.log("Plugins are backed up at %s".info, pluginsBackupDirPath);
			isBackedUp = true;
		}
		catch (err) {
			console.error(err);
		}
	}
	else{
		if(verbose)console.log("Plugins already backed up at %s".debug, pluginsBackupDirPath);
	}
	return isBackedUp;
}

module.exports = {
	isInstallation: isInstallation,
	backupPlugins: backupPlugins
}
