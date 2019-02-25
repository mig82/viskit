#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const findSkinRefs = require("../core/controllers/find-skin-refs");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

program
	.usage("[options] <project>")
	.option("--theme <name>", "The name of the theme for which you wish to search for skins")
	.option(views.cmdTypeOption.flag, views.cmdTypeOption.desc, views.regex)
	.option(channels.cmdOption.flag, channels.cmdOption.desc, channels.regex)
	.option(views.cmdNameOption.flag, views.cmdNameOption.desc)
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)

	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit count-skin-uses path/to/workspace/FooProject\n" +
		"\tviskit csu path/to/workspace/FooProject --theme fooTheme\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"When you modify the appearance to the widgets in your project, Vis \n" +
		"automatically creates new skins for you. If you then delete the widgets,\n" +
		"the skins stay behind.\n\n" +

		"Furthermore, if you do not give these new skins mnemonic names that you\n" +
		"can later recognise as you create them, over time you risk accumulating\n" +
		"a large amount of unrecognisable skins, making it very hard to know \n" +
		"which ones are actually in use and which ones are not.\n\n" +

		"The intent of this command is to count the number of times each skin is\n" +
		"referenced. If the count of references to a skin is 0, you'll know it\n" +
		"is safe to delete it. If the count is low -e.g.: 1 or 2, then perhaps\n" +
		"you can delete it and instead reuse another. It also points out if any\n" +
		"widgets are referencing missing skins." +
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

	var skinRefs = await findSkinRefs(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		options.theme,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(skinRefs));
	}
	else{
		var validRefsCount = 0;
		var skinsCount = 0;
		console.log("Valid skin references".info);
		forOwn(skinRefs.valid, (skin, skinName) => {

			var color = "green";
			var useCount = skin.refs.length;

			if(useCount === 0){
				color = "red"
			}
			if(useCount === 1){
				color = "yellow"
			}

			skinsCount++;
			validRefsCount += useCount;

			skin.info = `count: ${useCount}`;
			//console.log("%s: %d"[color], skinName, useCount);
			outputs.print(options.output, skin, color);
		});
		console.log("Total skins: %d\tTotal skin refs:%d\tSkin reuse index (higher is better):%d".neutral,
			skinsCount,
			validRefsCount,
			Math.round(validRefsCount / skinsCount * 1000) / 1000
		);

		var brokenRefsCount = 0;
		console.log("Broken skin references".info);
		forOwn(skinRefs.broken, (references, skinId) => {
			brokenRefsCount += references.length;
			references.forEach(ref => {
				console.log("%s\t%s".warn, skinId, ref);
			});
		});
		console.log("Total broken skin refs: %d".neutral, brokenRefsCount);
	}
}

program.parse(process.argv);
