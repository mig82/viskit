"use strict";

const fs = require('fs-extra');
const unzip = require('unzip');
const path = require('path');
const Q = require('q');
Q.longStackSupport = true;

const viskitDir = require('../config/config').viskitDir;
const visExtDepFileName = require('../config/config').visExtDepFileName;

function composeDependenciesFilePath(projectPath, visVersion){
	return path.resolve(`${projectPath}/${viskitDir}/${visExtDepFileName}`);
}

async function extractVisDependencies(buildToolPath, projectPath, verbose){

	const extDepFilePath = composeDependenciesFilePath(projectPath);
	if(verbose)console.log("Extracting external dependencies\n\tfrom %s\n\tto %s".debug, buildToolPath, extDepFilePath);

	return Q.Promise((resolve, reject, notify) => {

		fs.createReadStream(buildToolPath)
		.pipe(unzip.Parse())
		.on('entry', (entry) => {

			var fileName = entry.path;
			var type = entry.type; // 'Directory' or 'File'
			var size = entry.size;

			if (fileName === visExtDepFileName) {
				if(verbose)console.log("Found %s in build tools zip file".debug, visExtDepFileName);
				entry.pipe(fs.createWriteStream(extDepFilePath));
			} else {
				//if(verbose)console.log("Draining %s".debug, fileName);
				entry.autodrain();
			}
			notify(fileName);
		})
		.on('close', () => {
			if(verbose)console.log("Closing stream on %s".debug, buildToolPath);
			resolve(extDepFilePath);
		})
		.on('error', (error) => {
			console.error("Error reading contents of %s\n%o".error, buildToolPath, error);
			reject(error);
		});
	});
}

module.exports = extractVisDependencies;
