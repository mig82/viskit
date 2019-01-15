const ivy = require('../helpers/ivy');
const vProjects = require('../helpers/projects');
const vis = require('../helpers/visualizer');
const bTools = require('../helpers/build-tools');
const viskitDir = require('../config/config').viskitDir;

async function setVisVersion(visPath, projectPath, verbose){

	var visVersions = [];
	if(verbose)console.debug("Attempting to set plugins at\n\t%s to match\n\t%s\n".debug, visPath, projectPath);

	const isVis = await vis.isInstallation(visPath, verbose);
	if(isVis){

		const projectPlugins = await vProjects.parseProjectPlugins(projectPath, verbose);

		// 1. Get Vis version according to the branding and keditor plugins.
		const visVersion = projectPlugins.projectVersion;

		// 2. Download dependencies for the given version to list them for the user.
		const buildToolPath = await bTools.downloadBuildTools(projectPath, visVersion, verbose);
		const extDepFilePath = await bTools.extractExternalDependencies(buildToolPath, projectPath, verbose);
		const extDependencies = await bTools.readExternalDependencies(extDepFilePath, verbose);

		// 3. Back up plugins directory if not backed up already.
		const pluginsAreBackedUp = await vis.backupPlugins(visPath, verbose);

		// 4. Remove prior versions of the plugins to be downlowaded from plugins dir.

		// 5. Create ivy file.
		const pluginsDoc = projectPlugins.pluginsDoc;
		const toIvy = await ivy.readIvyTransformation(verbose);
		await ivy.createIvyFile(projectPath, pluginsDoc, toIvy, verbose);

		// 6. Remove dropins dir if it exists.
		// 7. Resolve dependencies into new dropins directory.

		const resolved = await ivy.invokeIvy(visPath, projectPath, verbose);

	}

	return visVersions;
}

module.exports = setVisVersion;
