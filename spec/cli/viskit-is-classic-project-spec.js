"use strict";

var cmd = "ivp";
var longCmd = "is-classic-project"
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis 8.4 project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	var options = [
		cmd,
		"./test/projects/enterprise-v7.3",
		"-o",
		"j"
		//"-v"
	];
	var verbose = false;

	it( `\tWhen we invoke viskit ${cmd} on it\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	});

	it( `\tWhen we invoke viskit ${longCmd} on it\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	});
});
