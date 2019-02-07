#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const findUnusedImages = require("../core/controllers/find-unused-images");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");
const capitalize = require("../common/string/capitalize");

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

	var images = await findUnusedImages(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		options.ignoreEmpty,
		process.env.verbose
	);

	forOwn(images, (images, classification) => {

		console.log(`${capitalize(classification)}:`.info);

		var color = theme.info;
		if(classification == "used"){
			color = theme.ok;
		}
		else if(classification == "missing"){
			color = theme.error;
		}
		else if(classification !== "all"){
			color = theme.warn
		}

		if(images && images.length > 0){
			images.forEach(image => {
				outputs.print(options.output, image, color);
			});
		}
		else{
			console.log("-".info);
		}
	});

	var countAll = images.all.length;
	var countUsed = images.used.length;
	var countUnused = images.unused.length;
	var countMissing = images.missing.length;
	var total = countUsed + countUnused - countMissing;

	var info = `All ${countAll} `;
	info += countAll === total?"=":"!" + "= " +
		`Total ${total} = ` +
		`Used ${countUsed} + Unused ${countUnused} - Missing ${countMissing}`;

	if(countAll === total){
		console.info("Summary: %s".info, info);
	}
	else {
		console.info("Summary: %s".warn, info);
	}
}

program.parse(process.argv);
