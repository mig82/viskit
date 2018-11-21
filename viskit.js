#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

//To be exported so that the theme can be defined once.
const theme = {
	prompt: 'grey',
	debug: 'magenta',
	info: 'cyan',
	warn: 'yellow',
	error: 'red'
};
colors.setTheme(theme);

program
	.version('1.0.0')
	.option('-v, --verbose', 'output everything');

program
	.usage('[options] [command] [project]')
	//.option('-p, --project', 'Path to the Visualizer project')
	/*.command(
		'actions',
		'Audit and help with actions for a specific channel')
	.command(
		'fonts',
		'Audit and help with fonts for a specific channel')
	.command(
		'forms',
		'Audit and help with forms for a specific channel')
	.command(
		'i18ns',
		'Audit and help with i18n\'s')
	.command(
		'images',
		'Audit and help with images')
	.command(
		'skins',
		'Audit and help with skins for a specific theme')*/
	.command(
		'widgets',
		'Audit and help with widgets for a specific channel');

program.on('option:verbose', function () {
	process.env.VERBOSE = this.verbose;
});


if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

// error on unknown commands
/*program.on('command:*', function () {
	console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
	process.exit(1);
});*/

module.exports = {
	theme: theme
};

program.parse(process.argv);
