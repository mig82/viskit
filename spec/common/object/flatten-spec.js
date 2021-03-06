const flatten = require("../../../src/common/object/flatten");
flatten.setVerbose(false); //Set this to true to see the log statements.

describe("\tGiven a map with nested maps\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});


	it( "\tWhen we flatten the map\n" +
		"\tThen the properties of the nested maps become properties of the parent map", () => {

		var json = {
			foo: 1,
			bar: {
				x: 2,
				y: 3
			},
			wiz: {
				z: "lorem ipsum",
				w: false
			},
			zen: 3.1416
		};
		expect(flatten(json)).toEqual({
			foo: 1,
			"bar/x": 2,
			"bar/y": 3,
			"wiz/z": "lorem ipsum",
			"wiz/w": false,
			zen: 3.1416
		});
	});
});

describe("\tGiven a map with nested arrays\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	it( "\tWhen we flatten the map\n" +
		"\tThen the elements in the arrays become properties of the parent map", () => {

		var json = {
			foo: 1,
			bar: [2, 3],
			wiz: ["lorem ipsum", false],
			zen: 3.1416
		};
		expect(flatten(json)).toEqual({
			foo: 1,
			"bar[0]": 2,
			"bar[1]": 3,
			"wiz[0]": "lorem ipsum",
			"wiz[1]": false,
			zen: 3.1416
		});
	});
});

describe("\tGiven a map with nested maps containing other nested maps\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	it( "\tWhen we flatten the map specifying a depth of 1,\n" +
		"\tThen only the properties of the directly nested maps become properties of the parent map", () => {

		var json = {
			foo: 1,
			bar: {
				x: 2,
				y: 3,
				wiz: {
					z: "lorem ipsum",
					w: false
				}
			},
			zen: 3.1416
		};
		expect(flatten(json, 1)).toEqual({
			foo: 1,
			"bar/x": 2,
			"bar/y": 3,
			"bar/wiz": {
				z: "lorem ipsum",
				w: false
			},
			zen: 3.1416
		});
	});

	it( "\tWhen we flatten the map with a depth matching that of the nested object,\n" +
		"\tThen the properties of the depth-nested nested maps become properties of the parent map", () => {

		var json = {
			foo: 1,
			bar: {
				x: 2,
				y: 3,
				wiz: {
					z: "lorem ipsum",
					w: false
				}
			},
			zen: 3.1416
		};
		expect(flatten(json, 2)).toEqual({
			foo: 1,
			"bar/x": 2,
			"bar/y": 3,
			"bar/wiz/z": "lorem ipsum",
			"bar/wiz/w": false,
			zen: 3.1416
		});
	});
});

describe("\tGiven a map with nested arrays containing objects\n", () => {

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	it( "\tWhen we flatten the map specifying a depth of 1\n" +
		"\tThen the elements in the arrays become properties of the parent map but are not flattened themselves", () => {

		var json = {
			foo: 1,
			bar: [2, 3],
			wiz: [{
				z: "lorem ipsum",
				w: false
			}],
			zen: 3.1416
		};
		expect(flatten(json, 1)).toEqual({
			foo: 1,
			"bar[0]": 2,
			"bar[1]": 3,
			"wiz[0]": {
				z: "lorem ipsum",
				w: false
			},
			zen: 3.1416
		});
	});

	it( "\tWhen we flatten the map with a depth matching that of the nested objects in the arrays,\n" +
		"\tThen the properties of the depth-nested nested maps become properties of the parent map", () => {

		var json = {
			foo: 1,
			bar: [2, 3],
			wiz: [{
				z: "lorem ipsum",
				w: false
			}],
			zen: 3.1416
		};

		expect(flatten(json, 2)).toEqual({
			foo: 1,
			"bar[0]": 2,
			"bar[1]": 3,
			"wiz[0]/z": "lorem ipsum",
			"wiz[0]/w": false,
			zen: 3.1416
		});
	});
});
