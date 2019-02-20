"use strict";

const { spawn } = require('child_process');
const path = require('path');
const Q = require('q');
Q.longStackSupport = true;

const {composeIvyFilePath, composeIvySettingsFilePath} = require("../helpers/compose-ivy-paths");

async function invokeIvy(visPath, projectPath, verbose){

	return Q.Promise(function(resolve, reject, notify) {

		const ivyFilePath = composeIvyFilePath(projectPath);
		const ivyFileSettingsPath = composeIvySettingsFilePath(projectPath);
		const dropinsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/dropins`);

		if(verbose)console.log("Placing plugins in %s".debug, dropinsDirPath);

		var ivyJarPath = path.resolve(`${__dirname}/../../../resources/ivy/ivy-2.4.0.jar`);
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

module.exports = invokeIvy;
