"use strict";
const path = require('path');
const projects = require("../../helpers/projects");

describe("\tGiven a path to a v8.2.6 project\n", () => {

	var expectedVersion;

	beforeAll(() => {
		expectedVersion = "8.2.6";
	});

	beforeEach(() => {});

	it( "\tWhen the Branding plugin is specified\n" +
		"\tThen the version is the one of the Branding plugin", async () => {

		var projectPath = path.resolve(`test/projects/read-version-branding-v${expectedVersion}`);
		var result = await projects.parseProjectPlugins(projectPath, false);
		var version = result.projectVersion;
		expect(version).toBe(expectedVersion);
	});

	it( "\tWhen the Branding plugin is not specified\n" +
		"\tThen the version is the one of the Windows Vis Core plugin", async () => {

		var projectPath = path.resolve(`test/projects/read-version-viscore-win-v${expectedVersion}`);
		var result = await projects.parseProjectPlugins(projectPath, false);
		var version = result.projectVersion;
		expect(version).toBe(expectedVersion);
	});

	it( "\tWhen the Branding plugin is not specified\n" +
		"\tThen the version is the one of the Mac Vis Core plugin", async () => {

		var projectPath = path.resolve(`test/projects/read-version-viscore-mac-v${expectedVersion}`);
		var result = await projects.parseProjectPlugins(projectPath, false);
		var version = result.projectVersion;
		expect(version).toBe(expectedVersion);
	});

	it( "\tWhen the Branding and Vis Core plugins are not specified\n" +
		"\tThen the version is the one of the KEditor plugin", async () => {

		var projectPath = path.resolve(`test/projects/read-version-keditor-v${expectedVersion}`);
		var result = await projects.parseProjectPlugins(projectPath, false);
		var version = result.projectVersion;
		expect(version).toBe(expectedVersion);
	});
});

describe("\tGiven a path to a project\n", () => {

	beforeAll(() => {});

	beforeEach(() => {});

	it( "\tWhen the project plugins are read\n" +
		"\tThen the resulting list matches the project plugins", async () => {

		var projectPath = path.resolve(`test/projects/read-plugins`);
		var result = await projects.parseProjectPlugins(projectPath, false);
		expect(result.plugins).toEqual([
			"com.ronin.foo",
			"com.ronin.bar",
			"com.ronin.qux",
			"com.kony.ide.paas.branding"
		]);
	});
});
