#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const setVisVersion = require("./controllers/set-vis-version");
const outputs = require("./config/outputs.js");
const theme = require("./config/theme.js");
colors.setTheme(theme);

colors.setTheme(theme);

const usage = "Usage:  [options] <visualizer-path> <project>";

program
	.usage(usage)
	.option('-f, --force', 'Force the operation regardles of how different the installed and requested versions are')
	.action(onAction);
	//TODO: Add dry-run option

program.on('--help', function(){
	console.log(colors.info(
		"\nExamples:\n" +
		"\tviskit set-vis-version path/to/KonyVisualizerEnterpriseX.Y.Z path/to/workspace/FooProject\n" +
		"\tviskit svv /Applications/KonyVisualizerEnterprise8.3.0.0 path/to/workspace/FooProject\n" +
		"\tviskit svv C:\\\\Program\\ Files\\KonyVisualizerEnterprise8.3.0.0 path\\to\\workspace\\FooProject\n"
	));
	console.log(colors.info(
		"Why?\n\n" +

		"When working with two or more projects developed using different versions of Visualiser, it \n" +
		"is very cumbersome to switch between them. Projects developed with Visualizer versions older \n" +
		"than the one you have installed can only be opened if you upgrade them. Projects developed\n" +
		"with Visualizer versions more recent than the one you have installed can only be opened if\n" +
		"you upgrade your installation, and then any upgrade will likely result in a version more recent\n" +
		"than the one your project actually needed.\n\n" +

		"This forces you to either keep multiple installations of Visualiser or to manually switch \n" +
		"the plugins in your Visualiser installation.\n\n" +

		"The original Viskit project (" + "https://github.com/kony-ronin/ant-viskit".underline +
		") was born to transform \n" +
		"the version of the Visualiser installation by downloading and shuffling the plugins needed in \n" +
		"an efficient and reliable way. However, that implemantion was based on an Ant script which could\n" +
		"not be installed, but rather had to be downloaded and set up manually.\n\n" +

		"This command in Viskit's new incarnation as an NPM package adopts that funcionality in a much \n" +
		"more elegant and maintainable way.\n\n" +

		"IMPORTANT: ".emphasis + "This command is " + "HIGHLY EXPERIMENTAL".emphasis +
		". Vis v8 brought with it breaking \n" +
		"changes to how Visualizer works with the JDK, Gradle and other dependencies. You should still \n" +
		"keep at least a v7.x and a v8.x installation and not try to transform a v7.x into a v8.x or \n" +
		"viceversa. Also keep in mind that the most recent Vis versions will require more recent Xcode \n" +
		"and Android SDK versions. This command will do its best to let you know what the min versions \n" +
		"of those external dependencies are.\n\n" +

		"SUPER-IMPORTANT: ".emphasis + "You should not try to transform Vis installations from one " +
		"Major.Minor to another. \n" +
		"It could break your installation. This command is safest to use when transforming an installation\n" +
		"from one Patch or Hotfix version to another. E.g.:\n\n" +

		"\t* Transforming version 8.3.2."+"2".underline+" down or up a hotfix to 8.3.2."+"1".underline+" or to 8.3.2."+"3".underline+" is considered " + "safe".green + " and should work.\n" +
		"\t* Transforming version 8.3."+"2".underline+" down or up a patch to 8.3."+"1".underline+" or 8.3.3 is considered " + "safe".green + " and should work.\n" +
		"\t* Transforming version 8."+"3".underline+".x down or up a minor to 8."+"2".underline+".x or 8."+"4".underline+".x is " + "known to work or break".warn + " depending on the versions.\n" +
		"\t* Transforming version "+"8".underline+".x.y down or up a major to "+"7".underline+".x.y or "+"9".underline+".x.y is " + "likely to break".red + " your installation.\n" +

		"\nIn the event of this command breaking your installation you can always restore the original plugins\n" +
		"from the plugins_BACKUP directory created under your Vis installation." +
		"\n"
	));
});

if (!process.argv.slice(2).length) {
	program.help(helpText => {
		return colors.info(helpText);
	});
}

async function onAction(visualizerPath, project, options){

	if(!visualizerPath || !project || typeof visualizerPath !== "string" || typeof project !== "string"){
		console.info("%s\n".info, usage);
		process.exit(1);
	}

	console.log(colors.info("\nInvoking " + "black".inverse + " magic...\n"));

	try{
		var versionInfo = await setVisVersion(
			path.resolve(visualizerPath),
			path.resolve(project),
			options.dryRun,
			options.force,
			process.env.verbose
		);
		console.log(
			"Done!...\n\nVis path: %s\nNew effective version: %s".info,
			visualizerPath,
			versionInfo.visVersion
		);
		console.log("Make sure you have these dependencies installed:".info);
		versionInfo.dependencies.forEach((dep) => {
			console.log("\t%s: %s".info, dep.name, dep.version);
		});

		console.log("\nNote:".bold.info + " Go restart Vis.\n".info);
	}
	catch(e){

		if(e.name === "IncompatibleMajorMinorError"){
			console.log(e.message.warn);
			console.log(colors.warn(
				"Transforming Vis across different Major.Minor versions could break your installation.\n" +
				"It is " + "strongly".bold + " recommended you install the corresponding Major.Minor version and run this command on that instead.\n" +
				"Try this again with the --force option if you still wish to proceed at your own risk."
			));
		}
		else{
			console.log(e.message.error);
		}
	}
}

program.parse(process.argv);
