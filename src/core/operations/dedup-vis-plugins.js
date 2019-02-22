"use strict";

const fs = require('fs-extra');
const path = require('path');
const findFile = require('find').file;
const Q = require('q');
Q.longStackSupport = true;

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
				if(verbose)console.log("\tCould NOT find %s at %s".debug, pluginId, pluginsDirPath);
				resolve(false);
			}
		});
	});
}

async function dedupVisPlugins(visPath, pluginIds, dryRun, verbose){

	const pluginsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/plugins`);
	if(verbose)console.log("Removing previously installed plugins from %s".debug, pluginsDirPath);

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

module.exports = dedupVisPlugins;
