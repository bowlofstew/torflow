var dir = require('node-dir');
var connectionPool = require('../db/connection');
var ingestFile = require('./ingestFile');
var process = require('../util/process_each');

/**
 * Ingest a list of csv files from the path specified
 * @param resolvedPath - the resolved file path of the directory containing the csv files to ingest
 * @param onSuccess - success callback
 * @param onError - error callback
 */
var ingestFiles = function(resolvedPath,onSuccess,onError) {
	var connection = null;

	var error = function(err) {
		connectionPool.close(connection);
		console.error(err);
		if (onError) {
			onError(err);
		} else {
			console.error(err);
		}
		process.exit(1);
	};

	var complete = function(skipped,total) {
		connectionPool.close(connection);
		if (onSuccess) {
			onSuccess();
		}
	};

	// Open a single connection for all files to ingest
	connectionPool.open(function(conn) {

		connection = conn;

		// Get a list of files in the containing directory.   Does not include sub dirs.
		dir.files(resolvedPath, function (err, files) {
			if (err) {
				throw err;
			} else {
				// Ingest each file
				process.each(files,function(csvPath, processNext) {
					// Skip files not ending with .csv
					if (csvPath.indexOf('.csv') !== csvPath.length - 4) {
						processNext();
						return;
					}

					var onFileSuccess = function(numImported,numSkipped) {
						var logStr = 'Imported ' + csvPath;
						if (numSkipped > 0) {
							logStr += ' (' + numSkipped + ' of ' + numImported+numSkipped + ' skipped due to malformed data)';
						}
						console.log(logStr);
						processNext();
					};

					var onFileError = function(err) {
						error(err);
						processNext();
					};

					ingestFile(conn, csvPath,onFileSuccess,onFileError);
				}, complete);
			}
		});
	});
};

module.exports = ingestFiles;