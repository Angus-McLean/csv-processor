
var _ = require('lodash'),
	async = require('async'),
	fileLib = require('./files.js'),
	Promise = require('bluebird');

var group = require('./group.js');

function forceArray(unknown) {
	if(typeof unknown === 'string') {
		return [unknown];
	} else if(Array.isArray(unknown)) {
		return unknown;
	} else {
		return [];
	}
}

function extendObjectByMap(orig, fieldsMap, dest) {
	return _.reduce(fieldsMap, function (obj, v, key) {
		obj[v] = orig[key];
		return obj;
	}, dest);
}

function fetchFileIfIsPath(dataOrPath) {

}

// takes lookup map of form {mainArrayFieldToMatchFrom : externalFieldToMatchOn}
// takes value foundRowField and sets it to destinationRowField.. {foundRowField : destinationRowField}
function VLOOKUPONFIELDS(fieldsLookUpMap, fieldsValueCopyMap, dataToDoLookupOn) {

	return function (row, ind, arr, cb) {
		var criteriaObj = extendObjectByMap(row, fieldsLookUpMap, {});
		var foundRow = _.find(dataToDoLookupOn, criteriaObj);
		var resultantRow = extendObjectByMap(foundRow || {}, fieldsValueCopyMap, row);
		cb(null, resultantRow);
	};
}
exports.VLOOKUPONFIELDS = VLOOKUPONFIELDS;

exports.VLOOKUPONFIELDS_FILE = function (fieldsLookUpMap, fieldsValueCopyMap, filePathToDoLookupOn) {

	var returnedDataPromise = new Promise(function (res, rej) {
		require('./files.js').readFromCSV(filePathToDoLookupOn, function (err, csvData) {
			if(err) {
				console.error('Failed to Read File');
				console.error(err);
			} else {
				var builtFunction = VLOOKUPONFIELDS(fieldsLookUpMap, fieldsValueCopyMap, csvData);
				res(builtFunction);
			}
		});
	});

	return function (row, ind, arr, cb) {
		var args = arguments,
			cont = this;
		returnedDataPromise.then(function (functionToExecuteOnEachRow) {
			functionToExecuteOnEachRow.apply(cont, args);
		});
	};
};

exports.VFILTERONFIELDS = function VLOOKUPALLONFIELDS(fieldsLookUpMap, fieldsValueCopyMap, dataToDoLookupOn) {

	return function (row, ind, arr, cb) {
		var criteriaObj = extendObjectByMap(row, fieldsLookUpMap, {});
		var foundRows = _.filter(dataToDoLookupOn, criteriaObj);
		var groupedRow = group.pushAll(null, null, foundRows);
		var resultantRow = extendObjectByMap(foundRows, fieldsValueCopyMap, row);
		cb(null, resultantRow);
	};
};
