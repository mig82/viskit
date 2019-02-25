#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const findAllSkins = require("../core/controllers/find-skins").findAllSkins;
const configTheme = require("../core/config/theme.js");
colors.setTheme(configTheme);

const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");
const capitalize = require("../common/string/capitalize");

program
	.usage("[options] <project>")
	.option("-t, --theme <name>", "The name of the theme for which you wish to search for skins")
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit find-skins path/to/workspace/FooProject\n" +
		"\tviskit fs path/to/workspace/FooProject --theme fooTheme\n" +
		"\tviskit fs path/to/workspace/FooProject -t fooTheme\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"All themes in a Visualizer project must have the exact same set of skins.\n" +
		"A skin will typically have a different appearance from one theme to another,\n" +
		"but retain its name across themes. When a skin is created in one theme, an\n" +
		"equivalent of the same name is created in all themes defined in the project.\n" +
		"When a skin is deleted from one theme, its equivalents are deleted from all\n" +
		"themes in the project.\n\n" +

		"However, a common issue when using SCM with Visualizer projects is that conflict\n" +
		"resolutions may cause themes to have different sets of skins. When this occurs,\n" +
		"the project is left in an inconsistent state.\n\n" +

		"This command is useful to find the skins defined for each theme, and so to help\n" +
		"trouble-shoot such scenarios\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var allSkins = await findAllSkins(
		path.resolve(project),
		options.theme,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(allSkins));
	}
	else{
		var maxSkinCount = 0
		forOwn(allSkins, (themeSkins, theme) => {
			if(themeSkins.length > maxSkinCount) {
				maxSkinCount = themeSkins.length;
			}
		});

		forOwn(allSkins, (themeSkins, theme) => {
			if(themeSkins && themeSkins.length > 0){
				themeSkins.forEach(skin => {
					outputs.print(options.output, skin, "info");
				});
			}
			else{
				console.log("-".info);
			}

			var color = themeSkins.length < maxSkinCount?configTheme.error:configTheme.info;
			console.info("Count for %s: %d"[color], theme, themeSkins.length);
		});
	}
}

program.parse(process.argv);
