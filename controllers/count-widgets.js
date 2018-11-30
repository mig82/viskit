
const find = require('find');
const fs = require('fs-extra');
const colors = require('colors');
const globals = require("../config/globals");
const uiTypes = globals.uiTypes;

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
	uiTypes.forEach(uiType => {
		//Search in path/to/project/forms, path/to/project/templates, etc.
		var uiTypePath = projectPath + uiType;

		fs.pathExists(uiTypePath)
		.then(exists => {
			if(exists){
				find.dir(/\.sm$/, uiTypePath, (forms) => {
					console.log('%s: %d'.info, uiType, forms.length);
					forms.forEach((formPath) => {
						countFormWidgets(uiTypePath, formPath);
					});
				});
			}
			else{
				console.log("Path %s does NOT exist".warn, uiTypePath);
			}
		});
	});
}

function countFormWidgets(uiTypePath, formPath){

	//var formSplit = formPath.split('/');
	//var formDisplayName = formSplit[formSplit.length - 1];

	var uiTypePathRegex = new RegExp("^" + uiTypePath);
	var formDisplayName = formPath.replace(uiTypePathRegex, '');
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
