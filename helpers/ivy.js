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
	const pathToXslt = "./ivy/plugins-to-ivy.xsl";

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

async function invokeIvy(visPath, projectPath, verbose){

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

module.exports = {
	readIvyTransformation: readIvyTransformation,
	composeIvyFilePath: composeIvyFilePath,
	createIvyFile: createIvyFile,
	invokeIvy: invokeIvy
};
