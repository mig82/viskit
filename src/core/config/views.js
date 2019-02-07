//User UI types.
const standardTypes = [
	'forms',
	'popups',
	'templates'
];

//Component UI types.
const componentTypes = [
	'userwidgets'
];

//All UI types
const types = standardTypes.concat(componentTypes);
const values = types.concat("all");
const options = types.join("|");
const regex = new RegExp(`^(${options})$`);

const cmdTypeOption = {
	flag: "-t, --view-type <type>",
	desc: `The type of view for which you wish to apply this command -i.e. ${options}`
};

const cmdNameOption = {
	flag: "-n, --view-name <name>",
	desc: "The name of the form, popup, template or component for which you wish to apply this command."
};

module.exports = {
	types: types,
	standardTypes: standardTypes,
	componentTypes: componentTypes,
	values: values,
	options: options,
	regex: regex,
	cmdTypeOption: cmdTypeOption,
	cmdNameOption: cmdNameOption
};
