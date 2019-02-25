#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const findWidgets = require("../core/controllers/find-widgets");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

colors.setTheme(theme);

program
	.usage("[options] <project>")
	.option(views.cmdTypeOption.flag, views.cmdTypeOption.desc, views.regex)
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option(views.cmdNameOption.flag, views.cmdNameOption.desc)
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit find-widgets path/to/workspace/FooProject\n" +
		"\tviskit fw --view-type forms path/to/workspace/FooProject\n" +
		"\tviskit fw --channel mobile path/to/workspace/FooProject\n" +
		"\tviskit fw --view-name homeForm path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"This mostly a utility command on top of which others are built. It's still useful\n" +
		"for resolving merge conflicts or if a project is broken by a reference to a widget\n" +
		"which can't be found, perhaps because it has been renamed by another developer.\n\n" +

		"The available values for the " + "view-type".emphasis + " option are " +
		views.options.emphasis + "," + "where " +
		"userwidgets".emphasis + "\nrefers to reusable components.\n\n" +

		"The available values for the " + "channel".emphasis + " option are " +
		channels.options.emphasis + "," + "where " +
		"watch".emphasis + "\nrefers to Apple's iWatch.\n\n" +

		"For the " + "view-name".emphasis + " option you can use one of these:\n" +
		" * The name of a form.\n" +
		" * The name of a pop-up.\n" +
		" * The name of a segment's header or row template.\n" +
		" * The name of a reusable component.\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var widgets = await findWidgets(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(widgets));
	}
	else{
		widgets.forEach(widget => {outputs.print(options.output, widget)});
		console.info("Count: %d".info, widgets.length);
	}
}

program.parse(process.argv);
