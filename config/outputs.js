const colors = require("colors");
const theme = require("./theme.js");
colors.setTheme(theme);

const types = [
	"a", //Print absolute paths.
	"r", //Print relative paths.
	"f", //Print file names.
	"t", //Print tab-separated metadata.
];

var options = types.join("|");
var regex = new RegExp(`^(${options})$`);

const print = function(type, widget, colorDef){

	var outputColor;
	if (typeof colorDef === "function"){
		outputColor = colorDef(widget);
	}
	else if (typeof colorDef === "string"){
		outputColor = colorDef
	}
	else{
		outputColor = "info";
	}

	if(process.env.verbose){
		console.debug("%o".info, widget);
	}

	switch (type) {
		case "a":
			console.log("%s"[outputColor], widget.absPath);
			break;
		case "r":
			console.log("%s"[outputColor], widget.relPath);
			break;
		case "f":
			console.log("%s"[outputColor], widget.file);
			break;
		default: //t
			if(widget.info){
				console.log("%s\t%s\t%s\t%s\t%s"[outputColor],
					widget.viewType,
					widget.channel?widget.channel:"n/a",
					widget.viewName,
					widget.file,
					widget.info
				);
			}
			else{
				console.log("%s\t%s\t%s\t%s"[outputColor],
					widget.viewType,
					widget.channel?widget.channel:"n/a",
					widget.viewName,
					widget.file
				);
			}
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
