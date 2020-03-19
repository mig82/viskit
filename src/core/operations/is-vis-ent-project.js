"use strict";

const fs = require('fs-extra');
const colors = require('colors');
const path = require('path');

const getXpathStringValue = require("../helpers/get-xpath-string-value");

/**
 * isVisEnterpriseProject - Determines whether a given path points to the root of a
 * Visualizer project or not by looking at the
 * [Eclipse project description file]{@link http://help.eclipse.org/luna/index.jsp?topic=%2Forg.eclipse.platform.doc.isv%2Freference%2Fmisc%2Fproject_description_file.html}
 * in that location and checking that the <pre><code>nature</code></pre> element
 * reads <pre><code>com.pat.tool.keditor.nature.kprojectnature</code></pre>.
 *
 * @param  String projectPath  The absolute path to the Visualizer project's root directory.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return Boolean             Whether the path provided points to a Visualizer project or not.
 */

async function isVisEnterpriseProject(projectPath, verbose){

	if(verbose)console.log("Validating whether Vis Enterprise...".debug);
	var isProject = false;
	var propsPath = path.resolve(`${projectPath}/.project`);
	var pathExists = await fs.pathExists(propsPath);

	if(pathExists){
		if(verbose)console.log("File %s exists. Trying to load...".debug, propsPath);

		try{
			var projectXmlContent = await fs.readFile(propsPath, 'utf8');
			if(verbose)console.log(colors.debug(projectXmlContent));

			/* <?xml version="1.0" encoding="UTF-8"?>
			<projectDescription>
				<name>EuropeModelBank</name>
				<comment></comment>
				<projects></projects>
				<buildSpec></buildSpec>
				<natures>
					<nature>com.pat.tool.keditor.nature.kprojectnature</nature>
				</natures>
			</projectDescription> */

			var nature = getXpathStringValue(projectXmlContent, "//nature");
			if(verbose) console.log("Project nature: %s".debug, nature);
			isProject = nature === "com.pat.tool.keditor.nature.kprojectnature";
		}
		catch(e){
			if(verbose)console.error(e.message.debug);
		}
	}
	else{
		if(verbose)console.log("File %s does not exist.".debug, propsPath);
	}

	if(verbose)console.log("Done validating whether Vis Enterprise...".debug);
	return isProject;
}

module.exports = isVisEnterpriseProject;
