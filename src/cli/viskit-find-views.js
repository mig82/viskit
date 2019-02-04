#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const findViews = require("../core/controllers/find-views");
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
		"\tviskit find-views path/to/workspace/FooProject\n" +
		"\tviskit fv --view-type forms path/to/workspace/FooProject\n" +
		"\tviskit fv --channel mobile path/to/workspace/FooProject\n" +
		"\tviskit fv --view-name homeForm path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"This useful to give you a rough idea of how big a project is in terms of the number\n" +
		"of views it has. It's also a great way to see how reusable your work is, by comparing\n" +
		"the count of forms and popups to the number of reusable components. Meaning if the\n" +
		"count of views and popups is too high compared to the count of reusable components, then\n" +
		"you could probably be doing a better job of harvesting reusable components from your app\n\n" +

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

	var views = await findViews(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		process.env.verbose
	);
	views.forEach(view => {outputs.print(options.output, view)});
	console.info("Count: %d".info, views.length);
}

program.parse(process.argv);
