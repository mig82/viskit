"use strict";

const fs = require('fs-extra');
const {buildSearchPath, find} = require("../helpers/ui-finder");
const isSearchAllOption = require("../helpers/is-search-all-option");
const stripPathEndSlash = require("../helpers/strip-path-end-slash");
const stripViewExtension = require("../helpers/strip-view-extension");
const Widget = require("../models/Widget");

/**
 * findViewDescendants - Finds all widgets which descend from a given view -meaning that they are either
 * children of the view's top container or children of its children in any level.
 *
 * @param  Object view        An object containing the metadata for finding a view in the project structure. The
 * function findViews returns an array of such objects.
 * @param  String projectPath The path to the Visualizer project's root directory.
 * @param  Boolean verbose     Whether to print debug statements or not.
 * @return Array             An array of all the widgets descending from the given view.
 */
async function findViewDescendants(view, projectPath, verbose){

	var descendants = [view];

	if(verbose)console.log("\nAdding descendants of %s".debug, view.file);

	for(var k = 0; k < descendants.length; k++){
		if(verbose)console.log("\tdescendants[%d]".debug, k);

		var widget = fs.readJsonSync(descendants[k].absPath);
		//console.log("\t\t%s".debug, widget.children);
		if(widget.children){
			Widget.setProjectPath(projectPath);
			//Let's add the children of this widget to the list we're iterating over.
			descendants = descendants.concat(widget.children.map(child => {
				var absPath;

				//TabPanes have a nested structure. The Tab is a child if the TabPane.
				if(Widget.isTabPane(widget)){
					absPath = view.absDir + "/__" + widget.id + "__/" + child + ".json";
				}
				else{
					absPath = view.absDir + "/" + child + ".json";
				}
				return new Widget(absPath);
			}));
		}
		if(verbose)console.log("\t\t%s".debug, JSON.stringify(descendants.map(desc=>{
			return desc.file
		})));
	}

	//TODO: Implement the loop above in async mode. The code below won't work because
	//descendants doesn't get updated in time for the loop to continue.
	/*for (const desc of descendants) {
		const widget = await fs.readJson(desc.absPath);
		if(widget.children){
			descendants = descendants.concat(widget.children.map(child => {
				var absPath = view.absDir + "/" + child + ".json";
				return new Widget(absPath);
			}));
		}
		if(verbose)logger.debug("\t\t%s", JSON.stringify(descendants.map(desc=>{
			return desc.file
		})));
	}*/

	return descendants;
}

module.exports = findViewDescendants;
