#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const findFontReferences = require("../core/controllers/find-font-refs");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

program
	.usage("[options] <project>")
	.option("--theme <name>", "The name of the theme for which you wish to search for font references")
	//TODO: Add an option to filter by widget type.
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option("--except <font1[,font2...]>", "A comma separated list of the fonts that should not be listed")
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit find-font-references path/to/workspace/FooProject\n" +
		"\tviskit ffr path/to/workspace/FooProject\n" +
		"\tviskit ffr path/to/workspace/FooProject --theme Millenials\n" +
		"\tviskit ffr path/to/workspace/FooProject --channel mobile\n" +
		"\tviskit ffr path/to/workspace/FooProject --theme Millenials -c tablet\n" +
		"\tviskit ffr path/to/workspace/FooProject -c desktop --except OpenSans-Regular,OpenSans-Bold,FontAwesome"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"Any given project will typically have its own style guide specifying every aspect of the\n" +
		"application's look & feel. The font family to be used is one of such aspects. However, it's\n" +
		"not uncommon for development teams working on large projects to miss a label here and a button\n" +
		"there which are not using the required font family.\n\n" +

		"This command will help you scan your project to find which fonts you are actually using and\n" +
		"where, so you'll be able to quickly identify if there are any widgets where you're using\n" +
		"the wrong typography.\n\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var fontRefs = await findFontReferences(
		path.resolve(project),
		options.channel,
		options.theme,
		options.except?options.except.split(","):[],
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(fontRefs));
	}
	else{
		fontRefs.forEach(ref => {
			//console.log(ref);
			outputs.print(options.output, ref, "info");
		});
	}
}

program.parse(process.argv);
