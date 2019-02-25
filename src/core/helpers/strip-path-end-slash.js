
/**
 * stripPathEndSlash - description
 *
 * @param  {type} path description
 * @return {type}      description
 */
function stripPathEndSlash(path){

	if(path.substr(-1) === '/'){
		return path.slice(0, -1);
	}
	return path;
}

module.exports = stripPathEndSlash;
