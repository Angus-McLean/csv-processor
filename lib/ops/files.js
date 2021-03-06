
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	json2csv = require('json2csv'),
	Converter = require('csvtojson').Converter;

exports.isFilePath = function isCSVPath(pathStr) {
	var stat = fs.lstatSync(pathStr);
	return stat && stat.isFile();
};

exports.getFileExtension = function getFileExtension(pathStr) {
	try {
		return path.extname(pathStr);
	} catch (e) {
		console.error(e);
		return null;
	}
};

exports.writeToCSV = function (filePath, csvObjectArray, options, cb) {
	async.waterfall([
		exports.toCSVString.bind(null, csvObjectArray, options),
		exports.writeText.bind(null, filePath)
	], function (err, resp) {
		cb(err, csvObjectArray);
	});
};

exports.readFromCSV = function (filePath, cb) {
	async.waterfall([
		exports.readText.bind(null, filePath),
		exports.fromCSVString
	], cb);
};

exports.writeText = function (filePath, str, cb) {
	fs.writeFile(path.resolve(filePath), str, function (err, res) {
		if(!err) {
			cb(null, str);
		} else {
			console.error(err);
			process.exit();
		}
	});
};

exports.readText = function (filePath, cb) {
	fs.readFile(filePath, 'utf8', cb);
};

exports.fromCSVString = function (csvString, cb) {
	var csv2json = new Converter({
		delimiter : ',',
		noheader : false
	});
	csv2json.fromString(csvString, function (err, csvObjectArray) {
		if(err){
			console.error('failed to parse csv', err);
			cb(err, null);
		} else {
			cb(null, csvObjectArray);
		}
	});
};

exports.toCSVString = function (csvObjectArray, options, cb) {

	var allFields = csvObjectArray.reduce(function (prev, cur) {
		Object.keys(cur).forEach((a) => {prev[a] = true;});
		return prev;
	}, {});

	var json2csvOptions = options || {
		data : csvObjectArray,
		fields : Object.keys(allFields),
		del : ','
	};
	json2csv(json2csvOptions, function (err, csvString) {
		if(err){
			console.error(err);
			cb(err, null);
		} else {
			cb(null, csvString);
		}
	});
};

exports.toJSONString = function (csvObjectArray, options, cb) {
	options = options || {};
	cb(null, JSON.stringify(csvObjectArray, options.replacer, options.space));
};
