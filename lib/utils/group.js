// group.js

var _ = require('lodash');

// returns array of arrays, where each top level element is the grouped rows
function groupRowsByFunction (groupingFn, objectArray) {
	var groups = {};
	objectArray.forEach(function(row){
		var group = JSON.stringify(groupingFn(row));
		groups[group] = groups[group] || [];
		groups[group].push(row);
	});
	return Object.keys(groups).map(function(group) {
		return groups[group];
	});
}

function groupRowsByFields(arrOfFields, objectArray) {
	arrOfFields = (_.isArray(arrOfFields)) ? arrOfFields : [arrOfFields];
	return groupRowsByFunction(function (row) {
		return arrOfFields.reduce(function (prev, field) {
			prev[field] = row[field];
			return prev;
		}, {});
	}, objectArray);
}

// returns array of arrays
function callFieldOrFunctionGrouper (groupByFieldsOrFunction, objectArray) {
	if(typeof groupByFieldsOrFunction === 'function') {
		return groupRowsByFunction(groupByFieldsOrFunction, objectArray);
	} else {
		return groupRowsByFields(groupByFieldsOrFunction, objectArray);
	}
}

// assumes initialization element is empty object
function reduceAllGroups(reducingFn, allGroups) {
	var reducedGroupRows = [];
	allGroups.forEach(function (groupedRows) {
		reducedGroupRows.push(groupedRows.reduce(reducingFn, {}));
	});
	return reducedGroupRows;
}

function custom (groupByFieldsOrFunction, options, objectArray, callback) {

}
module.exports.custom = custom;

function sumNumeric (groupByFieldsOrFunction, options, objectArray, callback) {

}
module.exports.sumNumeric = sumNumeric;

function pushUniques (groupByFieldsOrFunction, options, objectArray, callback) {
	pushAll(groupByFieldsOrFunction, options, objectArray, function (err, res) {
		var uniques = res.map(function (rowObj) {
			return _.reduce(rowObj, function (obj, val, key) {
				obj[key] = _.uniq(val);
				return obj;
			}, {});
		});
		callback(null, uniques);
	});
}
module.exports.pushUniques = pushUniques;

function pushAll (groupByFieldsOrFunction, options, objectArray, callback) {
	var allGroups = callFieldOrFunctionGrouper(groupByFieldsOrFunction, objectArray);
	var processedGroups = reduceAllGroups(function (sumRowObj, curRow, ind, groupRows) {
		//console.log('reducing index : ', ind);
		// map all elements of the current row object
		_.forEach(curRow, function (val, key, row) {
			sumRowObj[key] = sumRowObj[key] || [];
			sumRowObj[key].push(val);
		});
		return sumRowObj;
	}, allGroups);
	callback(null, processedGroups);
}
module.exports.pushAll = pushAll;
