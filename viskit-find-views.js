#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const findViews = require("./controllers/find-views");
const theme = require("./config/theme.js");
const globals = require("./config/globals.js");

colors.setTheme(theme);

var uiTypeValues = globals.uiTypes.concat("all");
var channelValues = globals.channels.concat("all");

var uiTypeOptions = globals.uiTypes.join("|");
var channelOptions = globals.channels.join("|");

var uiTypesRegex = new RegExp(`^(${uiTypeOptions})$`);
var channelsRegex = new RegExp(`^(${channelOptions})$`);

program
	.usage("[options] <project>")
	.option("-t, --ui-type <type>",
		"The type of view you want to find.",
		uiTypesRegex)
	.option("-c, --channel <channel>",
		"The channel or form factor of the view you wish to find.",
		channelsRegex)
	.option("-n, --ui-name <name>",
		"The name of the form, pop-up, segment template or component you wish to find.")
	.action(onAction);

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit find-views path/to/workspace/FooProject\n" +
		"\tviskit fv --ui-type forms path/to/workspace/FooProject\n" +
		"\tviskit fv --channel mobile path/to/workspace/FooProject\n" +
		"\tviskit fv --ui-name homeForm path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"This just a utility command. The functionality behind it is meant to be used\n" +
		"by other commands, but I've also exposed it here for testing and fun.\n\n" +

		"The available values for the " + "ui-type".emphasis + " option are " +
		uiTypeOptions.emphasis + "," + "where " +
		"userwidgets".emphasis + "\nrefers to reusable components.\n\n" +

		"The available values for the " + "channel".emphasis + " option are " +
		channelOptions.emphasis + "," + "where " +
		"watch".emphasis + "\nrefers to Apple's iWatch.\n\n" +

		"For the " + "ui-name".emphasis + " option you can use one of these:\n" +
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

function onAction(project, options){

	if(options.uiType && uiTypeValues.indexOf(options.uiType) < 0){
		console.log("\nInvalid value for option " + "--ui-type".emphasis +
			". Use one of " + uiTypeOptions.emphasis + " or don't use this option.\n"
		);
		process.exit(1);
	}

	if(options.channel && channelValues.indexOf(options.channel) < 0){
		console.log(
			"\nInvalid value for option " + "--channel".emphasis +
			". Use one of " + channelOptions.emphasis + " or don't use this option.\n"
		);
		process.exit(1);
	}

	findViews(project, options.uiType, options.channel, options.uiName, process.env.verbose)
	.then(views => {

		if(views.length === 0){
			//Add a flag to suppress this, in case the user wants to grep the output.
			console.log(
				colors.info("\nNo views found for options\n" +
					"\ttype: %s\n" +
					"\tchannel: %s\n" +
					"\tname: %s\n"
				),
				options.uiType?options.uiType:"all",
				options.channel?options.channel:"all",
				options.uiName?options.uiName:"all"
			);
		}
		views.forEach(view => {
			if(process.env.verbose){
				console.log("%o".info, view);
			}
			console.log("%s\t%s\t%s\t%s".info,
				view.uiType,
				view.channel?view.channel:"n/a",
				view.uiName,
				view.file
			);
		});
	});
}

program.parse(process.argv);
