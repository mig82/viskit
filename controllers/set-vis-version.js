const ivy = require('../helpers/ivy');
const vProjects = require('../helpers/projects');
const vis = require('../helpers/visualizer');
const bTools = require('../helpers/build-tools');
const viskitDir = require('../config/config').viskitDir;

async function setVisVersion(visPath, projectPath, dryRun, force, verbose){

	var versionInfo = {};
	if(verbose)console.debug("Attempting to set plugins at\n\t%s to match\n\t%s\n".debug, visPath, projectPath);

	const isVis = await vis.isInstallation(visPath, verbose);
	if(isVis){

		const projectPlugins = await vProjects.parseProjectPlugins(projectPath, verbose);

		// 1. Get Vis version according to the branding and keditor plugins.
		const visVersion = projectPlugins.projectVersion;

		// 1.1. Warn that the installed and requested versions are significantly different.
		var installedVersion = vis.getInstalledVersion(visPath, verbose);
		if(installedVersion !== visVersion && !force){
			throw new Error(
				`Installed version ${installedVersion} and ` +
				`project version ${visVersion} are significantly different.` +
				"\nUse --force option if you wish to proceed"
			);
		}

		// 2. Download dependencies for the given version to list them for the user.
		const buildToolPath = await bTools.downloadBuildTools(projectPath, visVersion, verbose);
		const extDepFilePath = await bTools.extractExternalDependencies(buildToolPath, projectPath, verbose);
		const extDependencies = await bTools.readExternalDependencies(extDepFilePath, verbose);

		// 3. Back up plugins directory if not backed up already.
		const pluginsAreBackedUp = await vis.backupPlugins(visPath, verbose);

		// 4. Remove prior versions of the plugins to be downlowaded from plugins dir.
		const dedupResults = await vis.dedupPlugins(visPath, projectPlugins.plugins, dryRun, verbose);

		// 5. Create ivy file.
		const pluginsDoc = projectPlugins.pluginsDoc;
		const toIvy = await ivy.readIvyTransformation(verbose);
		await ivy.createIvyFile(projectPath, pluginsDoc, toIvy, verbose);

		// 6. Remove dropins dir if it exists.
		await vis.removeDropinsDir(visPath, verbose);

		// 7. Add the Vis installation to the places for Ivy to lookup plugins.
		await ivy.addVisToIvy(visPath, projectPath, verbose);

		// 8. Resolve dependencies into new dropins directory.
		const resolved = await ivy.invokeIvy(visPath, projectPath, verbose);

		versionInfo.visVersion = visVersion;
		versionInfo.dependencies = extDependencies;
		//versionInfo.dedup = dedupResults;
		//versionInfo.resolved = resolved;
	}
	else{
		throw new Error(`This path is NOT a Vis installation: ${visPath}`);
	}

	return versionInfo;
}

module.exports = setVisVersion;
