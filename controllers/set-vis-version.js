const fs = require('fs-extra');
const path = require('path');
const xsltProcessor = require('xslt-processor');
const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');
const Q = require('q');
Q.longStackSupport = true;
const download = require('../common/download');
const viskitDir = require('../config/config').viskitDir;
const ivyFileName = require('../config/config').ivyFileName;

async function readProjectPlugins(projectPath, verbose){

	var plugins;
	var pluginsXmlPath = `${projectPath}/konyplugins.xml`;
	var pluginsXmlExists = await fs.pathExists(pluginsXmlPath);

	if(pluginsXmlExists){
		try{
			var pluginsXml = await fs.readFile(pluginsXmlPath, 'utf8');

			//TODO: If Windows replace mac64 with win64, if Nix, then do the opposite.
			//isWindows()?replace("win64", "mac64"):replace("mac64", "win64")

			plugins = xsltProcessor.xmlParse(pluginsXml);
			if(verbose)console.debug("%s:\n%s\n".debug, pluginsXmlPath, pluginsXml);
		}
		catch(e){
			console.error("Unable to read %s\n%o".error, pluginsXmlPath, e);
		}
	}
	else{
		console.info("File not found at %s".warn, pluginsXmlPath);
	}
	return plugins
}

async function readIvyTransformation(verbose){

	var toIvy;
	const pathToXslt = "./ivy/plugins-to-ivy.xsl";

	try{
		const toIvyXml = await fs.readFile(pathToXslt, 'utf8');
		if(verbose)console.log("xslt:\n%s".debug, toIvyXml);
		toIvy = xsltProcessor.xmlParse(toIvyXml);
	}
	catch{
		console.info("Cannot read %s".warn, pathToXslt);
	}
	return toIvy;
}

function composeIvyFilePath(projectPath){
	return path.resolve(`${projectPath}/${viskitDir}/${ivyFileName}`);
}

async function createIvyFile(projectPath, plugins, toIvy, verbose){

	const ivyFilePath = composeIvyFilePath(projectPath);

	try{

		const ivyXml = xsltProcessor.xsltProcess(plugins, toIvy);
		if(verbose)console.log("Ivy file %s:\n%s\n".debug, ivyFileName, ivyXml);

		await fs.writeFile(ivyFilePath, ivyXml, 'utf8');
		if(verbose)console.log("Created %s\n".debug, ivyFilePath);
	}
	catch(e){
		console.error("Cannot create %s".error, ivyFilePath);
	}
}

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

async function resolveVisPlugins(visPath, projectPath, verbose){

	return Q.Promise(function(resolve, reject, notify) {

		const ivyFilePath = composeIvyFilePath(projectPath);
		const dropinsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/dropins`);

		if(verbose)console.log("Placing plugins in %s".debug, dropinsDirPath);

		const child = spawn("java", [
			"-jar",
			"./ivy/ivy-2.4.0.jar",
			"-settings",
			"./ivy/ivysettings.xml",
			"-ivy",
			ivyFilePath,
			"-retrieve",
			`${dropinsDirPath}/[artifact]_[revision].[ext]`
		]);

		child.stdout.setEncoding('utf8');

		// use child.stdout.setEncoding('utf8'); if you want text chunks
		child.stdout.on('data', (chunk) => {
			process.stdout.write(chunk.info);
			notify(".");
		});

		// since these are streams, you can pipe them elsewhere
		//child.stderr.pipe(dest);

		child.on('close', (code) => {
			if(code == 0){
				resolve(code);
			}
			else{
				const errorMessage = `Java exited with code ${code}`;
				console.error(errorMessage.error);
				reject(new Error(errorMessage));
			}
		});
	});
}

async function getVisVersion(projectPath, verbose){
	//TODO: Parse konyplugins.xml for this value.
	return await "8.3.14";
}

async function downloadBuildTools(projectPath, visVersion, verbose){

	const toolName = `visualizer-ci-tool-${visVersion}`;
	const zipName = `${toolName}.zip`
	// At the time of writing this, this URL pattern works from Vis version 7.2.0 to 8.3.14 and higher.
	const url = `http://download.kony.com/visualizer_enterprise/citools/${visVersion}/${zipName}`;

	const destinationDir = `${projectPath}/${viskitDir}/${toolName}`;
	const destinationPath = `${destinationDir}/${zipName}`;

	try{
		const byteCount = await download(url, destinationDir, destinationPath);
		if(verbose)console.log("Downloaded CI tools: %d bytes to %s".info, byteCount, destinationPath);
		//TODO: Read file and return external dependencies.
	}
	catch(e){
		console.error("Error downloading CI Tools %s: %o".error, visVersion, e);
	}
}

async function setVisVersion(visPath, projectPath, verbose){

	var visVersions = [];
	if(verbose)console.debug("Attempting to set plugins at\n\t%s to match\n\t%s\n".debug, visPath, projectPath);

	const isVis = await isVisInstallation(visPath, verbose);
	if(isVis){

		// 1. Get Vis version according to the branding and keditor plugins.
		const visVersion = await getVisVersion(projectPath, verbose);

		// 2. Download dependencies for the given version to list them for the user.
		const dependencies = await downloadBuildTools(projectPath, visVersion, verbose);

		// 3. Back up plugins directory if not backed up already.

		// 4. Remove prior versions of the plugins to be downlowaded from plugins dir.

		// 5. Create ivy file.
		const plugins = await readProjectPlugins(projectPath, verbose);
		const toIvy = await readIvyTransformation(verbose);
		await createIvyFile(projectPath, plugins, toIvy, verbose);
		// 6. Remove dropins dir if it exists.
		// 7. Resolve dependencies into new dropins directory.

		const resolved = await resolveVisPlugins(visPath, projectPath, verbose);

	}

	return visVersions;
}

module.exports = setVisVersion;
