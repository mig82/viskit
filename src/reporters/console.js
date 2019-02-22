const colors = require("colors");
const theme = require("../core/config/theme.js");
colors.setTheme(theme);

const View = require("../core/models/View");
const Image = require("../core/models/Image");
const Widget = require("../core/models/Widget");

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
			if(model.absPath){
				console.log("%s"[outputColor], model.absPath);
			}
			else{
				console.log("%s"[outputColor], model.file);
			}
			break;
		case "r":
			if(model.relPath){
				console.log("%s"[outputColor], model.relPath);
			}
			else{
				console.log("%s"[outputColor], model.file);
			}
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
