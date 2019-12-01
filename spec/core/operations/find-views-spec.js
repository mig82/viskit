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
			"forms/mobile/journeyA/journeyA1/Form3.sm/Form3.json"
		];

		allTemplates = [
			"templates/desktop/segments/SampleRowTemplate.sm/SampleRowTemplate.json",
			"templates/desktop/segments/SampleSectionHeaderTemplate.sm/SampleSectionHeaderTemplate.json",
			"templates/mobile/segments/SampleRowTemplate.sm/SampleRowTemplate.json",
			"templates/mobile/segments/SampleSectionHeaderTemplate.sm/SampleSectionHeaderTemplate.json",
			"templates/tablet/segments/SampleRowTemplate.sm/SampleRowTemplate.json",
			"templates/tablet/segments/SampleSectionHeaderTemplate.sm/SampleSectionHeaderTemplate.json"
		];

		//TODO: Add pop-ups and components.
		allViews = allForms.concat(allTemplates);

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
});
