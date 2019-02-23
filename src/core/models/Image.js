
//Private non-static?
var projectPathRegex = undefined;

function Image(file, channel, nature, platform, relPath, absPath, usedBy){

	var fileParts = file.split(".");
	var format = fileParts[fileParts.length - 1];

	this.file = file;
	this.format = format;
	this.channel = channel;
	this.nature = nature;
	this.platform = platform;
	this.relPath = relPath;
	this.absPath = absPath;
	this.usedBy = usedBy; //Whether the image is used by a widget, form, skin, etc.
}

Image.fromPath = (imagePath, projectPath) => {

	if(projectPath){
		Image.setProjectPath(projectPath);
	}
	else if(!projectPathRegex){
		throw new Error(
			"Cannot parse an image path without the project path. " +
			"Call Image.setProjectPath(projectPath) at least once."
		);
	}

	var relPath = imagePath.replace(projectPathRegex, "");
	var pathParts = relPath.split('/');
	//console.log(pathParts);

	// resources/common/zoomout.png'
	// resources/mobile/native/blackberry/down.png'
	// resources/mobile/native/iphone/down.png'
	// resources/tablet/native/ipad/foo.png
	var file = pathParts[pathParts.length - 1];
	var fileParts = file.split(".");
	var format = fileParts[fileParts.length - 1];
	var channel = pathParts[1];

	var platform, nature;
	// resources/desktop/common/bar.gif'
	if(pathParts.length === 4){
		platform = pathParts[2];
	}
	// resources/mobile/native/iphone/down.png'
	else if(pathParts.length === 5){
		nature = pathParts[2]; //nature for lack of a better term.
		platform = pathParts[3];
	}

	return new Image(file, channel, nature, platform, relPath, imagePath);
}

Image.setProjectPath = function _setProjectPath(projectPath, force){

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

Image.getProjectPath = function _getProjectPath(){
	return projectPathRegex;
}
Image.resetProjectPath = function _resetProjectPath(){
	projectPathRegex = null;
}

Image.prototype.toTabbedString = function _toTabbedString() {

	var channel = this.channel?this.channel:"common";
	var s = `${channel}\t${this.file}`;

	if(this.info) s+= `\t${this.info}`;
	if(this.usedBy) s+= `\t${this.usedBy}`;

	return s;
};

/*Image.prototype.toDisplayString = function _toTabbedString() {
	var s = `${this.channel}, ${this.file}, ${this.usedBy}`;
	return s;
};*/

/**
 * referenceMatchesFile - Determines whether the reference to an image can be
 * covered by an image file or not.
 *
 * @param  Image imageRef  The metadata of a reference to an image.
 * @param  Image imageFile The metadata of an image file.
 * @return Boolean           description
 */
Image.referenceMatchesFile = function referenceMatchesFile(imageRef, imageFile) {
	return imageFile instanceof Image && imageRef instanceof Image &&
	imageFile.file === imageRef.file && (
		imageFile.channel === imageRef.channel ||
		imageFile.channel === "common"
	);
};

Image.prototype.matches = function matches(otherImage) {
	if(this.relPath && otherImage.relPath){
		return this.relPath === otherImage.relPath;
	}
	else{
		return this.file === otherImage.file && this.channel === otherImage.channel;
	}
};

/*var keys = [ //Image
	"_src_",
	"imagewhenfailed",
	"imagewhiledownloading"
].concat([ //Calendar
	"Image",
	"calendarIcon",
	"leftNavigationImage",
	"rightNavigationImage"
]).concat([ //Tab
	"_image_"
]).concat([ //CheckBoxGroup
	"tickedImage",
	"untickedImage"
]).concat([ //ListBox & RadioButtonGroup
	"dropDownImage",
	"tickedImage",
	"untickedImage"
]).concat([[ //Slider
	"thumbImage",
	"focusThumbImage"
]]);*/

// A regex to search for images in JSON objects
Image.regex = /^.+(\.png|\.jpg|\.ico|\.gif|\.svg)$/i;

module.exports = Image;
