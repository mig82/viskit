#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const findImages = require("../core/controllers/find-images");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");
const snakeCaseToTitle = require("../common/string/snake-case-to-title");

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
		"\tviskit find-images path/to/workspace/FooProject\n" +
		//"\tviskit faw -channel tablet --ignore-empty path/to/workspace/FooProject\n" +
		"\tviskit fi path/to/workspace/FooProject -t forms -c mobile\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"An image is considered " + "unused".emphasis + " when despite it being part of the project file \n" +
		"structure, it is not used as the source, loading image or not found image by\n" +
		"any image widget, nor as the background to any container widgets.\n\n" +

		"An image is considered " + "missing".emphasis + " when despite it being referred to by a form,\n" +
		"widget, property or skin, it cannot be found in the project structure" +
		"\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	validateOptions(options);

	var images = await findImages(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		options.ignoreEmpty,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(images));
	}
	else{
		forOwn(images, (images, classification) => {

			console.log(`${snakeCaseToTitle(classification)}:`.info);

			var imageUses = [
				"splash_screen_references",
				"widget_image_references",
				"app_icon_references",
				"skin_background_references"
			];

			var color = theme.neutral;
			if(imageUses.indexOf(classification) >= 0){
				color = theme.ok;
			}
			else if(classification == "broken_references"){
				color = theme.error;
			}
			else if(classification !== "image_files"){
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

		var filesCount = images.image_files.length;
		//var countUsed = images.used.length;
		var splashScreenRefsCount = images.splash_screen_references.length;
		var widgetImageRefsCount = images.widget_image_references.length;
		var appIconRefsCount = images.app_icon_references.length;
		var skinImageRefsCount = images.skin_background_references.length;

		var unusedCount = images.unused_files.length;
		var brokenRefsCount = images.broken_references.length;
		//var total = countUsed + unusedCount - brokenRefsCount;
		var countUsed = splashScreenRefsCount + widgetImageRefsCount + appIconRefsCount + skinImageRefsCount;
		var total = countUsed + unusedCount - brokenRefsCount;

		var summary1 = `Files ${filesCount} `;
		summary1 += filesCount === total?"= ":"!" + "= ";
		summary1 += `Total ${total} = `;
		summary1 += `Used ${countUsed} + `;
		summary1 += `Unused ${unusedCount} - Missing ${brokenRefsCount}`;

		var summary2 = `Files ${filesCount} `;
		summary2 += filesCount === total?"= ":"!" + "= ";
		summary2 += `Total ${total} = `;
		summary2 += `Splash ${splashScreenRefsCount} + `;
		summary2 += `Widgets ${widgetImageRefsCount} + `;
		summary2 += `Icons ${appIconRefsCount} + `;
		summary2 += `Skins ${skinImageRefsCount} + `;
		summary2 += `Unused ${unusedCount} - Missing ${brokenRefsCount}`;

		if(filesCount === total){
			console.info("Summary: %s\nDetail:  %s".info, summary1, summary2);
		}
		else {
			console.info("Summary: %s\nDetail:  %s".warn, summary1, summary2);
		}
	}
}

program.parse(process.argv);
