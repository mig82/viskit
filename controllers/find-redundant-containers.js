
const find = require('find');
const fs = require('fs-extra');
const colors = require('colors');
const globals = require("../config/globals");

const uiTypes = globals.uiTypes;
const containerTypes = globals.containerTypes;

/**
* Find containers with one or no children objects.
*/
function findRedundants(projectPath, showAll, ignoreEmpty, verbose){

	if(projectPath.substr(-1) !== '/'){
		projectPath += '/';
	}
	console.log('Finding redundant containers for project %s'.info, projectPath);

	uiTypes.forEach(uiType => {
		//Search in path/to/project/forms, path/to/project/templates, etc.
		var uiTypePath = projectPath + uiType + "/";

		fs.pathExists(uiTypePath)
		.then(exists => {
			if(exists){

				var uiTypePathRegex = new RegExp("^" + uiTypePath);

				find.eachfile(/\.json$/, uiTypePath, (widgetPath) => {

					var widgetDisplayName = widgetPath.replace(uiTypePathRegex, '');

					fs.readJson(widgetPath)
					.then(widget => {
						if(containerTypes.indexOf(widget.name) >= 0){

							var childCount = widget.children.length;
							switch (childCount) {
								case 0:
									if(!ignoreEmpty)
									console.log("\t%s\t%s:\t%s:\t%d".red, widgetDisplayName, widget.wType, widget.id, childCount);
									break;
								case 1:
									console.log("\t%s\t%s:\t%s:\t%d".yellow, widgetDisplayName, widget.wType, widget.id, childCount);
									break;
								default:
									if(showAll)
									console.log("\t%s\t%s:\t%s:\t%d".green, widgetDisplayName, widget.wType, widget.id, childCount);
							}

						}
					})
					.catch(err => {
						console.error(err)
					})
				});
			}
			else{
				console.log("Path %s does NOT exist".warn, uiTypePath);
			}
		});
	});
}

module.exports = {
	findRedundants: findRedundants
};
