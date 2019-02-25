"use strict";

const fs = require('fs-extra');

async function readVisDependencies(extDepFilePath, verbose){
	const contents = await fs.readJson(extDepFilePath);
	var dependencies = []
	if(contents && contents.visualizer && contents.visualizer.dependencies){
		dependencies = contents.visualizer.dependencies.map(dep => {
			return {
				name: dep.name,
				version: dep.version/*,
				description: dep.description*/
			};
		});
	}
	if(verbose)console.log("dependencies: %o".debug, dependencies);
	return dependencies;
}

module.exports = readVisDependencies;
