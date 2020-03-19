"use strict";

const path = require('path');
const forOwn = require('lodash.forown');
const findDupes = require("../../../src/core/operations/find-dupe-skins");

describe("\tGiven a project\n", () => {

	beforeAll(()=>{
		//spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( "\tWhen we search for duplicate skins for a theme\n" +
		"\tThen then we get the list of all skins with at least one other skin that's exactly the same save for the kuid", async () => {

			var projectPath = "test/projects/dupes-skins-1";
			var theme = "ChocoMint";
			var result = await findDupes(projectPath, theme);

			var dupes = {}
			forOwn(result.dupes, (dupeSkins, md5) => {
				dupes[md5] = dupeSkins.map((skin) => {
					return {
						theme: skin.theme,
						relPath: skin.relPath
					};
				});
				dupeSkins.forEach((skin) => {
					delete skin.absPath
				});
			});

			expect(dupes).toEqual({
				"a058e8efa206378632e6f8f88b60ed34": [{
					"theme": "ChocoMint",
					"relPath": "themes/ChocoMint/flexSkin1.json"
				}, {
					"theme": "ChocoMint",
					"relPath": "themes/ChocoMint/flexSkin2.json"
				}],
				"a6d765ce20e2c2fd972ebb90fc474e63": [{
					"theme": "ChocoMint",
					"relPath": "themes/ChocoMint/labelSkin2.json"
				}, {
					"theme": "ChocoMint",
					"relPath": "themes/ChocoMint/labelSkin3.json"
				}, {
					"theme": "ChocoMint",
					"relPath": "themes/ChocoMint/labelSkin4.json"
				}]
			});

			delete result.stats["Elapsed time"];
			expect(result.stats).toEqual({
				"Skins scanned": 11,
				"Unique skins": 8,
				"Dupe skins": 3,
				"Dupe ratio": "27.27%",
				"Max dupes": 2,
				"Min dupes": 0
			});
	});

});
