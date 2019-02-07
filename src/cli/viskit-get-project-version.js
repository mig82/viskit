#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const getProjectVersion = require("../core/controllers/get-project-version").getProjectVersion;
const theme = require("../core/config/theme.js");
colors.setTheme(theme);

colors.setTheme(theme);

program
	.usage("[options] <project>")
	.action(onAction);

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit get-project-version path/to/workspace/FooProject\n" +
		"\tviskit gpv path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"This helps you determine which Vis version you would need in order to \n" +
		"open a project "+"without".emphasis+" upgrading it. This is specially relevant when\n" +
		"multiple developers must collaborate on a project.\n\n" +

		"You can use this command to decide which Major.Minor to install and then \n" +
		"use the " + "set-vis-version".emphasis + " command to install the right patch and hotfix\n" +
		"versions on top of that -e.g. If the project is of version 8.2.6.2, then\n" +
		"download version 8.2 from the Kony Downloads site and use " + "set-vis-version".emphasis + "\n" +
		"to get the exact plugins to match 8.2." + "6.2".underline + ".\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	var projectVersion = await getProjectVersion(
		path.resolve(project),
		process.env.verbose
	);
	//widgets.forEach(widget => {outputs.print(options.output, widget)});
	console.info("%s".info, projectVersion);
}

program.parse(process.argv);
