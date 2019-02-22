const getXpathStringValue = require("../../../src/core/helpers/get-xpath-string-value");
//xpath.setVerbose(true);

describe("\tGiven the XML content of a .project Eclipse file of a Vis project\n", () => {

	var xml = `<?xml version="1.0" encoding="UTF-8"?>
		<projectDescription>
			<name>EuropeModelBank</name>
			<comment></comment>
			<projects></projects>
			<buildSpec></buildSpec>
			<natures>
				<nature>com.pat.tool.keditor.nature.kprojectnature</nature>
			</natures>
		</projectDescription>
	`;

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {});

	it( "\tWhen we try to capture the nature of the project\n" +
		"\tThen it matches the KEditor project type", () => {
			expect(getXpathStringValue(xml, "//nature[1]/text()")).toEqual("com.pat.tool.keditor.nature.kprojectnature")
	});
});
