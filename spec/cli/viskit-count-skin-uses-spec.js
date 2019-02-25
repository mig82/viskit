"use strict";

var cmd = "csu";
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis starter 8.4 project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( `\tWhen we invoke viskit ${cmd} on it\n` +
		"\tThen we get the count of skin references for the project printed to the terminal", async () => {

			var options = [
				cmd,
				"./test/projects/StarterV8SP4",
				"-o",
				"j"
				//"-v"
			];
			var verbose = false;
			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
			//TODO: Add an option to specify a file to write to, read it and compare.
	});
});
