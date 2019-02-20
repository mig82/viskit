function patchViewName(viewName){
	if(viewName && viewName.substr(-3) === '.sm'){
		return viewName.substr(0, viewName.length -3);
	}
	return viewName;
}

module.exports = patchViewName;
