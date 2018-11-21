#!/usr/bin/env node

const program = require("commander");
const colors = require("colors");
const ctrl = require("./controllers/count-widgets");
const theme = require("./config/theme.js");
colors.setTheme(theme);

program
	.usage("[options] <project>")
	/*.option("-c, --channel <channel>",
		"The channel for which you want the count.",
		/^(mobile|tablet|desktop|watch|all)$/i, "all")*/
	.action(onAction);

program.on('option:verbose', function () {
	process.env.VERBOSE = this.verbose;
});

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit count-widgets path/to/workspace/FooProject\n" +
		"\tviskit cw path/to/workspace/FooProject\n"
		//"\tviskit cw --channel mobile path/to/workspace/FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"The fewer widgets a form has, the less memory it will consume and the better it\n" +
		"will perform.\n\n" +

		"Forms with large amounts of widgets may suffer from performance issues, but this\n" +
		"will also depend on how heavy those widgets are.\n\n" +

		"Forms with fewer heavy widgets may perform worse than forms with many light-weight\n" +
		"widgets. Still, if a form is suffering from performance issues, this count may\n" +
		"give you a clue on why.\n\n" +

		"If this count is way higher than what you can observe through Visualizer for any\n" +
		"given form, then it's possible that your form has orphan widgets. Consider running\n" +
		"the " + "find-orphans".emphasis + " command if you suspect this may be the case.\n\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

function onAction(project, options){
	ctrl.countWidgets(project, options.channel, process.env.verbose);
}

program.parse(process.argv);
