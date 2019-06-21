const hex2Dec = {
	"0":"0",
	"1":"1",
	"2":"2",
	"3":"3",
	"4":"4",
	"5":"5",
	"6":"6",
	"7":"7",
	"8":"8",
	"9":"9",
	"a":"10", "A":"10",
	"b":"11", "B":"11",
	"c":"12", "C":"12",
	"d":"13", "D":"13",
	"e":"14", "E":"14",
	"f":"15", "F":"15"
};

var verbose = false;//process.env.verbose;

function hexToDecimal(hex){

	/*7DE is a hex number
	7DE = (7 * 16^2) + (13 * 16^1) + (14 * 16^0)
	7DE = (7 * 256) + (13 * 16) + (14 * 1)
	7DE = 1792 + 208 + 14
	7DE = 2014 (in decimal number)*/
	if(verbose)console.log(`converting ${hex} to decimal`.debug);
	var total = 0;
	var hexDigits = hex.split("").reverse();

	for (var i = 0; i < hexDigits.length; i++) {
		var dec = hex2Dec[hexDigits[i]];
		var pow16 = Math.pow(16, i);
		if(verbose)console.log(`${hexDigits[i]} -> (${dec}*16^${i}) = (${dec}*${pow16})`.debug);
		total += dec * pow16;
	}
	return total;
}
module.exports = hexToDecimal;
