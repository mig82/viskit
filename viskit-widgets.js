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
	.command('count [channel]')
	.description('Produce a count of widgets per form for a specific channel (mobile|tablet|web|wearables)')
	.action(channel => {
		console.log('Counting widgets for channel %s'.info, channel);
	});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

program.parse(process.argv);

//Count widgets per form.
//Count heavy widgets per form -e.g. segments, browsers, maps.
//Detect non-page-level heavy widgets.
