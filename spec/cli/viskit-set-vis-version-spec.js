"use strict";

var cmd = "svv";
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis 8.3 enterprise installation and a 7.3 enterprise project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {
		//TODO: Delete dropins and move plugins_BACKUP to plugins
		//TODO: Delete test/projects/enterprise-v7.3/.viskit/ivysettings.xml
	});

	it( `\tWhen we invoke viskit ${cmd} on them\n` +
		"\tThen the 7.3 plugins are placed in the 8.3's dropins directory", async () => {

			var options = [
				cmd,
				"./test/installations/KonyVisualizerEnterprise8.3.0",
				"./test/projects/enterprise-v7.3",
				"-o",
				"j",
				"--force"
				//"-v"
			];
			var verbose = false;
			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	}, 15000);
});
