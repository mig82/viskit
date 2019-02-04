#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const findUnusedImages = require("./controllers/find-unused-images");
const theme = require("./config/theme.js");
colors.setTheme(theme);
const views = require("./config/views.js");
const channels = require("./config/channels.js");
const outputs = require("./config/outputs.js");
const validateOptions = require("./validate-options");
const forOwn = require('lodash.forown');

program
	.usage("[options] <project>")
	.option(views.cmdTypeOption.flag, views.cmdTypeOption.desc, views.regex)
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option(views.cmdNameOption.flag, views.cmdNameOption.desc)
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit find-unused-images path/to/workspace/FooProject\n" +
		//"\tviskit faw -channel tablet --ignore-empty path/to/workspace/FooProject\n" +
		"\tviskit fui path/to/workspace/FooProject -t forms -c mobile --show-all\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"An image is considered " + "unused".emphasis + " when despite it being part of the project file \n" +
		"structure, it is not used as the source, loading image or not found image by\n" +
		"any image widget, nor as the background to any container widgets.\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var unusedImages = await findUnusedImages(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		options.ignoreEmpty,
		process.env.verbose
	);

	unusedImages.forEach(image => {
		outputs.print(options.output, image, image.color);
	});
	console.info("Count: %d".info, unusedImages.length);
}

program.parse(process.argv);
