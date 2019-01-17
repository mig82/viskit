const { spawn } = require('child_process');
const xsltProcessor = require('xslt-processor');
const fs = require('fs-extra');
const path = require('path');
const Q = require('q');
Q.longStackSupport = true;

const viskitDir = require('../config/config').viskitDir;
const ivyFileName = require('../config/config').ivyFileName;

async function readIvyTransformation(verbose){

	var toIvy;
	const pathToXslt = path.resolve(`${__dirname}/../ivy/plugins-to-ivy.xsl`);

	try{
		const toIvyXml = await fs.readFile(pathToXslt, 'utf8');
		if(verbose)console.log("xslt:\n%s".debug, toIvyXml);
		toIvy = xsltProcessor.xmlParse(toIvyXml);
	}
	catch(e){
		console.info("Cannot read %s: %s".warn, pathToXslt, e.message);
	}
	return toIvy;
}

function composeIvyFilePath(projectPath){
	return path.resolve(`${projectPath}/${viskitDir}/${ivyFileName}`);
}

function composeIvySettingsFilePath(projectPath){
	return path.resolve(`${projectPath}/${viskitDir}/ivysettings.xml`);
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

async function addVisToIvy(visPath, projectPath, verbose){
	// 1. Read Ivy settings file
	var ivySettingsXml = await fs.readFile(path.resolve(`${__dirname}/../ivy/ivysettings.xml`), "utf8");

	// 2. Replace $VIS_HOME with the visPath
	ivySettingsXml = ivySettingsXml.replace(/VIS_HOME/g, visPath);

	// 3. Write the file back.
	const ivyFileSettingsPath = composeIvySettingsFilePath(projectPath);
	await fs.writeFile(ivyFileSettingsPath, ivySettingsXml);
}

async function invokeIvy(visPath, projectPath, verbose){

	return Q.Promise(function(resolve, reject, notify) {

		const ivyFilePath = composeIvyFilePath(projectPath);
		const ivyFileSettingsPath = composeIvySettingsFilePath(projectPath);
		const dropinsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/dropins`);

		if(verbose)console.log("Placing plugins in %s".debug, dropinsDirPath);

		var ivyJarPath = path.resolve(`${__dirname}/../ivy/ivy-2.4.0.jar`);
		var options = [
			"-jar",
			ivyJarPath,
			"-settings",
			ivyFileSettingsPath,
			"-ivy",
			ivyFilePath,
			"-retrieve",
			`${dropinsDirPath}/[artifact]_[revision].[ext]`
		];

		//This would be waaaaaay too verbose.
		//if(verbose)options.push("-verbose");

		if(verbose)console.log("Invoking Ivy:\njava %s".debug, options.join(" "));

		const ivyProcess = spawn("java", options);

		ivyProcess.stdout.setEncoding('utf8');

		// use ivyProcess.stdout.setEncoding('utf8'); if you want text chunks
		ivyProcess.stdout.on('data', (chunk) => {
			process.stdout.write(chunk.info);
			notify(".");
		});

		// since these are streams, you can pipe them elsewhere
		//ivyProcess.stderr.pipe(dest);
		ivyProcess.on('error', (err) => {
			console.log("%o".error, err);
		});

		ivyProcess.on('close', (code) => {
			if(code == 0){
				console.log("New active plugins found at %s".info, dropinsDirPath);
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

module.exports = {
	readIvyTransformation: readIvyTransformation,
	createIvyFile: createIvyFile,
	invokeIvy: invokeIvy,
	addVisToIvy: addVisToIvy
};
