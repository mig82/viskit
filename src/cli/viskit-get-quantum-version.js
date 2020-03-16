#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const outputs = require("../reporters/console");
const getProjectVersion = require("../core/controllers/get-quantum-version");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);

colors.setTheme(theme);

program
	.usage("[options] <project>")
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit get-quantum-version path/to/workspace/FooProject\n" +
		"\tviskit gqv path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"This helps you determine which Vis Quantum version you would need in order to \n" +
		"open a project "+"without".emphasis+" upgrading it. This is specially relevant when\n" +
		"multiple developers must collaborate on a project.\n\n"
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

	if(options.output === "j"){
		console.log(JSON.stringify({
			version: projectVersion
		}));
	}
	else{
		console.info("Created: %s\nCurrent: %s".info, projectVersion.created, projectVersion.current);
	}
}

program.parse(process.argv);
