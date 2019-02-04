const fs = require('fs-extra');
const xmlParse = require('xslt-processor').xmlParse;
const xpath = require("./xpath");
const os = require('os');
const colors = require('colors');

/**
 * readPlugins - description
 *
 * @param  {type} projectPath description
 * @param  {type} verbose     description
 * @return XDocument             description
 */
async function readPlugins(projectPath, verbose){

	var plugins;
	var pluginsXmlPath = `${projectPath}/konyplugins.xml`;
	var pluginsXmlExists = await fs.pathExists(pluginsXmlPath);

	if(pluginsXmlExists){
		try{
			var pluginsXml = await fs.readFile(pluginsXmlPath, 'utf8');

			var platform = os.platform();
			if(verbose)console.debug("Platform: %s\n".debug, platform);

			//Windows -> win32
			if(platform === "win32" || platform === "win64"){
				pluginsXml = pluginsXml.replace(/mac64/g, "win64");
			}
			//Mac -> darwin
			else{
				pluginsXml = pluginsXml.replace(/win64/g, "mac64");
			}

			/*TODO: Figure out how to add or remove the
			 * Windows-only plugins depending on the host OS:
			 * 	"com.kony.windowsphone8"
			 * 	"com.kony.windows8"
			 * 	"com.kony.windows10"
			 * 	"com.kony.windows"*/

			plugins = xmlParse(pluginsXml);
			if(verbose)console.log("%s:\n%s\n".debug, pluginsXmlPath, pluginsXml);
		}
		catch(e){
			console.error("Unable to read %s\n%o".error, pluginsXmlPath, e);
			throw e;
		}
	}
	else{
		var message = `File not found at ${pluginsXmlPath}`;
		console.info(message.warn);
		throw new Error(message);
	}
	return plugins
}

/**
 * findPluginBy - description
 *
 * @param  {type} pluginsDoc description
 * @param  {type} name       description
 * @return XNode            description
 */
function findPluginBy(pluginsDoc, attribute, value){
	const plugins = pluginsDoc.getElementsByTagName("pluginInfo");
	var plugin;
	var matches = plugins.filter(p => {
		return p.getAttribute(attribute) === value;
	});
	if(matches && matches.length > 0){
		plugin = matches[0];
	}
	return plugin;
}

function readVersion(pluginsDoc, verbose){
	//Search for the Branding plugin.
	var versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.kony.ide.paas.branding");
	//If the Branding plugin is not listed, then search for the StudioViz Core plugin.
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.kony.studio.viz.core.win64");
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.kony.studio.viz.core.mac64");
	//If the StudioViz Core plugin is not listed, then search for the Kony Studio plugin -a.k.a. KEditor plugin.
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.pat.tool.keditor");
	//On 6.x versions of Vis the Kony Studio had a different package name. Recently migrated projects will still show it.
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.pat.tool.keditor.KEditorPlugin");

	var pluginName = versionPlugin.getAttribute("plugin-name");
	var pluginVersion = versionPlugin.getAttribute("version-no");

	var projectVersion = pluginVersion.match(/^(\d+\.\d+\.\d+)\..*$/)[1];
	if(verbose)console.log("Vis version according to plugin %s %s: %s".debug, pluginName, pluginVersion, projectVersion);

	return projectVersion;
}

function readPluginIds(pluginsDoc, verbose){
	return pluginsDoc.getElementsByTagName("pluginInfo").map((xNode) => {
		return xNode.getAttribute("plugin-id");
	})
}

async function parseProjectPlugins(projectPath, verbose){

	var pluginsDoc = await readPlugins(projectPath, verbose);
	var projectVersion = readVersion(pluginsDoc, verbose);
	var plugins = readPluginIds(pluginsDoc, verbose);

	return {
		projectVersion: projectVersion,
		pluginsDoc: pluginsDoc,
		plugins: plugins
	}
}

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
		if(verbose)console.log(colors.debug(projectXmlContent));

		var project = xmlParse(projectXmlContent);
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
	//getVersion: getVersion,
	//readPlugins: readPlugins,
	isVisProject: isVisProject,
	parseProjectPlugins: parseProjectPlugins
};
