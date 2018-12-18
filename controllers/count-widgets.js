
const find = require('find');
const fs = require('fs-extra');
const colors = require('colors');
const globals = require("../config/globals");
const viewTypes = globals.viewTypes;

/**
* Count the widgets for each form according to the project structure.
*/
function countWidgets(projectPath, channel, verbose){

	//TODO: Validate that the path exists and is a Vis project or else say so.
	if(projectPath.substr(-1) !== '/'){
		projectPath += '/';
	}
	console.log('Counting widgets for project %s'.info, projectPath);

	//Find any form, template or component UI -i.e. Any directory with the .sm extension.
	//If the project structure changes in the future the quick fix is to look in the entire project.
	//find.dir(/\.sm$/, project, exploreForms);

	//TODO: Implement the option to explore the specified channel.
	viewTypes.forEach(viewType => {
		//Search in path/to/project/forms, path/to/project/templates, etc.
		var viewTypePath = projectPath + viewType;

		fs.pathExists(viewTypePath)
		.then(exists => {
			if(exists){
				find.dir(/\.sm$/, viewTypePath, (forms) => {
					console.log('%s: %d'.info, viewType, forms.length);
					forms.forEach((formPath) => {
						countFormWidgets(viewTypePath, formPath);
					});
				});
			}
			else{
				console.log("Path %s does NOT exist".warn, viewTypePath);
			}
		});
	});
}

function countFormWidgets(viewTypePath, formPath){

	//var formSplit = formPath.split('/');
	//var formDisplayName = formSplit[formSplit.length - 1];

	var viewTypePathRegex = new RegExp("^" + viewTypePath);
	var formDisplayName = formPath.replace(viewTypePathRegex, '');
	//console.log('\t\t%s'.debug, formDisplayName);

	find.file(formPath, (widgets) => {
		var widgetCount = widgets.length;
		if(widgetCount <= 200){
			console.log('\t%s: %d'.green, formDisplayName, widgetCount);
		}
		else if(widgetCount > 400){
			console.log('\t%s: %d'.red, formDisplayName, widgetCount);
		}
		else{
			console.log('\t%s: %d'.yellow, formDisplayName, widgetCount);
		}
	})
}

module.exports = {
	countWidgets: countWidgets
};
