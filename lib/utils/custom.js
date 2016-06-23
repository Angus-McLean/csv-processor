
var _ = require('lodash');

exports.onField = function (field, operation, destinationField, row, cb) {
	// default destinationField
	destinationField = destinationField || field;
	row[destinationField] = operation.call(null, row[field]);
	cb(null, row);
};

exports.onFields = function (fieldArr, operation, destinationFieldsArr, row, cb) {
	
};

exports.excludeFields = function (fieldsArr, operation, destinationFieldArr, row, cb) {
	
};