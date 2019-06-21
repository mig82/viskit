#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const findFontRefs = require("../core/controllers/find-font-refs");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

program
	.usage("[options] <project>")
	.option("-u, --unused-only", "Only show fonts for which no reference has been found")
	.option(views.cmdTypeOption.flag, views.cmdTypeOption.desc, views.regex)
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option(views.cmdNameOption.flag, views.cmdNameOption.desc)
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit find-fonts path/to/workspace/FooProject\n" +
		"\tviskit fa path/to/workspace/FooProject --unused-only\n" +
		"\tviskit fa path/to/workspace/FooProject -u -o r"
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

async function onAction(project, options){

	validateOptions(options);

	var fontRefs = await findFontRefs(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		options.unusedOnly,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(fontRefs));
	}
	else{
		fontRefs.forEach(ref => {
			console.log(ref);
		});
	}
}

program.parse(process.argv);
