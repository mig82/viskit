
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


/**
 * matches - Determines whether the metadata on one image matches the other.
 * Either because they both have the same name and are for the same channel or
 * because they both have the same name and one is used by a specific channel
 * while the other is stored in the commons folder.
 *
 * @param  {type} image description
 * @return {type}       description
 */
Image.prototype.matches = function _matches(image){
	return image instanceof Image &&
		this.file === image.file && (
			this.channel === image.channel || (
				this.channel === "common" && image.usedBy ||
				image.channel === "common" && this.usedBy
			)
		);
}

Image.matches = function _matches(image1, image2){
	return image1 instanceof Image &&
		image1.matches(image2);
}

var keys = [ //Image
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
]]);

// A regex to search for images in JSON objects
Image.regex = /^.+(\.png|\.jpg|\.ico|\.gif|\.svg)$/i;

module.exports = Image;
