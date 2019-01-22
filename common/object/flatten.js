const forOwn = require("lodash.forown");
const NotAnObjectError = require("./errors/not-an-object");

let verbose = process && process.env && process.env.verbose;

//TODO: Contribute this back to Lodash.

function flatten(json, depth){

	var json = JSON.parse(JSON.stringify(json));
	//Only [] and {} are allowed.
	if(typeof json !== "object"){
		throw new NotAnObjectError("This is not an object: " + json);
	}

	depth = typeof depth === "number"?Number.parseInt(depth):1;

	//const primitives = ["boolean", "string", "number", "undefined"];
	var isFlat;
	var k = 1;
	do{
		isFlat = true;
		forOwn(json, (value, key) => {

			if(Array.isArray(value)){
				for (var i = 0; i < value.length; i++) {
					json[`${key}[${i}]`] = value[i];
					var typeOfNested = typeof value[i];
					//if(verbose)console.log("\t%d is %s", i, typeOfNested);
					isFlat = isFlat && typeOfNested !== "object"
				}
				delete json[key];
			}
			else if(typeof value === "object"){
				forOwn(value, (value2, key2) => {
					json[`${key}/${key2}`] = value2;
					var typeOfNested = typeof value2;
					//if(verbose)console.log("\t%s is %s", key2, typeOfNested);
					isFlat = isFlat && typeOfNested !== "object";
				});
				delete json[key];
			}
			//else if(primitives.indexOf(typeof value) >= 0){}
		});
		//if(verbose)console.log("isFlat:%s\tk:%d\tdepth:%d\n", isFlat, k, depth);
		k++;
	}while(!isFlat && k <= depth);

	return json;
}

module.exports = flatten;
