"use strict";

const xsltProcessor = require("xslt-processor");
const fs = require("fs-extra");
const path = require("path");

const ivyFileName = require("../config/config").ivyFileName;
const composeIvyFilePath = require("../helpers/compose-ivy-paths").composeIvyFilePath;

async function createIvyFile(projectPath, plugins, toIvy, verbose){

	const ivyFilePath = composeIvyFilePath(projectPath);

	try{

		const ivyXml = xsltProcessor.xsltProcess(plugins, toIvy);
		if(verbose)console.log("Ivy file %s:\n%s\n".debug, ivyFileName, ivyXml);

		await fs.writeFile(ivyFilePath, ivyXml, "utf8");
		if(verbose)console.log("Created %s\n".debug, ivyFilePath);
	}
	catch(e){
		console.error("Cannot create %s".error, ivyFilePath);
	}
}

module.exports = createIvyFile;
