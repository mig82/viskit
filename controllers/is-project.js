const fs = require('fs-extra');
const xsltProcessor = require('xslt-processor');


/**
 * isVisProject - Determines whether a given path points to the root of a
 * Visualizer project or not by looking at the
 * [Eclipse project description file]{@link http://help.eclipse.org/luna/index.jsp?topic=%2Forg.eclipse.platform.doc.isv%2Freference%2Fmisc%2Fproject_description_file.html}
 * in that location and checking that the <pre><code>nature</code></pre> element
 * reads <pre><code>com.pat.tool.keditor.nature.kprojectnature</code></pre>.
 *
 * @param  String projectPath  The absolute path to the Visualizer project's root directory.
 * @param  Boolean verbose     Whether to print everything or not.
 * @return Boolean             Whether the path provided points to a Visualizer project or not.
 */

async function isVisProject(projectPath, verbose){

	var isProject = false;

	var pathExists = await fs.pathExists(projectPath);
	var projectFile = `${projectPath}/.project`;
	if(verbose)console.debug("Validating %s".debug, projectFile);

	try{
		var projectXmlContent = await fs.readFile(projectFile, 'utf8');
		if(verbose)console.debug(projectXmlContent);

		var project = xsltProcessor.xmlParse(projectXmlContent);
		/*
		<?xml version="1.0" encoding="UTF-8"?>
		<projectDescription>
			<name>EuropeModelBank</name>
			<comment></comment>
			<projects></projects>
			<buildSpec></buildSpec>
			<natures>
				<nature>com.pat.tool.keditor.nature.kprojectnature</nature>
			</natures>
		</projectDescription>
		*/
		var natures = project?project.getElementsByTagName("nature"):[];
		isProject = natures.length > 0 &&
			natures[0].firstChild &&
			natures[0].firstChild.nodeValue === "com.pat.tool.keditor.nature.kprojectnature";
	}
	catch(e){
		if(verbose)console.error(e.message);
	}
	return isProject;
}

module.exports = {
	isVisProject: isVisProject
	// Exporting an object instead of the fuction makes sure we have room in the
	// future for isFabricProject, isComponent, etc.
};
