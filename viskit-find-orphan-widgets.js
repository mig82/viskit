#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const ctrl = require("./controllers/find-orphan-widgets");
const globals = require("./config/globals.js");
const theme = require("./config/theme.js");
colors.setTheme(theme);
var forOwn = require('lodash.forown');

var uiTypeValues = globals.uiTypes.concat("all");
var channelValues = globals.channels.concat("all");

var uiTypeOptions = globals.uiTypes.join("|");
var channelOptions = globals.channels.join("|");

var uiTypesRegex = new RegExp(`^(${uiTypeOptions})$`);
var channelsRegex = new RegExp(`^(${channelOptions})$`);

program
	.usage("[options] <project>")
	.option("-t, --ui-type <type>",
		"The type of UI for which you want the count.",
		uiTypesRegex)
	.option("-c, --channel <channel>",
		"The channel or form factory for which you want the count.",
		channelsRegex)
	.option("-n, --ui-name <name>",
		"The name of the form, pop-up, segment template or component for which you want the count.")
	.option('-a, --show-all', 'Show all, including widgets with a defined width and height')
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit find-orphan-widgets path/to/workspace/FooProject\n" +
		//"\tviskit faw -channel tablet --ignore-empty path/to/workspace/FooProject\n" +
		"\tviskit fow path/to/workspace/FooProject -t forms -c mobile --show-all\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"A widget is considered an " + "orphan".emphasis + " when despite it being \n" +
		"part of the project file structure, it is not in the corresponding form's \n" +
		"tree of descendants. Meaning it points to a parent container which doesn't \n" +
		"point back to it as a child.\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){
	var projectOrphans = await ctrl.findOrphanWidgets(
		project,
		options.uiType,
		options.channel,
		options.uiName,
		options.showAll,
		process.env.verbose
	);
	//console.log("Orphans: %o".info, projectOrphans);

	forOwn(projectOrphans, (viewOrphans, viewName) => {
		var orphanCount = viewOrphans.length;
		var message = "";
		if (orphanCount > 0){
			/*console.log("%s\tcount: %d\torphans: %s".error, viewName, orphanCount, viewOrphans.map(widget=>{
				return widget.file;
			}));*/
			//console.log("%s\tcount: %d\torphans:".error, viewName, orphanCount);
			viewOrphans.forEach(widget => {
				//console.log("\t%s".error, widget.file);
				console.log("\t%s".error, widget.relPath);
			});
		}
		else{
			if(options.verbose)
			console.log("%s\tcount: %d\torphans: ".info, viewName, orphanCount);
		}

	})
}

program.parse(process.argv);
