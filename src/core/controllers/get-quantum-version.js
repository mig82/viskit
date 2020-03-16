const getQuantumVersion = require('../operations/get-quantum-version');

async function getQuantumV(projectPath, verbose){
	return await getQuantumVersion(projectPath, verbose);
}

module.exports = getQuantumV;
