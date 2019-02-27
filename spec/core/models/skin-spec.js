"use strict";

var Skin = require("../../../src/core/models/Skin");

describe("\tGiven a path to a skin\n", () => {

	var skinFile1;
	var projectPathFoo, projectPathBar;
	var theme1;
	var relativePath1;

	beforeAll(() => {

		spyOn(console, 'log').and.callThrough();

		skinFile1 = "slForm.json";
		theme1 = "defaultTheme";
		relativePath1 = `themes/${theme1}/${skinFile1}`;
		projectPathFoo = "~/workspace/FooApp";
		projectPathBar = "~/workspace/BarApp";
	});

	beforeEach(() => {
		Skin.resetProjectPath();
	});

	it( "\tWhen the project path is not set\n" +
		"\tThen attempting to parse a skin path throws an error", () => {
		var skinPath1 = `${projectPathFoo}/${relativePath1}`;
		//No project path is set.
		try{
			var skin1 = Skin.fromPath(skinPath1);
		}
		catch(e){
			expect(e.message).toBe(
				"Cannot parse an skin path without the project path. " +
				"Call Skin.setProjectPath(projectPath) at least once."
			);
		}
	})

	it( "\tWhen attempting to set the project path to null\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			Skin.setProjectPath(null);
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen attempting to set the project path to blank\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			Skin.setProjectPath("           ");
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen the project path is set correctly\n" +
		"\tThen the skin path is parsed correctly", () => {

		Skin.setProjectPath(projectPathFoo);
		var skinPath1 = `${projectPathFoo}/${relativePath1}`;
		var skin1 = Skin.fromPath(skinPath1);

		expect(skin1.absPath).toBe(skinPath1);
		expect(skin1.relPath).toBe(relativePath1);
		expect(skin1.theme).toBe(theme1);
		expect(skin1.file).toBe(skinFile1);
	});

	it( "\tWhen the project path is forced a second time\n" +
		"\tThen the first value doesn't hold and the second one has effect.", () => {

		Skin.setProjectPath(projectPathFoo);
		Skin.setProjectPath(projectPathBar, true); //This second does have effect.

		var skinPath1 = `${projectPathBar}/${relativePath1}`;
		var skin1 = Skin.fromPath(skinPath1);

		expect(skin1.absPath).toBe(skinPath1);
		expect(skin1.relPath).toBe(relativePath1);
		expect(skin1.theme).toBe(theme1);
		expect(skin1.file).toBe(skinFile1);
	});

	it( "\tWhen the skin is created from its path\n" +
		"\tThen the the result is the same as using the constructor", () => {

		Skin.setProjectPath(projectPathFoo);
		var skinPath1 = `${projectPathFoo}/${relativePath1}`;
		var skin1 = Skin.fromPath(skinPath1);
		var skin2 = new Skin(skinFile1, theme1, relativePath1, skinPath1);

		expect(skin1).toEqual(skin2);
	});
});
