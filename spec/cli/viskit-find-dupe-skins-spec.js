"use strict";

const cmd = "fds";
const longCmd = "find-dupe-skins"
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis project with at least one theme\n", () => {

	var options = [
		cmd,
		"./test/projects/dupes-skins-1",
		"-o",
		"j"
		//"-v"
	];
	var verbose = false;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( `\tWhen we invoke viskit ${cmd} on it without specifying a theme\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	});

	it( `\tWhen we invoke viskit ${longCmd} on it and specify a non-existing theme\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options.concat([
				"--theme",
				"Nonexisting"
			]), verbose);
			expect(code).toBe(0);
	});

	it( `\tWhen we invoke viskit ${longCmd} on it and specify an existing theme\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options.concat([
				"--theme",
				"ChocoMint"
			]), verbose);
			expect(code).toBe(0);
	});
});

describe("\tGiven a project that is not a Vis project\n", () => {

	var options = [
		cmd,
		"./test/projects/Nonexisting",
		"-o",
		"j"
		//"-v"
	];
	var verbose = false;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( `\tWhen we invoke viskit ${cmd} on it without specifying a theme\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
	});

	it( `\tWhen we invoke viskit ${longCmd} on it and specify a non-existing theme\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options.concat([
				"--theme",
				"Nonexisting"
			]), verbose);
			expect(code).toBe(0);
	});

	it( `\tWhen we invoke viskit ${longCmd} on it and specify an existing theme\n` +
		"\tThen the process ends with exit code 0", async () => {

			var code = await invokeCommand("viskit", options.concat([
				"--theme",
				"ChocoMint"
			]), verbose);
			expect(code).toBe(0);
	});
});
