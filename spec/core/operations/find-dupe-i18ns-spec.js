"use strict";

const path = require('path');
const findDupes = require("../../../src/core/operations/find-dupe-i18ns");

describe("\tGiven a project with internationalisation enabled\n", () => {

	beforeAll(()=>{
		//spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( "\tWhen we search for duplicate i18n keys for a locale\n" +
		"\tThen then we get the list of all translations with at least one duplicate", async () => {

			var projectPath = "test/projects/dupes-i18ns-1";
			var locale = "en_US";
			var dupes = await findDupes(projectPath, locale);
			expect(dupes[locale]).toEqual({
				"credit card": [{
					"key": "Credit Card",
					"translation": "Credit Card"
				}, {
					"key": "product.CREDIT_CARD",
					"translation": "credit card"
				}],
				"savings feature": [{
					"key": "desc.SAVINGS_FEATURE_1",
					"translation": "Savings feature"
				}, {
					"key": "desc.SAVINGS_FEATURE_2",
					"translation": "  savings feature!"
				}, {
					"key": "desc.SAVINGS_FEATURE_3",
					"translation": "savings    feature."
				}]
			});

			delete dupes.stats["Elapsed time"];
			expect(dupes.stats).toEqual({
				"Translations scanned": 10,
				"Unique translations": 7,
				"Duplicate translations": 3,
				"Duplication ratio": "30.00%",
				"Max duplicates": 2,
				"Min duplicates": 0
			});
	});

	it( "\tWhen we search for duplicate i18n keys for a locale with special non UTF8 characters\n" +
		"\tThen then we get the list of all transliterated translations with at least one duplicate", async () => {

			var projectPath = "test/projects/dupes-i18ns-1";
			var locale = "cs_CZ";
			var dupes = await findDupes(projectPath, locale);
			expect(dupes[locale]).toEqual({
				"kreditni karta": [{
					"key": "Credit Card",
					"translation": "Kreditní Karta"
				}, {
					"key": "product.CREDIT_CARD",
					"translation": "Kreditní Karta"
				}]
			});

			delete dupes.stats["Elapsed time"];
			expect(dupes.stats).toEqual({
				"Translations scanned": 10,
				"Unique translations": 9,
				"Duplicate translations": 1,
				"Duplication ratio": "10.00%",
				"Max duplicates": 1,
				"Min duplicates": 0
			});
	});
});
