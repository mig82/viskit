#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const findWidgets = require("./controllers/find-widgets");
const theme = require("./config/theme.js");
colors.setTheme(theme);
const views = require("./config/views.js");
const channels = require("./config/channels.js");
const outputs = require("./config/outputs.js");
const validateOptions = require("./validate-options");

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

		"This just a utility command. The functionality behind it is meant to be used\n" +
		"by other commands, but I've also exposed it here for testing and fun.\n\n" +

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

	var widgets = await findWidgets(project, options.viewType, options.channel, options.viewName, process.env.verbose)
	if(widgets.length === 0){
		//Add a flag to suppress this, in case the user wants to grep the output.
		console.log(
			colors.info("\nNo widgets found for options\n" +
				"\ttype: %s\n" +
				"\tchannel: %s\n" +
				"\tname: %s\n"
			),
			options.viewType?options.viewType:"all",
			options.channel?options.channel:"all",
			options.viewName?options.viewName:"all"
		);
	}
	widgets.forEach(widget => {outputs.print(options.output, widget)});
}

program.parse(process.argv);
