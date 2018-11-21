#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const ctrl = require("./controllers/find-redundant-containers");
const theme = require("./config/theme.js");
colors.setTheme(theme);

program
	.usage("[options] <project>")
	.option('-a, --show-all', 'Show all, including containers with more than one child')
	.option('-e, --ignore-empty', 'Ignore empty containers')
	.action(onAction);

/*program.on('option:verbose', function () {
	process.env.VERBOSE = this.verbose;
});
*/
program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit find-redundant-containers path/to/workspace/FooProject\n" +
		//"\tviskit frc --channel mobile --all path/to/workspace/FooProject\n" +
		"\tviskit frc --show-all path/to/workspace/FooProject\n" +
		"\tviskit frc --ignore-empty path/to/workspace/FooProject\n" +
		"\tviskit frc -ea path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"Container widgets are usually necessary when positioning two or more widgets\n" +
		"as a group.\n\n" +

		"However, container widgets with a single child are usually not necessary as the\n" +
		"child can be positioned on its own.\n\n" +

		"Empty containers may be accidental, although they're sometimes used as separators,\n" +
		"shadows or place-holders. Use " +
		"--ignore-empty".emphasis +
		" to ignore any empty containers.\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

function onAction(project, options){
	ctrl.findRedundants(project, options.showAll, options.ignoreEmpty, process.env.verbose);
}

program.parse(process.argv);
