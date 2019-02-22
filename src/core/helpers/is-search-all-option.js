function isSearchAllOption(option){
	return !option || option.trim() === "all" || option.trim() === "";
}

module.exports = isSearchAllOption;
