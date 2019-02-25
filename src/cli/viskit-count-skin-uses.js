#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const countSkinUses = require("../core/controllers/count-skin-uses");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

program
	.usage("[options] <project>")
	.option(views.cmdTypeOption.flag, views.cmdTypeOption.desc, views.regex)
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option(views.cmdNameOption.flag, views.cmdNameOption.desc)
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit count-skin-uses path/to/workspace/FooProject\n" +
		//"\tviskit faw -channel tablet --ignore-empty path/to/workspace/FooProject\n" +
		"\tviskit csu path/to/workspace/FooProject -t forms -c mobile\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		//TODO: Write text on why this counting skin uses is important.
		"...\n\n" +

		"..." +
		"\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var skins = await countSkinUses(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(skins));
	}
	else{
		forOwn(skins, (uses, skin) => {
			var color = "green";
			var useCount = uses.length;
			if(useCount === 0){
				color = "red"
			}
			if(useCount === 1){
				color = "yellow"
			}
			console.log("%s: %d"[color], skin, uses.length)
		});
	}
}

program.parse(process.argv);
