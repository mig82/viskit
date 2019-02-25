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

module.exports = {
	types: types,
	values: values,
	options: options,
	regex: regex,
	cmdOption: cmdOption
};
