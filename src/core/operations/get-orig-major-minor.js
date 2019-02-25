"use strict";

function getOriginalMajorMinor(visPath, verbose){
	//Consider only major.minor -e.g for 8.3.0.1 consider only 8.3
	const regex = /KonyVisualizerEnterprise(\d+\.\d+).*/gi;
	let matches = regex.exec(visPath);
	return matches && matches.length > 1?matches[1]:null;
}


module.exports = getOriginalMajorMinor;
