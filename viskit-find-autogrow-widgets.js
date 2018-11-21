#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const ctrl = require("./controllers/find-autogrow-widgets");
const theme = require("./config/theme.js");
colors.setTheme(theme);

program
	.usage("[options] <project>")
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

function onAction(project, options){
	ctrl.findAutogrowWidgets(project, options.channel, options.showAll, process.env.verbose);
}

program.parse(process.argv);
