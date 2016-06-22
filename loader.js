
var _ = require('lodash'),
	glob = require('glob'),
	path = require('path');

var modulesCache = {};

module.exports = function () {
	var strArgs = JSON.stringify(arguments);
	if(modulesCache[strArgs]) {
		return modulesCache[strArgs];
	}

	var modulesObj = {};
	var files = glob.sync.apply(glob, arguments);

	files.reduce(function (prev, filename) {
		var moduleKey = path.basename(filename, path.extname(filename));
		prev[moduleKey] = require(path.resolve(filename));
		return prev;
	}, modulesObj);

	modulesCache[strArgs] = modulesObj;
	return modulesObj;
};
