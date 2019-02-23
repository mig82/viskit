
//Private non-static?
var projectPathRegex = undefined;

function Skin(file, theme, relPath, absPath){

	this.file = file;
	this.theme = theme;
	this.relPath = relPath;
	this.absPath = absPath;
}

Skin.fromPath = (skinPath, projectPath) => {

	if(projectPath){
		Skin.setProjectPath(projectPath);
	}
	else if(!projectPathRegex){
		throw new Error(
			"Cannot parse an skin path without the project path. " +
			"Call Skin.setProjectPath(projectPath) at least once."
		);
	}

	var relPath = skinPath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	//console.log(pathParts);

	// themes/defaultTheme/slTitleBar.json
	var file = pathParts[pathParts.length - 1];
	var theme = pathParts[1];
	return new Skin(file, theme, relPath, skinPath);
}

Skin.setProjectPath = function _setProjectPath(projectPath, force){

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

Skin.getProjectPath = function _getProjectPath(){
	return projectPathRegex;
}
Skin.resetProjectPath = function _resetProjectPath(){
	projectPathRegex = null;
}

Skin.prototype.toTabbedString = function _toTabbedString() {
	var s = `${this.theme}\t${this.file}`;
	if(this.info) s+= `\t${this.info}`;
	return s;
};

/**
 * equals - Determines whether to skins are the same according to the path of
 * the JSON file which defines them, relative to the project root.
 *
 * @param  {type} skin description
 * @return {type}       description
 */
Skin.prototype.equals = function _equals(skin){
	return skin instanceof Skin &&
		this.relPath === skin.relPath;
}

Skin.equals = function _equals(skin1, skin2){
	return skin1 instanceof Skin &&
		skin1.equals(skin2);
}

module.exports = Skin;
