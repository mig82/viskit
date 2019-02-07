const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const Q = require('q');
Q.longStackSupport = true;

async function download(url, destinationDir, destinationPath){
	return Q.Promise(async function(resolve, reject, notify) {

		try {
			await fs.ensureDir(path.resolve(destinationDir));
			const file = fs.createWriteStream(path.resolve(destinationPath));
			const sendReq = request.get(url);

			// verify response code
			sendReq.on('response', (response) => {
				if (response.statusCode !== 200) {
					reject(new Error(`Response: ${response.statusCode}`));
				}
				else{
					sendReq.pipe(file);
					notify(file.bytesWritten);
				}
			});

			// close() is async, call cb after close completes
			file.on('finish', () => {
				file.close();
				resolve(file.bytesWritten);
			});

			// check for request errors
			sendReq.on('error', (err) => {
				fs.unlink(destinationPath);
				reject(err);
			});

			file.on('error', (err) => { // Handle errors
				fs.unlink(destinationPath); // Delete the file async without checking result.
				reject(err);
			});
		}
		catch (e) {
			reject(e);
		}
	});
};

module.exports = download;
