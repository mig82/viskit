const fs = require('fs-extra');
const unzip = require('unzip');
const path = require('path');
const Q = require('q');
Q.longStackSupport = true;

const download = require('../common/download');
const viskitDir = require('../config/config').viskitDir;
const visExtDepFileName = require('../config/config').visExtDepFileName;

function composeDependenciesFilePath(projectPath, visVersion){
	return path.resolve(`${projectPath}/${viskitDir}/${visExtDepFileName}`);
}

async function downloadBuildTools(projectPath, visVersion, verbose){

	const toolName = `visualizer-ci-tool-${visVersion}`;
	const zipName = `${toolName}.zip`
	// At the time of writing this, this URL pattern works from Vis version 7.2.0 to 8.3.14 and higher.
	const url = `http://download.kony.com/visualizer_enterprise/citools/${visVersion}/${zipName}`;

	const destinationDir = `${projectPath}/${viskitDir}/${toolName}`;
	const destinationPath = `${destinationDir}/${zipName}`;

	//TODO: Download only if destinationPath doesn't already exist.
	try{
		const byteCount = await download(url, destinationDir, destinationPath);
		if(verbose)console.log("Downloaded CI tools: %d bytes to %s".debug, byteCount, destinationPath);
		return destinationPath;
	}
	catch(e){
		console.error("Error downloading CI Tools %s: %o".error, visVersion, e);
	}
}

async function extractExternalDependencies(buildToolPath, projectPath, verbose){

	const extDepFilePath = composeDependenciesFilePath(projectPath);
	if(verbose)console.log("Extracting external dependencies from %s to %s".debug, buildToolPath, extDepFilePath);

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

async function readExternalDependencies(extDepFilePath, verbose){
	const contents = await fs.readJson(extDepFilePath);
	var dependencies = []
	if(contents && contents.visualizer && contents.visualizer.dependencies){
		dependencies = contents.visualizer.dependencies.map(dep => {
			return {
				name: dep.name,
				version: dep.version/*,
				description: dep.description*/
			};
		});
	}
	if(verbose)console.log("dependencies: %o".debug, dependencies);
	return dependencies;
}

module.exports = {
	downloadBuildTools: downloadBuildTools,
	extractExternalDependencies: extractExternalDependencies,
	readExternalDependencies: readExternalDependencies
};
