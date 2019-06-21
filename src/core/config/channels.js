const types = [
	'mobile',
	'tablet',
	'watch',
	'androidwear',
	'desktop'
];
const values = types.concat("all");
const options = types.join("|");
const regex = new RegExp(`^(${options})$`);

const cmdOption = {
	flag: "-c, --channel <channel>",
	desc: `The channel or form factor for which you wish to apply this command -i.e. ${options}`
};

/**
 * getChannelFromPlatform - Maps a platform to its corresponding channel.
 *
 * @param  {String} platform One of "common","android","androidwearos","desktopweb",
 * "ipad","iphone","kiosk","spaan","spaandroidtablet","spabb","spaip","spaipad",
 * "spawindowstablet","spawinphone8","tabrcandroid","watchos","windows8","winphone8"
 * @return {String}          One of mobile|tablet|watch|androidwear|desktop
 */
function getChannelFromPlatform(platform){
	var channel = "";
	switch (platform) {
		case "common":
			channel = "common"
			break;
		case "android":
			channel = "mobile"
			break;
		case "androidwearos":
			channel = "androidwear"
			break;
		case "desktopweb":
			channel = "desktop"
			break;
		case "ipad":
			channel = "tablet"
			break;
		case "iphone":
			channel = "mobile"
			break;
		case "kiosk":
			channel = "desktop"
			break;
		case "spaan":
			channel = "mobile"
			break;
		case "spaandroidtablet":
			channel = "tablet"
			break;
		case "spabb":
			channel = "mobile"
			break;
		case "spaip":
			channel = "mobile"
			break;
		case "spaipad":
			channel = "tablet"
			break;
		case "spawindowstablet":
			channel = "tablet"
			break;
		case "spawinphone8":
			channel = "mobile"
			break;
		case "tabrcandroid":
			channel = "tablet"
			break;
		case "watchos":
			channel = "watch"
			break;
		case "windows8":
			channel = "mobile"
			break;
		case "winphone8":
			channel = "mobile"
			break;
		default:
			channel = "unknown"
	}
	return channel;
}

module.exports = {
	types: types,
	values: values,
	options: options,
	regex: regex,
	cmdOption: cmdOption,
	getChannelFromPlatform: getChannelFromPlatform
};
