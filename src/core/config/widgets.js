const deprecatedContainerTypes = [
	//"com.kony.gen.viz.model.container.KVizHBox", //@class
	//"com.kony.gen.viz.model.container.KVizVBox" //@class
	"kony.ui.Box" //name
	//"HBox", "VBox" //wType
];

const containerTypes = [
	"kony.ui.FlexContainer",
	"kony.ui.FlexScrollContainer"
].concat(deprecatedContainerTypes);

module.exports = {
	containerTypes: containerTypes,
	deprecatedContainerTypes: deprecatedContainerTypes
};
