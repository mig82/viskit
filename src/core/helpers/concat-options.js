function concatOptions(options){
	return "(" + options.join("|") + ")";
}

module.exports = concatOptions;
