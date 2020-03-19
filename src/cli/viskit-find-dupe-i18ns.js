#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const forOwn = require('lodash.forown');
const truncate = require('lodash.truncate');
const outputs = require("../reporters/console");
const findDupeI18ns = require("../core/controllers/find-dupe-i18ns");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);

program
	.usage("[options] <project>")
	.option("--locale <locale>", "The name of the locale for which you wish to search for translation duplicates")
	.option(outputs.cmdOption.flag, outputs.cmdOption.desc, outputs.regex)
	.action(onAction);

program.on('--help', function(){
	console.info(colors.info(
		"\nExamples:\n" +
		"\tviskit find-dupe-i18ns path/to/workspace/FooProject\n" +
		"\tviskit fdi path/to/workspace/FooProject\n" +
		"\tviskit fdi path/to/workspace/FooProject --locale es_ES\n"
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

	var result = await findDupeI18ns(
		path.resolve(project),
		options.locale,
		process.env.verbose
	);

	if(options.output === "j"){
		console.log(JSON.stringify(result));
	}
	else{
		/* Ex. {
			"cs_CZ": {
				"kreditn karta": [{
					"key":"Credit Card",
					"translation":"Kreditní Karta"
				},{
					"key":"product.CREDIT_CARD",
					"translation":"Kreditní Karta"
				}]
			}
			"stats": {...}
		} */

		//forOwn(dupes, (localisation, locale) => {
		var locale = options.locale;
		var localisation = result[locale];
			console.log(`Locale: ${locale}:\n`.info);
			forOwn(localisation, (translations, absTranslation) => {
				console.log(`Translation: '${absTranslation}'`.warn);
				translations.forEach((translation) => {
					console.log(`\t${translation.key}\t\t'${truncate(translation.translation, {length: 50})}'`.warn);
				});
				console.log("");
			});
			//outputs.print(options.output, locale, "info");
		//});

		var stats = result.stats;
		forOwn(stats, (value,key) => {
			console.log(`${key}:\t${value}`.info);
		});
	}
}

program.parse(process.argv);
