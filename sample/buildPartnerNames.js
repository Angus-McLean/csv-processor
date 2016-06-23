
var _ = require('lodash');

module.exports = [{
	once : true,
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.group.pushAll(['Group ID'], {}, arr, function (err, res) {
			cb(null, res);
		});
	}
}, {
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.reduce.uniquesFields([], row, {}, cb);
	}
}, {
	// build new partner names
	function : require('./renamePartners.js'),
	parallel : true
}, {
	// collapse partnerGroupNames values
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.custom.onField('Proposed Group Name', function (proposedGroupNameFieldValue) {
			if(Array.isArray(proposedGroupNameFieldValue)) {
				return proposedGroupNameFieldValue.join(',');
			} else {
				return proposedGroupNameFieldValue;
			}
		}, null, row, cb);
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		GLOBAL.lib.utils.files.writeToCSV('./data/partnerGroupNames.csv', arr, null, function (err){
			cb(err,arr);
		});
	}
}, {
	once : true,
	function : function (row, ind, arr, cb) {
		// blow up fields, and stretch partnerGroupNames across blownup rows
		GLOBAL.lib.utils.ungroup.byFieldsInLine(['DescriptionLabel - Referral source', 'Group ID', 'Proposed Partner Name', 'Proposed Partner Type', 'ProfitSplit - Top label - Q'], null, arr, cb);
		//GLOBAL.lib.utils.ungroup.byFieldsInLine(true, null, arr, cb);
	}
}, {
	// join fieldValues
	function : function (row, ind, arr, cb) {
		_.map(row, function (val, key) {
			row[key] = (Array.isArray(val)) ? val.join(',') : val;
		});
		cb(null, row);
	}
}];
