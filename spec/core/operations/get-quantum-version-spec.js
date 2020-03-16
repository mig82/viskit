"use strict";

const path = require('path');
const getQuantumVersion = require("../../../src/core/operations/get-quantum-version");

describe("\tGiven a Quantum project\n", () => {

	var projectPath = "test/projects/StarterV8SP4";;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( "\tWhen we try to read the project's version\n" +
		"\tThen the creation and current versions match what's specified in its projectProperties.json file", async () => {

			var versions = await getQuantumVersion(projectPath);
			expect(versions.created).toEqual("8.4.0");
			expect(versions.current).toEqual("8.4.55");
	});
});

describe("\tGiven a folder that does not contain a project\n", () => {

	var projectPath = "test/projects/not-a-project";;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	it( "\tWhen we try to read the project's version\n" +
		"\tThen the creation and current versions are undefined", async () => {

			var versions = await getQuantumVersion(projectPath);
			expect(versions.created).toBeUndefined();
			expect(versions.current).toBeUndefined();
	});
});

describe("\tGiven a folder that does not exist\n", () => {

	var projectPath = "test/projects/non-existing-folder";;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	it( "\tWhen we try to read the project's version\n" +
		"\tThen the creation and current versions are undefined", async () => {

			var versions = await getQuantumVersion(projectPath);
			expect(versions.created).toBeUndefined();
			expect(versions.current).toBeUndefined();
	});
});
