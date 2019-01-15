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
	//If the StudioViz Core plugin is not listed, then search for the Kony Studio plugin.
	if(!versionPlugin) versionPlugin = findPluginBy(pluginsDoc, "plugin-id", "com.pat.tool.keditor");

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

module.exports = {
	//getVersion: getVersion,
	//readPlugins: readPlugins,
	parseProjectPlugins: parseProjectPlugins
};
