"use strict";

var cmd = "svv";
const fs = require("fs-extra");
const invokeCommand = require("../../src/core/helpers/invoke-command.js");

describe("\tGiven a Vis 8.3 enterprise installation and a 7.3 enterprise project\n", () => {

	var visEntV83Path = "./test/installations/KonyVisualizerEnterprise8.3.0";

	beforeAll(()=>{
		spyOn(console, 'log').and.callThrough();
	});

	beforeEach(() => {
		//TODO: Delete dropins and move plugins_BACKUP to plugins
		//TODO: Delete test/projects/enterprise-v7.3/.viskit/ivysettings.xml
	});

	xit( `\tWhen we invoke viskit ${cmd} on them\n` +
		"\tThen the 7.3 plugins are placed in the 8.3's dropins directory", async () => {

			var options = [
				cmd,
				visEntV83Path,
				"./test/projects/enterprise-v7.3",
				"-o",
				"j",
				"--force"
				//"-v"
			];
			var verbose = false;
			var code = await invokeCommand("viskit", options, verbose);
			expect(code).toBe(0);
			//TODO: Do some counts to verify the plugins are correctly shuffled.
	}, 15000).pend("This test is a heavy one.");;

	afterEach(async () => {

		//Let's put everything back the way it was.
		try{
			//Remove the dropins dir.
			await fs.remove(`${visEntV83Path}/Kony_Visualizer_Enterprise/dropins`);
			//Remove the plugins dir.
			await fs.remove(`${visEntV83Path}/Kony_Visualizer_Enterprise/plugins`);
			//Rename the backup as the plugins dir.
			await fs.move(`${visEntV83Path}/Kony_Visualizer_Enterprise/plugins_BACKUP`,
				`${visEntV83Path}/Kony_Visualizer_Enterprise/plugins`
			);
		}
		catch(e){
			console.error(e.message);
		}
	});
});
