"use strict";

var cmd = "gqv";
var longCmd = "get-quantum-version"
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis 8.4 project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	var options = [
		cmd,
		"./test/projects/starter-v8.4",
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

describe("\tGiven a folder that is not a project\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	var options = [
		cmd,
		"./test/projects/not-a-project",
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
});
