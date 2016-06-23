
var _ = require('lodash');

function forceArray(unknown) {
	if(typeof unknown === 'string') {
		return [unknown];
	} else if(Array.isArray(unknown)) {
		return unknown;
	} else {
		return [];
	}
}

// reduces array field values for selected fields to just the unique values in that field
exports.uniquesFields = function (fields, row, options, cb) {
	fields = forceArray(fields);
	var resultingRow = _.reduce(row, function (obj, val, key) {
		obj[key] = (fields.indexOf(key)>-1) ? _.uniq(val) : val;
		return obj;
	}, {});
	cb(null, resultingRow);
};

// similar to uniquesFields but can exclude fields from reduction process. Defaults to reducing all fields to unique values.
exports.uniquesExclude = function (fields, row, options, cb) {
	fields = forceArray(fields);
	var resultingRow = _.reduce(row, function (obj, val, key) {
		obj[key] = (fields.indexOf(key)==-1) ? _.uniq(val) : val;
		return obj;
	}, {});
	cb(null, resultingRow);
};

exports.sumFields = function (fields, row, options, cb) {
	fields = forceArray(fields);
	var resultingRow = _.reduce(row, function (obj, val, key) {
		var forcedArr = forceArray(val);
		obj[key] = (fields.indexOf(key)>-1) ? forcedArr.reduce(function (prev, cur) {
			return prev += parseFloat(cur);
		}, 0) : val;
		return obj;
	}, {});
	cb(null, resultingRow);
};

exports.sumExclude = function (fields, row, options, cb) {
	fields = forceArray(fields);
	var resultingRow = _.reduce(row, function (obj, val, key) {
		obj[key] = (fields.indexOf(key)==-1) ? forceArray(val).reduce(function (prev, cur) {
			return prev += parseFloat(cur);
		}, 0) : val;
		return obj;
	}, {});
	cb(null, resultingRow);
};

