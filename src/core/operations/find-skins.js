const path = require("path");
const findFile = require("find").file;
const fs = require("fs-extra");
const colors = require("colors");
const theme = require("../config/theme.js");
colors.setTheme(theme);
const Q = require("q");
Q.longStackSupport = true;

const stripPathEndSlash = require("../helpers/strip-path-end-slash");
const Skin = require("../models/Skin")

function findSkins(projectPath, themeName, verbose){
	var projectRootPath = stripPathEndSlash(projectPath);

	var searchPath = "themes/";
	searchPath += themeName?themeName:".*" + "/.*\\.json$";
	var searchPathRegex = new RegExp(searchPath);

	if(verbose) console.log(colors.debug("Looking for skins:\n\tRegexp: %s\n\tProject themes: %s"),
		searchPathRegex,
		projectRootPath
	);

	return Q.Promise(function(resolve, reject, notify) {

		fs.pathExists(projectRootPath)
		.then(exists => {
			if(exists){
				findFile(searchPathRegex, projectRootPath, (skinPaths) => {
					Skin.setProjectPath(projectPath, true);
					resolve(skinPaths.map(skinPath => {
						return Skin.fromPath(skinPath);
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

module.exports = findSkins;
