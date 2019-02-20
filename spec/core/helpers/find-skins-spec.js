"use strict";
const path = require('path');
const Skin = require("../../../src/core/models/skin");
const findSkins = require("../../../src/core/helpers/find-skins");

describe("\tGiven a project\n", () => {

	var projectPath;
	var defaultThemeSkins, secondThemeSkins;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();

		projectPath = "test/projects/find-skins";

		defaultThemeSkins = [
			new Skin("slFbox.json", "defaultTheme", "themes/defaultTheme/slFbox.json", `${projectPath}/themes/defaultTheme/slFbox.json`),
			new Skin("slForm.json", "defaultTheme", "themes/defaultTheme/slForm.json", `${projectPath}/themes/defaultTheme/slForm.json`),
			new Skin("slImage.json", "defaultTheme", "themes/defaultTheme/slImage.json", `${projectPath}/themes/defaultTheme/slImage.json`),
			new Skin("slPopup.json", "defaultTheme", "themes/defaultTheme/slPopup.json", `${projectPath}/themes/defaultTheme/slPopup.json`)
		];

		secondThemeSkins = [
			new Skin("slFbox.json", "secondTheme", "themes/secondTheme/slFbox.json", `${projectPath}/themes/secondTheme/slFbox.json`),
			new Skin("slForm.json", "secondTheme", "themes/secondTheme/slForm.json", `${projectPath}/themes/secondTheme/slForm.json`),
			new Skin("slImage.json", "secondTheme", "themes/secondTheme/slImage.json", `${projectPath}/themes/secondTheme/slImage.json`),
			new Skin("slPopup.json", "secondTheme", "themes/secondTheme/slPopup.json", `${projectPath}/themes/secondTheme/slPopup.json`)
		];
	});

	beforeEach(() => {});

	it( "\tWhen we search for skins without specifying a theme\n" +
		"\tThen we get the full list of all skins in all themes", async () => {

			var skins = await findSkins(projectPath, null, false);
			var allSkins = defaultThemeSkins.concat(secondThemeSkins);
			expect(skins).toEqual(allSkins);
	});

	it( "\tWhen we search for skins and specify a theme\n" +
		"\tThen we get the full list of all skins in the specified theme", async () => {

			var skins = await findSkins(projectPath, "secondTheme", false);
			expect(skins).toEqual(secondThemeSkins);
	});
});
