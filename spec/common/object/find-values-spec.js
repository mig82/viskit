const {findValuesForKeys, findValuesMatching} = require("../../../common/object/find-values");

var json = {
	"@class": "com.kony.gen.viz.model.component.KVizDateField",
	"DNDConfig": null,
	"Image": "option0.png",
	"android": {
		"calendarIcon": "option1.png"
	},
	"calendaricon": "option2.png",
	"canUpdateUI": true,
	"iphone": {
		"calendarIcon": "option3.png"
	},
	"spa": {
		"calendarIcon": "option4.png"
	},
	"spa2": {
		"calendarIcon": "option4.png"
	},
	"spa3": {
		"calendarIcon": "option4.png"
	},
	"spa4": {
		"calendarIcon": "option5.png"
	},
	"foo": {
		"spa3": {
			"calendarIcon": "option6.ico"
		}
	},
	"bar": [
		{
			"calendaricon": "option7.jpg"
		},
		{
			"calendarIcon": "option8.gif"
		}
	],
	"qux": {
		"wiz": {
			"_src_": "option9.ico"
		}
	},
	"tickedImage": "option9.gif",
	"startDay": 0,
	"viewtype": "default",
	"wType": "Calendar",
	"widgetalignment": 5,
	"widths": [
		"14.2857%;",
		"14.2857%;",
		"14.2857%;",
		"14.2857%;",
		"14.2857%;",
		"14.2857%;",
		"14.2857%;"
	],
	"year": 2019,
	"zindex": 1
}

describe("\tGiven a JSON object and a key to search for\n", () => {

	beforeAll(() => {});

	beforeEach(() => {});

	it( "\tWhen the object is a map\n" +
		"\tThen all the different values for any matching key are returned", () => {

		var values = findValuesForKeys(json, "calendarIcon");
		expect(values).toEqual(new Set([
			"option1.png",
			"option2.png",
			"option3.png",
			"option4.png",
			"option5.png",
			"option6.ico",
			"option7.jpg",
			"option8.gif"
		]));
	});

	it( "\tWhen the object is an array\n" +
		"\tThen all the different values for any matching key are returned", () => {

		var values = findValuesForKeys([json], "calendarIcon");
		expect(values).toEqual(new Set([
			"option1.png",
			"option2.png",
			"option3.png",
			"option4.png",
			"option5.png",
			"option6.ico",
			"option7.jpg",
			"option8.gif"
		]));
	});
});

describe("\tGiven a JSON object and several keys to search for\n", () => {

	beforeAll(() => {});

	beforeEach(() => {});

	it( "\tWhen the object is a map\n" +
		"\tThen all the different values for any matching key are returned", () => {

		var values = findValuesForKeys(json, ["_src_", "tickedimage"]);
		expect(values).toEqual(new Set([
			"option9.ico",
			"option9.gif"
		]));
	});
});

describe("\tGiven a JSON object and a value pattern to search for\n", () => {

	beforeAll(() => {});

	beforeEach(() => {});

	it( "\tWhen the object is a map\n" +
		"\tThen all the different values for any matching key are returned", () => {

		var values = findValuesMatching(json, /^.+(\.png|\.jpg|\.ico|\.gif|\.svg)$/i);
		expect(values).toEqual(new Set([
			"option0.png",
			"option1.png",
			"option2.png",
			"option3.png",
			"option4.png",
			"option5.png",
			"option6.ico",
			"option7.jpg",
			"option8.gif",
			"option9.ico",
			"option9.gif"
		]));
	});
});
