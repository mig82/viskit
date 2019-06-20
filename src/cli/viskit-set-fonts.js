#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const setFonts = require("../core/controllers/set-fonts");
const theme = require("../core/config/theme");
colors.setTheme(theme);
const views = require("../core/config/views");
const channels = require("../core/config/channels");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

program
	.usage("[options] <font> <project>")
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option("--theme <name>", "The name of the theme for which you wish to set the fonts")
	.option("--except <font1[,font2...]>", "A comma separated list of the fonts that should not be replaced")
	.option("-f, --force", "Whether to actually make the changes or not")
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit set-fonts OpenSans-Regular path/to/workspace/FooProject\n" +
		"\tviskit sf OpenSans-Regular path/to/workspace/FooProject --theme defaultTheme --except FontAwesome\n" +
		"\tviskit sf OpenSans-Regular path/to/workspace/FooProject --theme Millennials --except FontAwesome,VisualizerFontIcon\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"...\n" +
		"...\n\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(font, project, options){

	validateOptions(options);

	if(!options.force)console.log("This is a dry run. To actually make the changes use the --force option".warn);

	var results = await setFonts(
		font,
		path.resolve(project),
		options.channel,
		options.theme,
		options.except?options.except.split(","):[],
		options.force,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(results));
	}
	else{
		results.forEach(ref => {
			console.log(ref);
		});
	}
}

program.parse(process.argv);
