
var _ = require('lodash');

module.exports = [{
	once : true,
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.group.pushAll(['Group ID'], {}, arr, function (err, res) {
			cb(null, res);
		});
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		console.log('grouped', arr.length);
		cb(null, arr);
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.ungroup.byFieldsInLine(null, {}, arr, cb);
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.files.writeToCSV('intermediate.csv', arr, null, (a)=>{cb(a,arr)});
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		console.log('ungrouped', arr.length);
		cb(null, arr);
	}
}];
