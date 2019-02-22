"use strict";

function getOriginalMajorMinorPatch(visPath, verbose){
	//Consider only major.minor.patch -e.g for 8.3.0.1 consider only 8.3.0
	const regex = /KonyVisualizerEnterprise((\d+\.){2}\d+).*/gi;
	let matches = regex.exec(visPath);
	return matches && matches.length > 1?matches[1]:null;
}


module.exports = getOriginalMajorMinorPatch;
