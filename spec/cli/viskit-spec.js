"use strict";

const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Viskit installation\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( "\tWhen we invoke Viskit without specifying any command\n" +
		"\tThen we get the full usage text for Viskit printed to the terminal", async () => {

			var options = [
				//command,
				//projectPath,
				//"-v"
			];
			var verbose = false;
			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	});
});
