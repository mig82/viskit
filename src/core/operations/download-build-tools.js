"use strict";

const fs = require('fs-extra');

const download = require('../helpers/download');
const viskitDir = require('../config/config').viskitDir;

async function downloadBuildTools(projectPath, visVersion, verbose){

	const toolName = `visualizer-ci-tool-${visVersion}`;
	const zipName = `${toolName}.zip`
	// At the time of writing this, this URL pattern works from Vis version 7.2.0 to 8.3.14 and higher.
	const url = `http://download.kony.com/visualizer_enterprise/citools/${visVersion}/${zipName}`;

	const destinationDir = `${projectPath}/${viskitDir}/${toolName}`;
	const destinationPath = `${destinationDir}/${zipName}`;

	const buildToolsExist = await fs.pathExists(destinationPath);
	if(!buildToolsExist){
		try{
			const byteCount = await download(url, destinationDir, destinationPath);
			if(verbose)console.log("Downloaded build tools: %d bytes to %s".debug, byteCount, destinationPath);
			return destinationPath;
		}
		catch(e){
			console.error("Error downloading build Tools %s: %s".error, visVersion, e.message);
			return null;
		}
	}
	else{
		if(verbose)console.log("Build tools already found at %s".info, destinationPath);
		return destinationPath;
	}
}

module.exports = downloadBuildTools;
