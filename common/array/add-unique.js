function addUnique(array, element){
	if(element && array.indexOf(element) < 0) {
		console.log("Adding %o to %o", element, array)
		array.push(element);
	}
}

module.exports = addUnique;
