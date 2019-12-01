"use strict";

const path = require('path');
const View = require("../../../src/core/models/View");
const findViews = require("../../../src/core/operations/find-views");

describe("\tGiven a project\n", () => {

	var projectPath;
	var allViews, allForms, allPopups, allTemplates, allComponents;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
		projectPath = "test/projects/StarterV8SP4";

		allForms = [
			"forms/mobile/Form1.sm/Form1.json",
			"forms/mobile/journeyA/Form2.sm/Form2.json",
			"forms/mobile/journeyA/journeyA1/Form3.sm/Form3.json",
			"forms/mobile/journeyA/journeyA1/Form4.sm/Form4.json",
			"forms/mobile/journeyB/Form5.sm/Form5.json"
		];

		allTemplates = [
			"templates/desktop/segments/SampleRowTemplate.sm/SampleRowTemplate.json",
			"templates/desktop/segments/SampleSectionHeaderTemplate.sm/SampleSectionHeaderTemplate.json",
			"templates/mobile/segments/SampleRowTemplate.sm/SampleRowTemplate.json",
			"templates/mobile/segments/SampleSectionHeaderTemplate.sm/SampleSectionHeaderTemplate.json",
			"templates/tablet/segments/SampleRowTemplate.sm/SampleRowTemplate.json",
			"templates/tablet/segments/SampleSectionHeaderTemplate.sm/SampleSectionHeaderTemplate.json"
		];

		allComponents = [
			"userwidgets/com.mig82.viskit.BarComponent/userwidgetmodel.sm/userwidgetmodel.json",
			"userwidgets/com.mig82.viskit.FooComponent/userwidgetmodel.sm/userwidgetmodel.json"
		];

		//TODO: Add pop-ups. They're no longer supported, but older projects may still use them.
		allViews = allForms.concat(allTemplates).concat(allComponents);

	});

	beforeEach(() => {});

	it( "\tWhen we search for views without specifying a type, channel or name\n" +
		"\tThen we get the full list of all forms, pop-ups, templates and components across all channels", async () => {

			var views = await findViews(projectPath);
			var viewRelPaths = views.map((view) => {return view.relPath});

			expect(viewRelPaths).toEqual(allViews);
	});

	it( "\tWhen we search for views specifying type 'form'\n" +
		"\tThen we get the full list of all forms across all channels", async () => {

			var views = await findViews(projectPath, "forms");
			var viewRelPaths = views.map((view) => {return view.relPath});
			expect(viewRelPaths).toEqual(allForms);
	});

	it( "\tWhen we search for views specifying type 'component'\n" +
		"\tThen we get the full list of all the components", async () => {

			var views = await findViews(projectPath, "userwidgets");
			var viewRelPaths = views.map((view) => {return view.relPath});
			expect(viewRelPaths).toEqual(allComponents);
	});
});
