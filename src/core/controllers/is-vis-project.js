const _isVisProject = require('../rules/is-vis-project');

async function isVisProject(projectPath, verbose){
	return _isVisProject(projectPath, verbose);
}

module.exports = isVisProject;
