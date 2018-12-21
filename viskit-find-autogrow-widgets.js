#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const findAutogrowWidgets = require("./controllers/find-autogrow-widgets");
const theme = require("./config/theme.js");
colors.setTheme(theme);
const views = require("./config/views.js");
const channels = require("./config/channels.js");
const outputs = require("./config/outputs.js");
const validateOptions = require("./validate-options");

program
	.usage("[options] <project>")
	.option(views.cmdTypeOption.flag, views.cmdTypeOption.desc, views.regex)
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option(views.cmdNameOption.flag, views.cmdNameOption.desc)
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.option('-a, --show-all', 'Show all, including widgets with a defined width and height')
	.action(onAction);

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit find-autogrow-widgets path/to/workspace/FooProject\n" +
		//"\tviskit faw -channel tablet --ignore-empty path/to/workspace/FooProject\n" +
		"\tviskit faw --show-all path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"It's possible to create a widget without a defined " + "width".emphasis + ", by setting its " + "left".emphasis + " and\n" +
		"right".emphasis + " properties instead and letting it be as wide as it must to meet those.\n\n" +

		"It's also possible to create a widget without a defined " + "height".emphasis + ", by setting its " + "top".emphasis + " and\n" +
		"bottom".emphasis + " properties instead and letting it be as tall as it must to meet those.\n\n" +

		"It's also possible to set a widget's " + "width".emphasis + " or " + "height".emphasis + " to " + "preferred".emphasis + ", and let it be\n" +
		"as wide or tall as it must in order to accomodate its content.\n\n" +

		"Any of the scenarios above will cause additional overhead to calculate the resulting\n" +
		"" + "width".emphasis + " or " + "height".emphasis + " of the widget. Ergo it is better to define both the " + "width".emphasis + " and " + "height".emphasis + " whenever\n" +
		"possible. If a specific form is suffering from performance issues, this command will\n" +
		"give you a hint on whether too many widgets with undefined " + "width".emphasis + " or " + "height".emphasis + " may be\n" +
		"part of the problem.\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var widgets = await findAutogrowWidgets(
		project,
		options.viewType,
		options.channel,
		options.viewName,
		options.showAll,
		process.env.verbose
	);

	widgets.forEach(widget => {
		outputs.print(options.output, widget, widget.color);
	});
	console.info("Count: %d".info, widgets.length);
}

program.parse(process.argv);
