// index.js

/*
Initialize Command :
node index.js test/data2.csv test/processArr.js test/out.csv
*/

var path = require('path'),
	fs = require('fs'),
	async = require('async'),
	Converter = require('csvtojson').Converter,
	csv2json = new Converter({
		delimiter : ',',
		noheader : false
	}),
	json2csv = require('json2csv');

GLOBAL.async = async;
GLOBAL.lib = {
	//excel : require(path.resolve('loader.js'))('lib/formula.js/lib/*.js'),
	utils : require(path.resolve('loader.js'))('lib/utils/*.js')
};

function parseInputParameters (argv) {
	var inputObj = {};

	inputObj.csvFilePath = argv[2];
	inputObj.procFilePath = argv[3];
	inputObj.destFilePath = argv[4];

	return inputObj;
}

function runProcessStep (initiatorObj, csvJsonObj, callback) {
	var boundFnsArr = [];

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

// validate input params
var inputObj = parseInputParameters(process.argv);

// load csv file
var csvString = fs.readFileSync(inputObj.csvFilePath, 'utf8');
console.log('raw lines :', csvString.match(/\n/g).length);

// load procFilePath
var processArr = require(path.join(__dirname, inputObj.procFilePath));

// convert csvString to JSON object
csv2json.fromString(csvString, function (err, csvObjectArray) {
	if(err){
		console.error('failed to parse csv', err);
		return;
	}
	console.log('parsed ',csvObjectArray.length, ' csv lines');
	// iterate processArr
		// execute runProcessStep
	iterateProcessSteps(csvObjectArray, processArr, function (err, result) {

		var allFields = result.reduce(function (prev, cur) {
			Object.keys(cur).forEach((a) => {prev[a] = true;});
			return prev;
		}, {});

		var json2csvOptions = {
			data : result,
			fields : Object.keys(allFields),
			del : ','
		};

		// convert csvJsonObj back to csvString
		json2csv(json2csvOptions, function (err, csvString) {
			if(err){
				console.error(err);
			} else {
				// write file to destFilePath
				fs.writeFileSync(inputObj.destFilePath, csvString);
				console.log('Successfully wrote to :', inputObj.destFilePath);
			}
		});
	});
});
