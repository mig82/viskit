#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');
colors.setTheme({
	prompt: 'grey',
	info: 'cyan',
	warn: 'yellow',
	error: 'red'
});

program
	.version('1.0.0', '-v, --version')
	.option('-n, --noisy', 'Output everything');

program
	.command(
		'widgets',
		'Audit and help with widgets for a specific channel');



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

program.parse(process.argv);
