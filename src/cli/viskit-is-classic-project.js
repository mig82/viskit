#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const isVisEntProject = require("../core/controllers/is-classic-project");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);

colors.setTheme(theme);

program
	.usage("[options] <project>")
	.action(onAction);

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit is-vis-project path/to/workspace/FooProject\n" +
		"\tviskit ivp path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"This is mostly a utility command on top of which others are built. It simply determines\n" +
		"whether the given path points to the root directory of a Visualizer project or not.\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	var isProject = await isVisEntProject(
		path.resolve(project),
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify({
			isProject: isProject
		}));
	}
	else{
		console.info("%s".info, isProject);
	}
}

program.parse(process.argv);
