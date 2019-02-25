"use strict";

const fs = require('fs-extra');
const path = require('path');

async function removeDropinsDir(visPath, verbose) {
	const dropinsDirPath = path.resolve(`${visPath}/Kony_Visualizer_Enterprise/dropins`);
  try {
		await fs.remove(dropinsDirPath);
		if(verbose)console.log("Deleted previously existing dropins directory at %s".debug, dropinsDirPath);
	}
	catch (err) {
		console.error("Could not delete dropins directory at %s", dropinsDirPath);
	}
}

module.exports = removeDropinsDir;
