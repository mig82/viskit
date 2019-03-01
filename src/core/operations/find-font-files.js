const path = require("path");
const findFile = require("find").file;
const fs = require("fs-extra");
const colors = require("colors");
const theme = require("../config/theme.js");
colors.setTheme(theme);
const Q = require("q");
Q.longStackSupport = true;

const stripPathEndSlash = require("../helpers/strip-path-end-slash");
const Font = require("../models/Font")

function findFontFiles(projectPath, channel, verbose){
	var projectRootPath = stripPathEndSlash(projectPath);

	var searchPath;

	if(channel === "common"){
		searchPath = "resources/";
		searchPath += "[a-z0-9-_]+\\.(ttf|otf)$";
	}
	else {
		searchPath = "resources/fonts";
		searchPath += channel?channel:".*" + "/[a-z0-9-_]+\\.(ttf|otf)$";
	}

	var searchPathRegex = new RegExp(searchPath, "i");

	if(verbose) console.log(
		colors.debug("Looking for fonts:\n\tRegexp: %s\n\t"),
		searchPathRegex
	);

	return Q.Promise(function(resolve, reject, notify) {

		fs.pathExists(projectRootPath)
		.then(exists => {
			if(exists){
				findFile(searchPathRegex, projectRootPath, (fontPaths) => {
					Font.setProjectPath(projectPath, true);
					resolve(fontPaths.map(fontPath => {
						return Font.fromPath(fontPath);
					}));
				})
			}
			else {
				reject(new Error("Project path does not exist."));
			}
		})
		.catch(error => {
			reject(error);
		});
	});
}

module.exports = findFontFiles;
