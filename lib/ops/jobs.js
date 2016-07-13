
var path = require('path'),
	async = require('async');

function runProcessStep (initiatorObj, csvJsonObj, callback) {
	var boundFnsArr = [];
	console.log('Starting Step : ' + JSON.stringify(initiatorObj));
	if(initiatorObj.once) {
		initiatorObj.function.call(csvJsonObj, null, -1, csvJsonObj, callback);
		return;
	}

	var iteratorIndex;
	if(initiatorObj.parallel) {
		async.map(csvJsonObj, function (row, cb) {
			async.ensureAsync(initiatorObj.function).call(csvJsonObj, row, iteratorIndex, csvJsonObj, cb);
			iteratorIndex += 1;
		}, callback);
	} else {
		async.mapSeries(csvJsonObj, function (row, cb) {
			async.ensureAsync(initiatorObj.function).call(csvJsonObj, row, iteratorIndex, csvJsonObj, cb);
			iteratorIndex += 1;
		}, callback);
	}
}

function iterateProcessSteps(csvJsonObj, processArr, callback) {
	var boundProcessStepsArr = [function (cb) {
		// initialize the waterfall
		cb(null, csvJsonObj);
	}];

	processArr.forEach(function (initiatorObj) {
		var boundProcessStep = runProcessStep.bind(null, initiatorObj);
		boundProcessStepsArr.push(boundProcessStep);
	});

	async.waterfall(boundProcessStepsArr, callback);
}

// loads and triggers a subjob (list of operations)
// can pass array to iterate over, will default to array passed in to returned function
module.exports.executeSubJob = function executeJob(jobFilePath, arrToIterate) {
	var processArr = require(jobFilePath);

	return function (row, ind, arr, cb) {
		iterateProcessSteps(arrToIterate || arr, processArr, cb);
	};
};
