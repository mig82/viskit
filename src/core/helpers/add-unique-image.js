"use strict";

const findIndex = require('lodash.findindex');

/**
 * addUnique - Adds an image to an array of images unless it's already there.
 *
 * @param  Array images   description
 * @param  Image newImage description
 * @return void          Updates thearray in place.
 */
function addUnique(images, newImage){

	//Never add falsy elements.
	if(newImage){

		//Determine whether this image is already in the array.
		var index = findIndex(images, image => {
			return image.matches(newImage);
		})

		//If this image is not already in the array, then add it.
		if(index < 0) {
			//console.log("Adding %o to %o".debug, newImage, images)
			images.push(newImage);
		}
	}
}

module.exports = addUnique;
