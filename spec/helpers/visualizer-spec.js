"use strict";
const path = require('path');
const vis = require("../../helpers/visualizer");

describe("\tGiven a path to a Vis installation\n", () => {

	var expectedVersion;

	beforeAll(() => {});

	beforeEach(() => {});

	it( "\tWhen the installation is brand new\n" +
		"\tThen the versions of the project plugins are removed from the plugins dir", async () => {

		var visPath = path.resolve("test/installations/KonyVisualizerEnterprise8.X.Y");
		var dryRun = true;
		var verbose = false;

		var stats = await vis.dedupPlugins(visPath, [
			"com.kony.cloudmiddleware",
			"com.kony.cloudthirdparty",
			"com.kony.codegen",
			"com.kony.desktopweb",
			"com.kony.fpreview",
			"com.kony.ide.paas.branding",
			"com.kony.ios",
			"com.kony.license",
			"com.kony.mobile.fabric.client.sdk",
			"com.kony.reference.architecture",
			"com.kony.spa",
			"com.kony.studio.cloud",
			"com.kony.studio.viz.api",
			"com.kony.studio.viz.chrome.api",
			"com.kony.studio.viz.chrome.mac64",
			"com.kony.studio.viz.core.mac64",
			"com.kony.studio.viz.nodejs.mac64",
			"com.kony.thirdparty.jars",
			"com.kony.viz.ide",
			"com.kony.webcommons",
			"com.pat.android",
			"com.pat.soapui",
			"com.pat.tabrcandroid",
			"com.pat.tool.keditor"
		], dryRun, verbose);
		
		expect(stats.removed).toBe(24);
		expect(stats.searched).toBe(24);
	});
});
