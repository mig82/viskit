"use strict";

var Action = require("../../../src/core/models/Action");

describe("\tGiven a path to a action\n", () => {

	var actionFile1;
	var projectPathFoo, projectPathBar;
	var channel1;
	var developerActionRelativePath, designerActionRelativePath;

	beforeAll(() => {

		spyOn(console, 'log').and.callThrough();

		actionFile1 = "AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5.json";
		channel1 = "mobile";
		//actions/mobile/AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5.json
		developerActionRelativePath = `studioactions/${channel1}/${actionFile1}`;
		designerActionRelativePath = `actions/${channel1}/${actionFile1}`;
		projectPathFoo = "~/workspace/FooApp";
		projectPathBar = "~/workspace/BarApp";
	});

	beforeEach(() => {
		Action.resetProjectPath();
	});

	it( "\tWhen the project path is not set\n" +
		"\tThen attempting to parse a action path throws an error", () => {
		var actionPath1 = `${projectPathFoo}/${developerActionRelativePath}`;
		//No project path is set.
		try{
			var action1 = Action.fromPath(actionPath1);
		}
		catch(e){
			expect(e.message).toBe(
				"Cannot parse an action path without the project path. " +
				"Call Action.setProjectPath(projectPath) at least once."
			);
		}
	})

	it( "\tWhen attempting to set the project path to null\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			Action.setProjectPath(null);
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen attempting to set the project path to blank\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			Action.setProjectPath("           ");
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen the project path is set correctly\n" +
		"\tThen the developer action path is parsed correctly", () => {

		Action.setProjectPath(projectPathFoo);
		var actionPath1 = `${projectPathFoo}/${developerActionRelativePath}`;
		var action1 = Action.fromPath(actionPath1);

		expect(action1.type).toBe("studioactions");
		expect(action1.absPath).toBe(actionPath1);
		expect(action1.relPath).toBe(developerActionRelativePath);
		expect(action1.channel).toBe(channel1);
		expect(action1.file).toBe(actionFile1);
	});

	it( "\tWhen the project path is set correctly\n" +
		"\tThen the designer action path is parsed correctly", () => {

		Action.setProjectPath(projectPathFoo);
		var actionPath1 = `${projectPathFoo}/${designerActionRelativePath}`;
		var action1 = Action.fromPath(actionPath1);

		expect(action1.type).toBe("actions");
		expect(action1.absPath).toBe(actionPath1);
		expect(action1.relPath).toBe(designerActionRelativePath);
		expect(action1.channel).toBe(channel1);
		expect(action1.file).toBe(actionFile1);
	});

	it( "\tWhen the project path is forced a second time\n" +
		"\tThen the first value doesn't hold and the second one has effect.", () => {

		Action.setProjectPath(projectPathFoo);
		Action.setProjectPath(projectPathBar, true); //This second does have effect.

		var actionPath1 = `${projectPathBar}/${developerActionRelativePath}`;
		var action1 = Action.fromPath(actionPath1);

		expect(action1.absPath).toBe(actionPath1);
		expect(action1.relPath).toBe(developerActionRelativePath);
		expect(action1.channel).toBe(channel1);
		expect(action1.file).toBe(actionFile1);
	});

	it( "\tWhen the action is created from its path\n" +
		"\tThen the the result is the same as using the constructor", () => {

		Action.setProjectPath(projectPathFoo);
		var actionPath1 = `${projectPathFoo}/${developerActionRelativePath}`;
		var action1 = Action.fromPath(actionPath1);
		var action2 = new Action("studioactions", actionFile1, channel1, developerActionRelativePath, actionPath1);

		expect(action1).toEqual(action2);
	});
});
