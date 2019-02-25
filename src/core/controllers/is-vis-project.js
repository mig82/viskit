const isVisEnterpriseProject = require('../operations/is-vis-ent-project');

async function isVisEntProject(projectPath, verbose){
	return isVisEnterpriseProject(projectPath, verbose);
}

module.exports = isVisEntProject;
