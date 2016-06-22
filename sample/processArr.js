
var _ = require('lodash');

module.exports = [{
	once : true,
	function : function (row, ind, arr, cb) {
		console.log(arr.length);
		cb(null, arr);
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.group.pushUniques(['Group ID'], {}, arr, function (err, res) {
			cb(null, res);
		});
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		console.log(arr.length);
		cb(null, arr);
	}
}, {
	// build new partner names
	function : require('./renamePartners.js'),
	parallel : true
}, {
	// collapse array values to commas
	function : function (row, ind, arr, cb) {
		_.forEach(row, function (val, key) {
			row[key] = (Array.isArray(val)) ? val.join(',') : val;
		});
		cb(null, row);
	},
	parallel : true
}];
