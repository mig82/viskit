const fs = require('fs-extra');
const xsltProcessor = require('xslt-processor');

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

async function getVersion(projectPath, verbose){
	//TODO: Parse konyplugins.xml for this value.
	//return await "8.3.14";
	return await "7.2.0";
}

module.exports = {
	getVersion: getVersion,
	readPlugins: readPlugins
};
