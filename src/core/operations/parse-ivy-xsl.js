"use strict";

const xsltProcessor = require('xslt-processor');
const fs = require('fs-extra');
const path = require('path');

async function parseIvyXsl(verbose){

	var toIvy;
	const pathToXslt = path.resolve(`${__dirname}/../../../resources/ivy/plugins-to-ivy.xsl`);

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


module.exports = parseIvyXsl;
