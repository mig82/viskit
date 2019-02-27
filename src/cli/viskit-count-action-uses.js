#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const findActionRefs = require("../core/controllers/find-action-refs");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);
const views = require("../core/config/views.js");
const channels = require("../core/config/channels.js");
const outputs = require("../reporters/console");
const validateOptions = require("./helpers/validate-options");

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
		"\tviskit count-action-uses path/to/workspace/FooProject\n" +
		"\tviskit csu path/to/workspace/FooProject --theme fooTheme\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"...\n" +
		"...\n\n" +

		"...\n" +
		"...\n\n" +

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

	var actionRefs = await findActionRefs(
		path.resolve(project),
		options.viewType,
		options.channel,
		options.viewName,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(actionRefs));
	}
	else{
		var unusedActionsCount = 0;
		var actionsCount = 0;
		console.log("Valid action references".info);
		forOwn(actionRefs.valid, (action, actionName) => {

			var color = "green";
			var useCount = action.refs.length;

			if(useCount === 0){
				color = "red"
				unusedActionsCount++;
			}

			actionsCount++;

			action.info = action.refs.length>0?`Used by: ${action.refs.join(", ")}`:"Not in use";
			//console.log("%s: %d"[color], actionName, useCount);
			outputs.print(options.output, action, color);
		});

		var usedActionsCount = actionsCount - unusedActionsCount;
		console.log("Total actions: %d\tUsed actions: %d\t\tUnused actions: %d".neutral,
			actionsCount,
			usedActionsCount,
			unusedActionsCount
		);

		var brokenRefsCount = 0;
		console.log("Broken action references".info);
		forOwn(actionRefs.broken, (references, actionId) => {
			brokenRefsCount += references.length;
			references.forEach(ref => {
				console.log("%s\t%s".warn, actionId, ref);
			});
		});
		console.log("Total broken action refs: %d".neutral, brokenRefsCount);
	}
}

program.parse(process.argv);
