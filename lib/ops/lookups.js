
var _ = require('lodash'),
	async = require('async'),
	fileLib = require('./files.js');

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
exports.VLOOKUPONFIELDS = function VLOOKUPONFIELDS(fieldsLookUpMap, fieldsValueCopyMap, dataToDoLookupOn) {
	
	return function (row, ind, arr, cb) {
		var criteriaObj = extendObjectByMap(row, fieldsLookUpMap, {});
		var foundRow = _.find(dataToDoLookupOn, criteriaObj);
		var resultantRow = extendObjectByMap(foundRow, fieldsValueCopyMap, row);
		cb(null, resultantRow);
	};
};

exports.VLOOKUPALLONFIELDS = function VLOOKUPALLONFIELDS(fieldsLookUpMap, fieldsValueCopyMap, dataToDoLookupOn) {
	
	return function (row, ind, arr, cb) {
		var criteriaObj = extendObjectByMap(row, fieldsLookUpMap, {});
		var foundRows = _.filter(dataToDoLookupOn, criteriaObj);
		var groupedRow = group.pushAll(null, null, foundRows);
		var resultantRow = extendObjectByMap(foundRows, fieldsValueCopyMap, row);
		cb(null, resultantRow);
	};
};