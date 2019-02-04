const colors = require("colors");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);

const View = require("../core/models/view");
const Image = require("../core/models/image");
const Widget = require("../core/models/widget");

const types = [
	"a", //Print absolute paths.
	"r", //Print relative paths.
	"f", //Print file names.
	"t", //Print tab-separated metadata.
];

var options = types.join("|");
var regex = new RegExp(`^(${options})$`);

const print = function(type, model, colorDef){

	var outputColor;
	if (typeof colorDef === "function"){
		outputColor = colorDef(model);
	}
	else if (typeof colorDef === "string"){
		outputColor = colorDef
	}
	else{
		outputColor = "info";
	}

	if(process.env.verbose){
		//console.debug("%o".info, model);
	}

	switch (type) {
		case "a":
			console.log("%s"[outputColor], model.absPath);
			break;
		case "r":
			console.log("%s"[outputColor], model.relPath);
			break;
		case "f":
			console.log("%s"[outputColor], model.file);
			break;
		default: //t
			console.log("%s"[outputColor], model.toTabbedString());
	}
}

const cmdOption = {
	flag: "-o, --output <format>",
	desc: "The format in which you wish the output to be displayed."
};

module.exports = {
	types: types,
	options: options,
	regex: regex,
	print: print,
	cmdOption: cmdOption
};
