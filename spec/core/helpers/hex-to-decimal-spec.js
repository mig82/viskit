"use strict";

const hexToDecimal = require("../../../src/core/helpers/hex-to-decimal");

describe("\tGiven ...\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( "\tWhen ...\n" +
		"\tThen ...", () => {
		expect(hexToDecimal("7DE")).toBe(2014);
		expect(hexToDecimal("ff")).toBe(255);
	});
});
