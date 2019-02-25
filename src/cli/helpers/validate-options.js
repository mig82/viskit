const views = require("../../core/config/views.js");
const channels = require("../../core/config/channels.js");
const outputs = require("../../reporters/console");

function validateOptions(options){

	if(options.viewType && !views.regex.test(options.viewType)){
		console.log("Invalid value for option " + "--view-type".emphasis +
			". Use one of " + views.options.emphasis + " or don't use this option."
		);
		process.exit(1);
	}

	if(options.channel && !channels.regex.test(options.channel)){
		console.log(
			"Invalid value for option " + "--channel".emphasis +
			". Use one of " + channels.options.emphasis + " or don't use this option."
		);
		process.exit(1);
	}

	if(options.output && !outputs.regex.test(options.output)){
		console.log(
			"Invalid value for option " + "--output".emphasis +
			". Use one of " + outputs.options.emphasis + " or don't use this option."
		);
		process.exit(1);
	}
}

module.exports = validateOptions;
