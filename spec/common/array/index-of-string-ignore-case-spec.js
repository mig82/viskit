const indexOfStringIgnoreCase = require("../../../common/array/index-of-string-ignore-case");
describe("\tGiven an array of strings\n", () => {

	var strings = [
		"Lorem",
		"ipsum",
		"doLor",
		"sit",
		"amet,",
		"consEctetur",
		"adipiscing",
		"eLit."
	];

	beforeAll(() => {});

	beforeEach(() => {});

	it( "\tWhen searching for the first string contained in the array\n" +
		"\tThen then we get back 0", () => {
			expect(0).toBe(indexOfStringIgnoreCase(strings, "LOREM"))
	});

	it( "\tWhen searching for the last string contained in the array\n" +
		"\tThen then we get back the last index in the array", () => {
			expect(strings.length - 1).toBe(indexOfStringIgnoreCase(strings, "elit."))
	});

	it( "\tWhen searching for an exact string contained in the array\n" +
		"\tThen then we get back the index at which it is found in the array", () => {
			expect(5).toBe(indexOfStringIgnoreCase(strings, "consEctetur"))
	});

	it( "\tWhen searching for a string with different casing contained in the array\n" +
		"\tThen then we get back the index at which it is found in the array", () => {
			expect(5).toBe(indexOfStringIgnoreCase(strings, "CoNsEctEtUR"))
	});

	it( "\tWhen searching for a string NOT contained in the array\n" +
		"\tThen then we get back -1", () => {
			expect(-1).toBe(indexOfStringIgnoreCase(strings, "foo"))
	});
});
