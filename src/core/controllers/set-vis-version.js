"use strict";

const viskitDir = require("../config/config").viskitDir;

const parseIvyXsl = require("../operations/parse-ivy-xsl");
const createIvyFile = require("../operations/create-ivy-file");
const addVisPathToIvyResolvers = require("../operations/add-vis-path-to-ivy-resolvers");
const invokeIvy = require("../operations/invoke-ivy");

const parseProjectPlugins = require("../operations/parse-project-plugins");
const isVisInstallation = require("../operations/is-vis-installation");
const backupVisPlugins = require("../operations/backup-vis-plugins");
const removeDropinsDir = require("../operations/remove-dropins-dir");
const dedupVisPlugins = require("../operations/dedup-vis-plugins");

const downloadBuildTools = require("../operations/download-build-tools");
const extractVisDependencies = require("../operations/extract-vis-dependencies");
const readVisDependencies = require("../operations/read-vis-dependencies");

const getOriginalMajorMinor = require("../operations/get-orig-major-minor");
const getOriginalMajorMinorPath = require("../operations/get-orig-major-minor-patch");

function IncompatibleMajorMinorError(message) {
   this.message = message;
   this.name = "IncompatibleMajorMinorError";
}

async function setVisVersion(visPath, projectPath, dryRun, force, verbose){

	var versionInfo = {};
	if(verbose)console.debug("Attempting to set plugins at\n\t%s to match\n\t%s\n".debug, visPath, projectPath);

	const isVis = await isVisInstallation(visPath, verbose);
	if(isVis){

		const projectPlugins = await parseProjectPlugins(projectPath, verbose);

		// 1. Get Vis version according to the branding and keditor plugins.
		const visVersion = projectPlugins.projectVersion;

		// 1.1. Warn that the installed and requested versions are significantly different.
		const majorMinorRegex = /^(\d+\.\d+).*/gi;
		let matches = majorMinorRegex.exec(visVersion);
		const projMajorMinor = matches && matches.length > 1?matches[1]:null;

		var installedMajorMinor = getOriginalMajorMinor(visPath, verbose);
		if(installedMajorMinor !== projMajorMinor && !force){
			throw new IncompatibleMajorMinorError(
				`Installed version ${installedMajorMinor} and ` +
				`project version ${projMajorMinor} are different.`
			);
		}

		// 2. Download dependencies for the given version to list them for the user.
		const buildToolPath = await downloadBuildTools(projectPath, visVersion, verbose);
		const extDepFilePath = await extractVisDependencies(buildToolPath, projectPath, verbose);
		const extDependencies = await readVisDependencies(extDepFilePath, verbose);

		// 3. Back up plugins directory if not backed up already.
		const pluginsAreBackedUp = await backupVisPlugins(visPath, verbose);

		// 4. Remove prior versions of the plugins to be downlowaded from plugins dir.
		const dedupResults = await dedupVisPlugins(visPath, projectPlugins.plugins, dryRun, verbose);

		// 5. Create ivy file.
		const pluginsDoc = projectPlugins.pluginsDoc;
		const toIvy = await parseIvyXsl(verbose);
		await createIvyFile(projectPath, pluginsDoc, toIvy, verbose);

		// 6. Remove dropins dir if it exists.
		await removeDropinsDir(visPath, verbose);

		// 7. Add the Vis installation to the places for Ivy to lookup plugins.
		await addVisPathToIvyResolvers(visPath, projectPath, verbose);

		// 8. Resolve dependencies into new dropins directory.
		const resolved = await invokeIvy(visPath, projectPath, verbose);

		versionInfo.visVersion = visVersion;
		versionInfo.dependencies = extDependencies;
		//versionInfo.dedup = dedupResults;
		//versionInfo.resolved = resolved;

		// TODO: Update Kony_Visualizer_Enterprise/configuration/config.ini
		// osgi.splashPath=platform\:/base/plugins/com.kony.ide.paas.branding
	}
	else{
		throw new Error(`This path is NOT a Vis installation: ${visPath}`);
	}

	return versionInfo;
}

module.exports = setVisVersion;
