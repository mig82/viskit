#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const truncate = require('lodash.truncate');
const outputs = require("../reporters/console");
const findDupeSkins = require("../core/controllers/find-dupe-skins");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);

program
	.usage("[options] <project>")
	.option("--theme <theme>", "The name of the theme for which you wish to search for skin duplicates")
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit find-dupe-skins path/to/workspace/FooProject\n" +
		"\tviskit fds path/to/workspace/FooProject\n" +
		"\tviskit fds path/to/workspace/FooProject --theme defaultTheme\n"
	));
	console.info(colors.info(
		"Why?\n\n" +

		"...\n" +
		"....\n\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(project, options){

	var result = await findDupeSkins(
		path.resolve(project),
		options.theme,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(result));
	}
	else{
		/* Ex. {
			"dupes": {
				"f41dc707f87093eef72c0210e5319b79": [{
					"file": "sknSampleRowTemplate.json",
					"theme": "defaultTheme",
					"relPath": "themes/defaultTheme/sknSampleRowTemplate.json",
					"absPath": "/Users/miguelangel/ws/vis4/PerfTest1/themes/defaultTheme/sknSampleRowTemplate.json",
					"name": "sknSampleRowTemplate"
				}, {
					"file": "sknSampleSectionHeaderTemplate.json",
					"theme": "defaultTheme",
					"relPath": "themes/defaultTheme/sknSampleSectionHeaderTemplate.json",
					"absPath": "/Users/miguelangel/ws/vis4/PerfTest1/themes/defaultTheme/sknSampleSectionHeaderTemplate.json",
					"name": "sknSampleSectionHeaderTemplate"
				}]
			},
			"stats": {
				"Skins scanned": 13,
				"Unique skins": 12,
				"Dupe skins": 1,
				"Dupe ratio": "7.69%",
				"Max dupes": 1,
				"Min dupes": 0,
				"Elapsed time": "0.018s"
			}
		}*/

		forOwn(result.dupes, (dupeSkins, md5)=>{
			console.log(`MD5: '${md5}'`.warn);
			dupeSkins.forEach((skin) => {
				outputs.print(options.output, skin, "warn");
			});
			console.log("");
		});

		forOwn(result.stats, (value,key) => {
			console.log(`${key}:\t${value}`.info);
		});
	}
}

program.parse(process.argv);
