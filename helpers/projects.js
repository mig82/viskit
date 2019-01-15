const fs = require('fs-extra');
const xsltProcessor = require('xslt-processor');


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

			//TODO: If Windows replace mac64 with win64, if Nix, then do the opposite.
			//isWindows()?replace("win64", "mac64"):replace("mac64", "win64")

			plugins = xsltProcessor.xmlParse(pluginsXml);
			if(verbose)console.debug("%s:\n%s\n".debug, pluginsXmlPath, pluginsXml);
		}
		catch(e){
			console.error("Unable to read %s\n%o".error, pluginsXmlPath, e);
		}
	}
	else{
		console.info("File not found at %s".warn, pluginsXmlPath);
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

function getProjectVersion(pluginsDoc, verbose){
	const versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.kony.ide.paas.branding");
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.kony.studio.viz.core.win64");
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.kony.studio.viz.core.mac64");
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.pat.tool.keditor");

	const pluginName = versionPlugin.getAttribute("plugin-name");
	const pluginVersion = versionPlugin.getAttribute("version-no");

	const projectVersion = pluginVersion.match(/^(\d+\.\d+\.\d+)\..*$/)[1];
	if(verbose)console.log("Vis version according to plugin %s %s: %s".debug, pluginName, pluginVersion, projectVersion);

	return projectVersion;
}

async function parseProjectPlugins(projectPath, verbose){

	const pluginsDoc = await readPlugins(projectPath, verbose);
	const projectVersion = getProjectVersion(pluginsDoc, verbose);

	return {
		projectVersion: projectVersion,
		pluginsDoc: pluginsDoc
	}
}

module.exports = {
	//getVersion: getVersion,
	//readPlugins: readPlugins
	parseProjectPlugins: parseProjectPlugins
};
