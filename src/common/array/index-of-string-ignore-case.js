function indexOfStringIgnoreCase(array, item){

	var itemType = typeof item;
	if(itemType !== "string") {
		throw new Error("Won't search for a item of type " + itemType);
	}

	var index = -1;
	for (var i = 0; i < array.length; i++) {
		if (array[i] && typeof array[i] === "string" &&
		array[i].toLowerCase() === item.toLowerCase()){
			return i;
		}
	}
	return index;
}

module.exports = indexOfStringIgnoreCase;
