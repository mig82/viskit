const fs = require('fs-extra');
const xsltProcessor = require('xslt-processor');
const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');

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
	const pathToXslt = "./ant/plugins-to-ivy.xsl";

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

async function createIvyFile(projectPath, plugins, toIvy, verbose){

	const ivyFilePath = `${projectPath}/ivy.xml`;
	try{

		const ivyXml = xsltProcessor.xsltProcess(plugins, toIvy);
		if(verbose)console.log("ivy.xml:\n%s\n".debug, ivyXml);

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

async function invokeAnt(visPath, projectPath, verbose){

	const child = spawn("ant", [
		"-f",
		"./ant/viskit.xml",
		"setvisver",
		`-Dvis.home=${visPath}`,
		`-Dproject=${projectPath}`
	]);
	child.stdout.setEncoding('utf8');

	// use child.stdout.setEncoding('utf8'); if you want text chunks
	child.stdout.on('data', (chunk) => {
		process.stdout.write(chunk.info);
	});

	// since these are streams, you can pipe them elsewhere
	//child.stderr.pipe(dest);

	child.on('close', (code) => {
		if(code != 0)console.log(`Ant exited with code ${code}`);
	});
}

async function setVisVersion(visPath, projectPath, verbose){

	var visVersions = [];
	if(verbose)console.debug("Attempting to set plugins at\n\t%s to match\n\t%s\n".debug, visPath, projectPath);

	const isVis = await isVisInstallation(visPath, verbose);
	if(isVis){
		const plugins = await readProjectPlugins(projectPath, verbose);
		const toIvy = await readIvyTransformation(verbose);
		await createIvyFile(projectPath, plugins, toIvy, verbose);
		await invokeAnt(visPath, projectPath, verbose);

		// TODO: Determine what the version should be according to the branding and keditor plugins.
		// TODO: Delete the dropins directory.
		// TODO: Issue warnings on what the correct versions of Gradle, Java, etc are.
		//
	}

	return visVersions;
}

module.exports = setVisVersion;
