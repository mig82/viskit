#!/usr/bin/env node

//TODO: Count heavy widgets per form -e.g. segments, browsers, maps.
//TODO: Detect non-page-level heavy widgets.
//TODO: Find deprecated widgets: com.kony.gen.viz.model.container.KVizHBox/KVizVBox

const program = require('commander');
const find = require('find');
const fs = require('fs-extra');
const colors = require('colors');
const theme = require('./viskit').theme;
colors.setTheme(theme);

const uiTypes = [
	'forms',
	'popups',
	'templates',
	'userwidgets'
];

const containerTypes = [
	"kony.ui.FlexContainer",
	"kony.ui.FlexScrollContainer"
];

program
	.command('count <project>')
	.description('Produce a count of widgets per form')
	.action(countProjectWidgets);
program
	.command('redundant <project>')
	.option('-a, --all', 'Show all, including containers with more than one child')
	.description('Find any containers with just one child')
	.action(findRedundantContainers);

/**
* Find containers with one or no children objects.
*/
function findRedundantContainers(project, command){

	if(project.substr(-1) !== '/'){
		project += '/';
	}
	console.log('Finding redundant widgets for project %s'.info, project);

	uiTypes.forEach(uiType => {
		//Search in path/to/project/forms, path/to/project/templates, etc.
		var uiTypePath = project + uiType + "/";

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
									console.log("\t%s\t%s:\t%s:\t%d".red, widgetDisplayName, widget.wType, widget.id, childCount);
									break;
								case 1:
									console.log("\t%s\t%s:\t%s:\t%d".yellow, widgetDisplayName, widget.wType, widget.id, childCount);
									break;
								default:
									if(command.all)
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

/**
* Count the widgets for each form according to the project structure.
*/
function countProjectWidgets(project){

	if(project.substr(-1) !== '/'){
		project += '/';
	}
	console.log('Counting widgets for project %s'.info, project);

	//Find any form, template or component UI -i.e. Any directory with the .sm extension.
	//If the project structure changes in the future the quick fix is to look in the entire project.
	//find.dir(/\.sm$/, project, exploreForms);

	uiTypes.forEach(uiType => {
		//Search in path/to/project/forms, path/to/project/templates, etc.
		var uiTypePath = project + uiType;

		fs.pathExists(uiTypePath)
		.then(exists => {
			if(exists){
				find.dir(/\.sm$/, uiTypePath, (forms) => {
					exploreForms(uiType, uiTypePath, forms);
				});
			}
			else{
				console.log("Path %s does NOT exist".warn, uiTypePath);
			}
		});
	});
}

function exploreForms(uiType, uiTypePath, forms){
	console.log('%s: %d'.info, uiType, forms.length);
	forms.forEach((formPath) => {
		countFormWidgets(uiTypePath, formPath);
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

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

program.parse(process.argv);
