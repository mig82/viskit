const forOwn = require("lodash.forown");
const indexOfStringIgnoreCase = require("../array/index-of-string-ignore-case");

function NotAnObjectError(message){
	this.name = "NotAnObjectError";
	this.message = message;
}

function findValuesForKeys(json, searchKeys){

	//Only [] and {} are allowed.
	if(typeof json !== "object"){
		throw new NotAnObjectError("This is not an object: " + json);
	}

	//If the caller is searching for a single key, wrap it in an array.
	if(typeof searchKeys === "string"){
		searchKeys = [searchKeys];
	}

	if(!searchKeys instanceof Array){
		throw new Error("Cannot search for " + typeof searchKeys);
	}

	var found = new Set();
	var items;

	if(item instanceof Array){
		items = json;
	}
	else /*if(item instanceof Object)*/{
		items = [json];
	}

	const primitives = ["boolean", "string", "number"];

	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		forOwn(item, (value, key) => {
			if(primitives.indexOf(typeof value) && indexOfStringIgnoreCase(searchKeys, key) >= 0){
				found.add(value);
			}
			else if(value instanceof Array){
				items = items.concat(value);
			}
			else if(value instanceof Object){
				items.push(value);
			}
		});
	}
	return found;
}

function findValuesMatching(json, regex){

	//Only [] and {} are allowed.
	if(typeof json !== "object"){
		throw new NotAnObjectError("This is not an object: " + json);
	}

	//If the caller is searching for a single key, wrap it in an array.
	if(typeof regex === "string"){
		regex = new RegExp(regex);
	}

	if(!regex instanceof RegExp){
		throw new Error("Cannot search for " + typeof regex);
	}

	var found = new Set();
	var items;

	if(item instanceof Array){
		items = json;
	}
	else /*if(item instanceof Object)*/{
		items = [json];
	}

	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		forOwn(item, (value, key) => {
			if(typeof value === "string" && regex.test(value)){
				found.add(value);
			}
			else if(value instanceof Array){
				items = items.concat(value);
			}
			else if(value instanceof Object){
				items.push(value);
			}
		});
	}
	return found;
}

module.exports = {
	findValuesForKeys: findValuesForKeys,
	findValuesMatching: findValuesMatching
};
