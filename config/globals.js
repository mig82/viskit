
//User UI types.
const uiSTypes = [
	'forms',
	'popups',
	'templates'
];

//Component UI types.
const uiCTypes = [
	'userwidgets'
];

//All UI types
const uiTypes = uiSTypes.concat(uiCTypes);

const channels = [
	'mobile',
	'tablet',
	'watch',
	'androidwear',
	'desktop'
];

const deprecatedContainerTypes = [
	"com.kony.gen.viz.model.container.KVizHBox",
	"com.kony.gen.viz.model.container.KVizVBox"
];

const containerTypes = [
	"kony.ui.FlexContainer",
	"kony.ui.FlexScrollContainer"
];

module.exports = {
	uiTypes: uiTypes,
	uiSTypes: uiSTypes,
	uiCTypes: uiCTypes,
	channels: channels,
	containerTypes: containerTypes,
	deprecatedContainerTypes: deprecatedContainerTypes
};
