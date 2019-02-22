"use strict";

var cmd = "cw";
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis 8.4 project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( `\tWhen we invoke viskit ${cmd} on it\n` +
		"\tThen we get the count of widgets for the project printed to the terminal", async () => {

			var options = [
				cmd,
				"./test/projects/starter-v8.4",
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
