const fs = require('fs-extra');
const path = require('path');
const findFile = require('find').file;
const Q = require('q');
Q.longStackSupport = true;

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

function findPlugin(pluginId, pluginsDirPath, verbose){

	var escapedDotId = pluginId.split(".").join("\\.");
	var searchPath = `${escapedDotId}_.+\\.jar`;
	if(verbose)console.log("\tSearching for %s".debug, searchPath);
	var pluginSearchRegex = new RegExp(searchPath);

	return Q.Promise(function(resolve, reject, notify) {

		findFile(pluginSearchRegex, pluginsDirPath, (pluginPaths) => {
			if(pluginPaths && pluginPaths.length > 0){
				if(verbose)console.log("\tFound %s".debug, pluginPaths[0]);
				resolve(pluginPaths[0])
			}
			else{
				console.log("\tCould NOT find %s at %s".warn, pluginId, pluginsDirPath);
				resolve(false);
			}
		});
	});
}

async function dedupPlugins(visPath, pluginIds, dryRun, verbose){

	const pluginsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/plugins`);
	if(verbose)console.log("Removing previously installed plugins from %s", pluginsDirPath);

	var removedCount = 0;
	for(const id of pluginIds){

		var pluginPath = await findPlugin(id, pluginsDirPath, verbose);
		if(pluginPath){
			if(verbose)console.log("\tDeleting %s".debug, pluginPath);
			try {
				if(!dryRun){
					await fs.remove(pluginPath);
				}
				removedCount++;
				if(verbose)console.log("\tDeleted %s".debug, pluginPath);
			}
			catch (err) {
				console.error("\tCould NOT delete %s".error, pluginPath);
			}
		}
	}

	return{
		removed: removedCount,
		searched: pluginIds.length
	}
}

async function removeDropinsDir(visPath, verbose) {
	const dropinsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/dropins`);
  try {
		await fs.remove(dropinsDirPath);
		if(verbose)console.log("Deleted previously existing dropins directory at %s".debug, dropinsDirPath);
	}
	catch (err) {
		console.error("Could not delete dropins directory at %s", dropinsDirPath);
	}
}

module.exports = {
	isInstallation: isInstallation,
	backupPlugins: backupPlugins,
	dedupPlugins: dedupPlugins,
	removeDropinsDir: removeDropinsDir
}
