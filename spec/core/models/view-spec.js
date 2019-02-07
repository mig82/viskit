"use strict";
var View = require("../../../src/core/models/view");
describe("\tGiven a path to a view\n", () => {

	const mobileChannel = "mobile";
	const tabletChannel = "tablet";
	const watchChannel = "watch";
	const androidWearChannel = "androidwear";
	const desktopWebChannel = "desktop";
	const allChannels = "common";

	const formViewType = "forms";
	const popupViewType = "popups";
	const templateViewType = "templates";
	const componentViewType = "userwidgets";

	var formName1, formFile1;
	var popupName1, popupFile1
	var templateName1, templateFile1
	var componentName1, componentFile1;

	var formRelPath1, formRelDirPath1;
	var popupRelPath1, popupRelDirPath1;
	var templateRelPath1, templateRelDirPath1;
	var componentRelPath1, componentRelDirPath1;

	var formAbsDirPath1, popupAbsPath1, templateAbsPath1, componentAbsPath1;

	var projectPathFoo, projectPathBar;

	beforeAll(() => {
		//For testing on forms.
		formName1 = "fooForm";
		formFile1 = `${formName1}.json`;
		//forms/mobile/fooForm.sm
		formRelDirPath1 = `${formViewType}/${mobileChannel}/${formName1}.sm`;
		//forms/mobile/fooForm.sm/fooForm.json
		formRelPath1 = `${formRelDirPath1}/${formFile1}`;

		//For testing popups
		popupName1 = "fooPopup";
		popupFile1 = `${popupName1}.json`;
		//popups/tablet/fooPopup.sm
		popupRelDirPath1 = `${popupViewType}/${tabletChannel}/${popupName1}.sm`;
		//popups/tablet/fooPopup.sm/fooPopup.json
		popupRelPath1 = `${popupRelDirPath1}/${popupFile1}`;


		//For testing on templates.
		templateName1 = "fooRowTemplate";
		templateFile1 = `${templateName1}.json`;
		//templates/mobile/segments/fooRowTemplate.sm
		templateRelDirPath1 = `${templateViewType}/${androidWearChannel}/${templateName1}.sm`;
		//templates/mobile/segments/fooRowTemplate.sm/fooRowTemplate.json
		templateRelPath1 = `${templateRelDirPath1}/${templateFile1}`;

		//For testing on components
		componentName1 = "com.acme.FooComponent";
		componentFile1 = "userwidgetmodel.json"
		//userwidgets/com.acme.FooComponent/userwidgetmodel.sm
		componentRelDirPath1 = `${componentViewType}/${componentName1}/userwidgetmodel.sm`;
		//userwidgets/acme.FooComponent/userwidgetmodel.sm/userwidgetmodel.json
		componentRelPath1 = `${componentRelDirPath1}/${componentFile1}`;

		projectPathFoo = "~/workspace/FooApp";
		projectPathBar = "~/workspace/BarApp";
	});

	beforeEach(() => {
		View.resetProjectPath();
	});

	it( "\tWhen the project path is not set\n" +
		"\tThen attempting to parse a view path throws an error", () => {
		var formAbsDirPath1 = `${projectPathFoo}/${formRelDirPath1}`;
		//No project path is set.
		try{
			var v1 = new View(formAbsDirPath1);
		}
		catch(e){
			expect(e.message).toBe(
				"Cannot parse a view path without the project path. " +
				"Call View.setProjectPath(projectPath) at least once."
			);
		}
	})

	it( "\tWhen attempting to set the project path to null\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			View.setProjectPath(null);
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen attempting to set the project path to blank\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			View.setProjectPath("           ");
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen the project path is set correctly\n" +
		"\tThen a form's path is parsed correctly", () => {

		var formAbsDirPath1 = `${projectPathFoo}/${formRelDirPath1}`;
		View.setProjectPath(projectPathFoo);
		var v1 = new View(formAbsDirPath1);
		var absolutePath1 = `${projectPathFoo}/${formRelPath1}`;

		expect(v1.absPath).toBe(absolutePath1);
		expect(v1.relPath).toBe(formRelPath1);
		expect(v1.viewName).toBe(formName1);
		expect(v1.viewType).toBe(formViewType);
		expect(v1.channel).toBe(mobileChannel);
	});

	it( "\tWhen the project path is set correctly\n" +
		"\tThen a popup's path is parsed correctly", () => {

		var popupAbsDirPath1 = `${projectPathFoo}/${popupRelDirPath1}`;
		View.setProjectPath(projectPathFoo);
		var v1 = new View(popupAbsDirPath1);
		var absolutePath1 = `${projectPathFoo}/${popupRelPath1}`;

		expect(v1.absPath).toBe(absolutePath1);
		expect(v1.relPath).toBe(popupRelPath1);
		expect(v1.viewName).toBe(popupName1);
		expect(v1.viewType).toBe(popupViewType);
		expect(v1.channel).toBe(tabletChannel);
	});

	it( "\tWhen the project path is set correctly\n" +
		"\tThen a template's path is parsed correctly", () => {

		var templateAbsDirPath1 = `${projectPathFoo}/${templateRelDirPath1}`;
		View.setProjectPath(projectPathFoo);
		var v1 = new View(templateAbsDirPath1);
		var absolutePath1 = `${projectPathFoo}/${templateRelPath1}`;

		expect(v1.absPath).toBe(absolutePath1);
		expect(v1.relPath).toBe(templateRelPath1);
		expect(v1.viewName).toBe(templateName1);
		expect(v1.viewType).toBe(templateViewType);
		expect(v1.channel).toBe(androidWearChannel);
	});

	it( "\tWhen the project path is set correctly\n" +
		"\tThen a component's path is parsed correctly", () => {

		var componentAbsDirPath1 = `${projectPathFoo}/${componentRelDirPath1}`;
		View.setProjectPath(projectPathFoo);
		var v1 = new View(componentAbsDirPath1);
		var absolutePath1 = `${projectPathFoo}/${componentRelPath1}`;

		expect(v1.absPath).toBe(absolutePath1);
		expect(v1.relPath).toBe(componentRelPath1);
		expect(v1.viewName).toBe(componentName1);
		expect(v1.viewType).toBe(componentViewType);
		expect(v1.channel).toBe(allChannels);
	});

	it( "\tWhen the project path is set more than once\n" +
		"\tThen the first value set is retained and the second has no effect.", () => {

		View.setProjectPath(projectPathFoo);
		View.setProjectPath(projectPathBar); //This second has no effect.

		var formAbsDirPath1 = `${projectPathFoo}/${formRelDirPath1}`;
		var v1 = new View(formAbsDirPath1);
		var absolutePath1 = `${projectPathFoo}/${formRelPath1}`;

		expect(v1.absPath).toBe(absolutePath1);
		expect(v1.relPath).toBe(formRelPath1);
		expect(v1.viewName).toBe(formName1);
		expect(v1.viewType).toBe(formViewType);
		expect(v1.channel).toBe(mobileChannel);
	});

	it( "\tWhen the project path is forced a second time\n" +
		"\tThen the first value doesn't hold and the second one has effect.", () => {

		View.setProjectPath(projectPathFoo);
		View.setProjectPath(projectPathBar, true); //This second does have effect.

		var formAbsDirPath1 = `${projectPathBar}/${formRelDirPath1}`;
		var v1 = new View(formAbsDirPath1);
		var absolutePath1 = `${projectPathBar}/${formRelPath1}`;

		expect(v1.absPath).toBe(absolutePath1);
		expect(v1.relPath).toBe(formRelPath1);
		expect(v1.viewName).toBe(formName1);
		expect(v1.viewType).toBe(formViewType);
		expect(v1.channel).toBe(mobileChannel);
	});
});
