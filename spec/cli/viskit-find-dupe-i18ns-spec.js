"use strict";

const cmd = "fdi";
const longCmd = "find-dupe-i18ns"
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis 8.4 project with an i18n.json file\n", () => {

	var options = [
		cmd,
		"./test/projects/StarterV8SP4",
		"-o",
		"j"
		//"-v"
	];
	var verbose = false;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

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
