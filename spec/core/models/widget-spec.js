var Widget = require("../../../src/core/models/Widget");

describe("\tGiven a path to a widget\n", () => {

	var flexFile1;
	var formName1, popupName1, templateName1, componentName1;
	var mobileChannel, tabletChannel, watchChannel, androidWearChannel, desktopWebChannel;
	var formViewType, popupViewType, templateViewType, componentViewType;
	var relativePath1;
	var projectPathFoo;

	beforeAll(() => {
		flexFile1 = "mainFlex.json";
		formName1 = "fooForm";
		mobileChannel = "mobile";

		formViewType = "forms";
		popupViewType = "popups";
		templateViewType = "templates";
		componentViewType = "userwidgets";

		relativePath1 = `${formViewType}/${mobileChannel}/${formName1}.sm/${flexFile1}`;
		projectPathFoo = "~/workspace/FooApp";
		projectPathBar = "~/workspace/BarApp";
	});

	beforeEach(() => {
		Widget.resetProjectPath();
	});

	it( "\tWhen the project path is not set\n" +
		"\tThen attempting to parse a widget path throws an error", () => {
		var widgetPath1 = `${projectPathFoo}/${relativePath1}`;
		//No project path is set.
		try{
			var w1 = new Widget(widgetPath1);
		}
		catch(e){
			expect(e.message).toBe(
				"Cannot parse a widget path without the project path. " +
				"Call Widget.setProjectPath(projectPath) at least once."
			);
		}
	})

	it( "\tWhen attempting to set the project path to null\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			Widget.setProjectPath(null);
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen attempting to set the project path to blank\n" +
		"\tThen we get an error", () => {
		//No project path is set.
		try{
			Widget.setProjectPath("           ");
		}
		catch(e){
			expect(e.message).toBe("Cannot set project path to null nor blank.");
		}
	})

	it( "\tWhen the project path is set correctly\n" +
		"\tThen the widget path is parsed correctly", () => {
		var widgetPath1 = `${projectPathFoo}/${relativePath1}`;
		Widget.setProjectPath(projectPathFoo);
		var w1 = new Widget(widgetPath1);

		expect(w1.absPath).toBe(widgetPath1);
		expect(w1.relPath).toBe(relativePath1);
		expect(w1.file).toBe(flexFile1);
		expect(w1.viewName).toBe(formName1);
		expect(w1.viewType).toBe(formViewType);
		expect(w1.channel).toBe(mobileChannel);
	});

	it( "\tWhen the project path is set more than once\n" +
		"\tThen the first value set is retained and the second has no effect.", () => {

		Widget.setProjectPath(projectPathFoo);
		Widget.setProjectPath(projectPathBar); //This second has no effect.

		var widgetPath1 = `${projectPathFoo}/${relativePath1}`;
		var w1 = new Widget(widgetPath1);

		expect(w1.absPath).toBe(widgetPath1);
		expect(w1.relPath).toBe(relativePath1);
		expect(w1.file).toBe(flexFile1);
		expect(w1.viewName).toBe(formName1);
		expect(w1.viewType).toBe(formViewType);
		expect(w1.channel).toBe(mobileChannel);
	});

	it( "\tWhen the project path is forced a second time\n" +
		"\tThen the first value doesn't hold and the second one has effect.", () => {

		Widget.setProjectPath(projectPathFoo);
		Widget.setProjectPath(projectPathBar, true); //This second does have effect.

		var widgetPath1 = `${projectPathBar}/${relativePath1}`;
		var w1 = new Widget(widgetPath1);

		expect(w1.absPath).toBe(widgetPath1);
		expect(w1.relPath).toBe(relativePath1);
		expect(w1.file).toBe(flexFile1);
		expect(w1.viewName).toBe(formName1);
		expect(w1.viewType).toBe(formViewType);
		expect(w1.channel).toBe(mobileChannel);
	});
});
