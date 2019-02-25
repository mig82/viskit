#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const countWidgets = require("../core/controllers/count-widgets");
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
	.action(onAction);

program.on('option:verbose', function () {
	process.env.VERBOSE = this.verbose;
});

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit count-widgets path/to/workspace/FooProject\n" +
		"\tviskit cw path/to/workspace/FooProject\n"
		//"\tviskit cw --channel mobile path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"The fewer widgets a form has, the less memory it will consume and the better it\n" +
		"will perform.\n\n" +

		"Forms with large amounts of widgets may suffer from performance issues, but this\n" +
		"will also depend on how heavy those widgets are.\n\n" +

		"Forms with fewer heavy widgets may perform worse than forms with many light-weight\n" +
		"widgets. Still, if a form is suffering from performance issues, this count may\n" +
		"give you a clue on why.\n\n" +

		"If this count is way higher than what you can observe through Visualizer for any\n" +
		"given form, then it's possible that your form has orphan widgets. Consider running\n" +
		"the " + "find-orphans".emphasis + " command if you suspect this may be the case.\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var counts = await countWidgets(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(counts));
	}
	else{
		forOwn(counts, (typeViews, viewType) => {

			typeViews.forEach(view => {
				outputs.print(options.output, view, view.color);
			});
			console.info("Count of %s: %d".info, viewType, typeViews.length);
		});
	}
}

program.parse(process.argv);
