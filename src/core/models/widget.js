
const viewExtensionRegex = new RegExp(".sm$");

//Private non-static?
var projectPathRegex = undefined;

function Widget(widgetPath, projectPath){

	if(projectPath){
		Widget.setProjectPath(projectPath);
	}
	else if(!projectPathRegex){
		throw new Error(
			"Cannot parse a widget path without the project path. " +
			"Call Widget.setProjectPath(projectPath) at least once."
		);
	}

	var relPath = widgetPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	var file = pathParts[pathParts.length - 1];
	var parent = pathParts[pathParts.length - 2];
	var gParent = pathParts[pathParts.length - 3];
	var viewType = pathParts[0];

	var channel, viewName;
	if(viewType === "userwidgets" || parent === "userwidgetmodel.sm"){
		channel = "common";
		viewName = gParent;
	}
	// Tabs have a different structure: Tabs are nested in TabPanes
	// forms/mobile/homeForm.sm/__fooTabPane__/Tab0ab98b9ae841347.json
	else if(/__.+__/.test(parent)){
		channel = pathParts[1];
		viewName = gParent.replace(viewExtensionRegex, "");
	}
	else{
		channel = pathParts[1];
		viewName = parent.replace(viewExtensionRegex, "");
	}

	this.file = file;
	this.viewName = viewName;
	this.viewType = viewType;
	this.channel = channel;
	this.relPath = relPath;
	this.absPath = widgetPath;
}

Widget.setProjectPath = function _setProjectPath(projectPath, force){

	if(!projectPath || projectPath.trim() === ""){
		throw new Error("Cannot set project path to null nor blank.");
	}

	if(!projectPathRegex || force){
		if(process.env.verbose){
			console.warn("Setting project path to %s. Do NOT do this more than once.".warn, projectPath);
		}
		if(projectPath instanceof RegExp){
			projectPathRegex = projectPath;
		}
		else if(typeof projectPath === "string"){
			projectPathRegex = new RegExp("^" + projectPath + "/");
		}
		else{
			throw new Error("Cannot set project path a " + typeof projectPath);
		}
	}
	else{
		if(process.env.verbose)console.warn("Project path is already set.");
	}
}

Widget.getProjectPath = function _getProjectPath(){
	return projectPathRegex;
}
Widget.resetProjectPath = function _resetProjectPath(){
	projectPathRegex = null;
}

Widget.prototype.toTabbedString = function _toTabbedString() {

	var s = `${this.viewType}\t` +
		`${this.channel?this.channel:"common"}\t` +
		`${this.viewName}\t` +
		`${this.file}`;

	if(this.info) s+= `\t${this.info}`;

	return s;
};

Widget.isImage = (obj) => {
	return obj.wType === "Image" || obj.name === "kony.ui.Image2" ||
	obj["@class"] === "com.kony.gen.viz.model.component.KVizImage2";
}

Widget.isCalendar = (obj) => {
	return obj.wType === "Calendar" || obj.name === "kony.ui.Calendar" ||
	obj["@class"] === "com.kony.gen.viz.model.component.KVizDateField";
}

Widget.isTab = (obj) => {
	return obj.wType === "Tab" || obj.name === "kony.ui.Tab" ||
	obj["@class"] === "com.kony.gen.viz.model.container.KVizTab";
}

Widget.isListBox = (obj) => {
	return obj.wType === "ListBox" || obj.name === "kony.ui.ListBox" ||
	obj["@class"] === "com.kony.gen.viz.model.component.KVizListBox";
}

Widget.isCheckBoxGroup = (obj) => {
	return obj.wType === "CheckBoxGroup" || obj.name === "kony.ui.CheckBoxGroup" ||
	obj["@class"] === "com.kony.gen.viz.model.component.KVizCheckBox";
}

Widget.isRadioButtonGroup = (obj) => {
	return obj.wType === "RadioButtonGroup" || obj.name === "kony.ui.RadioButtonGroup" ||
	obj["@class"] === "com.kony.gen.viz.model.component.KVizRadio";
}

Widget.isSlider = (obj) => {
	return obj.wType === "Slider" || obj.name === "kony.ui.Slider" ||
	obj["@class"] === "com.kony.gen.viz.model.component.KVizSlider";
}

module.exports = Widget;
