const vProjects = require('../rules/projects');

async function isVisProject(projectPath, verbose){
	return vProjects.isVisProject(projectPath, verbose);
}

module.exports = {
	isVisProject: isVisProject
	// Exporting an object instead of the fuction makes sure we have room in the
	// future for isFabricProject, isComponent, etc.
};
