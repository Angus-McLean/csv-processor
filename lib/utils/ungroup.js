
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

// Given a list of fields it will ungroup by iterating over all elements of the row[field] and creating a new row for each element.
// Basically will take the tranpose of fields provided to create new rows.
// Duplicates all other fields across each row.
exports.byFieldsInLine = function (fields, options, csvObjectArray, cb) {
	var expandedCsv = [];
	var fieldsArr = (fields && forceArray(fields)) || null;
	options = options || {};
	csvObjectArray.forEach(function (row, ind) {
		var blownUpRows = [];
		// default to all fields of row
		(fieldsArr || Object.keys(row)).forEach(function (rowField) {
			
			// create new row for each element in this field
			forceArray(row[rowField]).forEach(function (fieldElem, ind) {
				if(!blownUpRows[ind]) {
					blownUpRows.push({});
				}
				
				// iterate keys of row.. 
				_.forEach(row, function (elem, key) {
					if(fieldsArr.indexOf(key) > -1){
						blownUpRows[ind][key] = row[key][ind];
					} else {
						blownUpRows[ind][key] = row[key];
					}
				});
				
			});
		});
		//console.log(JSON.stringify(blownUpRows));
		expandedCsv = expandedCsv.concat(blownUpRows);
	});
	cb(null, expandedCsv);
};

exports.byExcludeFieldsInLine = function (fields, options, csvObjectArray, cb) {
	var expandedCsv = [];
	var fieldsArr = (fields && forceArray(fields)) || null;
	options = options || {};
	csvObjectArray.forEach(function (row, ind) {
		var blownUpRows = [];
		// default to all fields of row
		(fieldsArr || Object.keys(row)).forEach(function (rowField) {
			
			// create new row for each element in this field
			forceArray(row[rowField]).forEach(function (fieldElem, ind) {
				if(!blownUpRows[ind]) {
					blownUpRows.push({});
				}
				
				// iterate keys of row.. 
				_.forEach(row, function (elem, key) {
					if(fieldsArr.indexOf(key) > -1){
						blownUpRows[ind][key] = row[key][ind];
					} else {
						blownUpRows[ind][key] = row[key];
					}
				});
				
			});
		});
		//console.log(JSON.stringify(blownUpRows));
		expandedCsv = expandedCsv.concat(blownUpRows);
	});
	cb(null, expandedCsv);
};