const path = require('path');
const fs = require('fs-extra')
const forOwn = require('lodash.forown');
const keys = require('lodash.keys');
const pickBy = require('lodash.pickby');
const transliterate = require('strman').transliterate;
//const levenshtein = require('fast-levenshtein');
const color = require('colors');

//TODO: All this logic should be in an operation. Not in the controller.
async function findDupesForLocale(translations, trim, ignoreCase, ignoreSpecial, verbose){

	var exactCount = 0;
	var keyCount = 0;
	var uniqueTranslationsCount = 0
	var maxDuplicates = 0
	var minDuplicates = 1

	var start = Date.now();

	dupes = {
		// "enter the security code": [
		//		{key: "some.key.1": translation: "  Enter   the security code."}
		//		{key: "some.key.2": translation: "enTeR the security code! "}
		// ]
	};

	forOwn(translations, (translation, key) => {
		keyCount++

		var absTranslation = transliterate(translation);
		if(trim) absTranslation = absTranslation.replace(/\s+/g, " ").trim();
		if(ignoreCase) absTranslation = absTranslation.toLowerCase();
		if(ignoreSpecial) absTranslation = absTranslation.replace(/[^A-Z0-9\s]+/ig, "");

		if(typeof dupes[absTranslation] === "undefined"){
			dupes[absTranslation] = [];
			if(verbose)console.log(`Dupe: '${translation}' -> ${absTranslation}`.debug);
		}
		else{
			exactCount++
		}
		dupes[absTranslation].push({key, translation});
	})

	//Let's get the count of how many unique translations there are.
	uniqueTranslationsCount = keys(dupes).length;

	//Keep only the translations with duplicates.
	dupes = pickBy(dupes, (translations) => {

		//Abuse pickBy to get the max and min number of duplicates as a side effect.
		maxDuplicates = Math.max(maxDuplicates, translations.length-1);
		minDuplicates = Math.min(minDuplicates, translations.length-1);

		return translations.length > 1;
	});
	//if(verbose)console.log(`dupes: %s`.debug, JSON.stringify(dupes));

	var elapsed = Date.now() - start;
	var stats = {
		"Translations scanned": keyCount,
		"Unique translations": uniqueTranslationsCount,
		"Duplicate translations": exactCount,
		"Duplication ratio": (exactCount/keyCount * 100).toFixed(2) + "%",
		"Max duplicates": maxDuplicates,
		"Min duplicates": minDuplicates,
		"Elapsed time": elapsed/1000 + "s"
	}
	return {dupes, stats};
}

async function findDupesI18ns(projectPath, localeName, verbose){

	//TODO: expose trim, ignoreCase, ignoreSpecial to the CLI.
	localeName = localeName || "en";
	var i18nPath = path.resolve(`${projectPath}/i18n.json`);
	if(verbose)console.log(`Looking for dupes in locale '${localeName}' of file ${i18nPath}`.debug)

	var dupes = {};
	try{
		var i18n = await fs.readJson(i18nPath);

		if(i18n){
			console.log(`Available locales are: ${keys(i18n.locales)}`.info);
			var locale = i18n.locales[localeName];

			if(typeof locale === "object"){
				var result = await findDupesForLocale(locale.i18nStrings, true, true, true, verbose);
				dupes[localeName] = result.dupes;
				dupes.stats = result.stats;
			}
			else{
				console.log(`No localisation '${localeName}' found in file ${i18nPath}.\n`.red);
			}
		}
		else{
			if(verbose)console.log(`Path ${projectPath} does not have an i18n.json file`.debug);
		}
	}
	catch(e){
		console.error(`File ${i18nPath} does not exist or this process does not have sufficient permissions to read it.`.red);
	}
	return dupes;
}

module.exports = findDupesI18ns;
