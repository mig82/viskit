#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const ctrl = require("./controllers/find-orphan-widgets");
const theme = require("./config/theme.js");
const globals = require("./config/globals.js");

colors.setTheme(theme);

var viewTypeValues = globals.viewTypes.concat("all");
var channelValues = globals.channels.concat("all");

var viewTypeOptions = globals.viewTypes.join("|");
var channelOptions = globals.channels.join("|");

var viewTypesRegex = new RegExp(`^(${viewTypeOptions})$`);
var channelsRegex = new RegExp(`^(${channelOptions})$`);

program
	.usage("[options] <project>")
	.option("-t, --view-type <type>",
		"The type of view for which you want to find the descendant widgets.",
		viewTypesRegex)
	.option("-c, --channel <channel>",
		"The channel or form factor for which you want the descendant widgets.",
		channelsRegex)
	.option("-n, --view-name <name>",
		"The name of the form, pop-up, segment template or component for which you want to find the descendant widgets.")
	.action(onAction);

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit find-descendants path/to/workspace/FooProject\n" +
		"\tviskit fd --view-type forms path/to/workspace/FooProject\n" +
		"\tviskit fd --channel mobile path/to/workspace/FooProject\n" +
		"\tviskit fd --view-name homeForm path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"The descendants of a view are all those widgets which are either direct children " +
		"of the view, or children of the view's children. Meaning they're part of the " +
		"tree of elements that make up the view.\n" +

		"This just a utility command. The functionality behind it is meant to be used\n" +
		"by other commands, but I've also exposed it here for testing and fun.\n\n" +

		"The available values for the " + "view-type".emphasis + " option are " +
		viewTypeOptions.emphasis + "," + "where " +
		"userwidgets".emphasis + "\nrefers to reusable components.\n\n" +

		"The available values for the " + "channel".emphasis + " option are " +
		channelOptions.emphasis + "," + "where " +
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

function onAction(project, options){

	if(options.viewType && viewTypeValues.indexOf(options.viewType) < 0){
		console.log("\nInvalid value for option " + "--view-type".emphasis +
			". Use one of " + viewTypeOptions.emphasis + " or don't use this option.\n"
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

	ctrl.findWidgets(project, options.viewType, options.channel, options.viewName, process.env.verbose)
	.then(widgets => {

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
		widgets.forEach(widget => {
			if(process.env.verbose){
				console.log("%o".info, widget);
			}
			console.log("%s\t%s\t%s\t%s".info,
				widget.viewType,
				widget.channel?widget.channel:"n/a",
				widget.viewName,
				widget.file
			);
		});
	});
}

program.parse(process.argv);
