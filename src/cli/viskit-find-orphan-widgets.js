#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const findOrphans = require("../core/controllers/find-orphan-widgets");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");
const forOwn = require('lodash.forown');

program
	.usage("[options] <project>")
	.option(views.cmdTypeOption.flag, views.cmdTypeOption.desc, views.regex)
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option(views.cmdNameOption.flag, views.cmdNameOption.desc)
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
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

	validateOptions(options);

	var orphans = await findOrphans(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		options.showAll,
		process.env.verbose
	);
	//console.log("Orphans: %o".info, orphans);

	if(options.output === "j"){
		console.log(JSON.stringify(orphans));
	}
	else{
		var viewsWithOrphansCount = 0;
		forOwn(orphans, (viewOrphans, viewName) => {
			viewsWithOrphansCount++;
			var orphanCount = viewOrphans.length;
			var message = "";
			viewOrphans.forEach(widget => {outputs.print(options.output, widget, "error")});
			console.info("Count for %s: %d".info, viewName, orphanCount);
		})
		console.info("Count: %d".info, viewsWithOrphansCount);
	}
}

program.parse(process.argv);
