#!/usr/bin/env node

const program = require("commander");
const path = require('path');
const colors = require("colors");
const setVisVersion = require("./controllers/set-vis-version");
const theme = require("./config/theme.js");
colors.setTheme(theme);

colors.setTheme(theme);

const usage = "Usage:  [options] <visualizer-path> <project>";

program
	.usage(usage)
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

		"IMPORTANT NOTE: ".emphasis + "This command is highly experimental. Vis v8 brought with it breaking \n" +
		"changes to how Visualizer works with the JDK, Gradle and other dependencies. You should still \n" +
		"keep at least a v7.x and a v8.x installation and not try to transform a v7.x into a v8.x or \n" +
		"viceversa. Also keep in mind that the most recent Vis versions will require more recent Xcode \n" +
		"versions." +
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
	var pluginVersions = await setVisVersion(
		path.resolve(visualizerPath),
		path.resolve(project),
		options.dryRun,
		process.env.verbose
	);
	pluginVersions.forEach(plugin => {outputs.print(options.output, plugin)});
}

program.parse(process.argv);
