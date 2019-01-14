const fs = require('fs-extra');

const ivy = require('../common/ivy');
const vProjects = require('../common/vis-projects');
const bTools = require('../common/build-tools');
const viskitDir = require('../config/config').viskitDir;

async function isVisInstallation(visPath, verbose){
	const isVisPath = await fs.pathExists(visPath);
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

async function setVisVersion(visPath, projectPath, verbose){

	var visVersions = [];
	if(verbose)console.debug("Attempting to set plugins at\n\t%s to match\n\t%s\n".debug, visPath, projectPath);

	const isVis = await isVisInstallation(visPath, verbose);
	if(isVis){

		// 1. Get Vis version according to the branding and keditor plugins.
		const visVersion = await vProjects.getVersion(projectPath, verbose);

		// 2. Download dependencies for the given version to list them for the user.
		const buildToolPath = await bTools.downloadBuildTools(projectPath, visVersion, verbose);
		const extDepFilePath = await bTools.extractExternalDependencies(buildToolPath, projectPath, verbose);
		const extDependencies = await bTools.readExternalDependencies(extDepFilePath, verbose);

		// 3. Back up plugins directory if not backed up already.

		// 4. Remove prior versions of the plugins to be downlowaded from plugins dir.

		// 5. Create ivy file.
		const plugins = await vProjects.readPlugins(projectPath, verbose);
		const toIvy = await ivy.readIvyTransformation(verbose);
		await ivy.createIvyFile(projectPath, plugins, toIvy, verbose);
		// 6. Remove dropins dir if it exists.
		// 7. Resolve dependencies into new dropins directory.

		const resolved = await ivy.invokeIvy(visPath, projectPath, verbose);

	}

	return visVersions;
}

module.exports = setVisVersion;
