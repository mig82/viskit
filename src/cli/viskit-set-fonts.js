#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const setFonts = require("../core/controllers/set-fonts");
const theme = require("../core/config/theme");
colors.setTheme(theme);
const views = require("../core/config/views");
const channels = require("../core/config/channels");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

program
	.usage("[options] <font> <project>")
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option("--theme <name>", "The name of the theme for which you wish to set the fonts")
	.option("--except <font1[,font2...]>", "A comma separated list of the fonts that should not be replaced")
	.option("-f, --force", "Whether to actually make the changes or not")
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit set-fonts OpenSans-Regular path/to/workspace/FooProject\n" +
		"\tviskit sf OpenSans-Regular path/to/workspace/FooProject --theme Millennials --except FontAwesome\n" +
		"\tviskit sf OpenSans-Regular path/to/workspace/FooProject --channel mobile --except OpenSans-Bold,FontAwesome\n" +
		"\tviskit sf OpenSans-Regular path/to/workspace/FooProject -c desktop --except OpenSans-Bold,FontAwesome --force\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"Any given project will typically have its own style guide specifying every aspect of the\n" +
		"application's look & feel. The font family to be used is one of such aspects. However, it's\n" +
		"not uncommon for development teams working on large projects to miss a label here and a button\n" +
		"there which are not using the required font family.\n\n" +

		"This command allows you to do bulk updates of all the skins in your project to set them to the\n" +
		"desired font family. You should use it to set the default font for all your skins and use the \n" +
		"--except".emphasis + " option to avoid changing any icon fonts as well as fonts which you know are already\n" +
		"correct —e.g.: If you've already set some fonts to OpenSans-Bold and want all others set to\nOpenSans-Regular.\n\n" +

		"You should use it along with the " + "find-font-references".emphasis +" command to query what fonts you have,\n" +
		"make the necessary changes and then query the results.\n\n" +

		"Note".bold + " that by default the command runs in dry-run mode. Meaning it only tells you what it would do\n" +
		"but does not really do it unless you use the " + "--force".emphasis + " option.\n\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(font, project, options){

	validateOptions(options);

	if(!options.force)console.log("This is a dry run. To actually make the changes use the --force option".warn);

	var results = await setFonts(
		font,
		path.resolve(project),
		options.channel,
		options.theme,
		options.except?options.except.split(","):[],
		options.force,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(results));
	}
	else{
		results.forEach(ref => {
			console.log(ref.message[ref.color]);
		});
	}
}

program.parse(process.argv);
