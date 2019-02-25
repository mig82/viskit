"use strict";

const {ltVersion, gteVersion} = require("../../../src/core/helpers/compare-versions");

describe("\tGiven two major, minor and patch versions\n", () => {

	beforeAll(() => {});

	beforeEach(() => {});

	it( "\tWhen we evaluate whether a lower version is less than a higher one\n" +
		"\tThen this is true", () => {
			expect(ltVersion("8.3.4", "8.13.4")).toBe(true);
	});

	it( "\tWhen we evaluate whether a higher version is greater equal than itself\n" +
		"\tThen this is true", () => {
			expect(gteVersion("8.3.4", "8.3.4")).toBe(true);
	});

	it( "\tWhen we evaluate whether a higher version is greater equal than a higher one\n" +
		"\tThen this is true", () => {
			expect(gteVersion("8.4.4", "8.3")).toBe(true);
	});
});
