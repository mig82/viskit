"use strict";

var cmd = "fi";
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis 7.3 project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( `\tWhen we invoke viskit ${cmd} on it\n` +
		"\tThen the process ends with exit code 0", async () => {

			var options = [
				cmd,
				"./test/projects/enterprise-v7.3",
				"-o",
				"j"
				//"-v"
			];
			var verbose = false;
			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	});
});

describe("\tGiven a Vis 8.4 project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( `\tWhen we invoke viskit ${cmd} on it\n` +
		"\tThen the process ends with exit code 0", async () => {

			var options = [
				cmd,
				"./test/projects/starter-v8.4",
				//"-v"
			];
			var verbose = false;
			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	});
});
