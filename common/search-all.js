function searchAll(option){
	return !option || option.trim() === "all" || option.trim() === "";
}

module.exports = searchAll;
