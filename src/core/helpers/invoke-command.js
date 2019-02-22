"use strict";

const { spawn } = require("child_process");

const colors = require("colors");
const theme = require("../config/theme.js");
colors.setTheme(theme);

const Q = require("q");
Q.longStackSupport = true;

function invokeCommand(command, options, verbose){

	return Q.Promise(function(resolve, reject, notify) {

		var output = "";
		if(verbose)console.log("Invoking %s %s".debug, command, options?options.join(" "):"");

		const cmdProcess = spawn(command, options);

		cmdProcess.stdout.setEncoding("utf8");

		// use cmdProcess.stdout.setEncoding("utf8"); if you want text chunks
		cmdProcess.stdout.on("data", (chunk) => {
			//if(verbose) process.stdout.write(chunk.info);
			//output += chunk.info;
			notify(chunk.info);
		});

		// since these are streams, you can pipe them elsewhere
		//cmdProcess.stderr.pipe(dest);
		cmdProcess.on("error", (error) => {
			reject(error);
		});

		cmdProcess.on("close", (code) => {
			if(code == 0){
				/*resolve({
					code: code,
					output: output
				});*/
				resolve(code);
			}
			else{
				const errorMessage = `${command} exited with code ${code}`;
				//console.error(errorMessage.error);
				reject(new Error(errorMessage));
			}
		});
	});
}

module.exports = invokeCommand;
