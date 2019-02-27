
//Private non-static?
var projectPathRegex = undefined;

function Action(type, file, channel, relPath, absPath){

	this.type = type;
	this.file = file;
	this.channel = channel;
	this.relPath = relPath;
	this.absPath = absPath;

	var fileParts = file.split(".");
	this.name = fileParts[0];
}

Action.fromPath = (actionPath, projectPath) => {

	if(projectPath){
		Action.setProjectPath(projectPath);
	}
	else if(!projectPathRegex){
		throw new Error(
			"Cannot parse an action path without the project path. " +
			"Call Action.setProjectPath(projectPath) at least once."
		);
	}

	var relPath = actionPath.replace(projectPathRegex, "");

	//actions/mobile/AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5.json
	var pathParts = relPath.split('/');
	//console.log(pathParts);

	var type = pathParts[0];

	// channels/defaultChannel/slTitleBar.json
	var file = pathParts[pathParts.length - 1];
	var channel = pathParts[1];
	return new Action(type, file, channel, relPath, actionPath);
}

Action.setProjectPath = function _setProjectPath(projectPath, force){

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
		if(process.env.verbose)console.log("Project path is already set.".debug);
	}
}

Action.getProjectPath = function _getProjectPath(){
	return projectPathRegex;
}
Action.resetProjectPath = function _resetProjectPath(){
	projectPathRegex = null;
}

Action.prototype.toTabbedString = function _toTabbedString() {
	var s = `${this.channel}\t${this.file}`;
	if(this.info) s+= `\t${this.info}`;
	return s;
};

/**
 * equals - Determines whether to actions are the same according to the path of
 * the JSON file which defines them, relative to the project root.
 *
 * @param  {type} action description
 * @return {type}       description
 */
Action.prototype.equals = function _equals(action){
	return action instanceof Action &&
		this.relPath === action.relPath;
}

Action.equals = function _equals(action1, action2){
	return action1 instanceof Action &&
		action1.equals(action2);
}

//Matches auto-generated Vis action names -e.g.:
// AS_Button_a8bfa9510246463ab518f540d0279e13
// AS_AppEvents_aece05797aec4b019d9b8c0a2c492bf5
Action.regex = /^AS_[a-z]+_[0-9a-j]{32}$/i;

module.exports = Action;
