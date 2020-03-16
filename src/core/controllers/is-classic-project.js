const isVisEnterpriseProject = require('../operations/is-vis-ent-project');

async function isVisProject(projectPath, verbose){
	return  isVisEnterpriseProject(projectPath, verbose);
}

module.exports = isVisProject;
