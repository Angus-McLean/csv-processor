

module.exports = function (row, ind, arr, cb) {
	var groupName = '';

	var sortOrder = [
		{text: 'VAR',          abbreviation: 'VAR',    sortOrder: '1' },
		{text: 'ISV',          abbreviation: 'ISV',    sortOrder: '2' },
		{text: 'Agent',        abbreviation: 'AGE',    sortOrder: '3' },
		{text: 'Partner',      abbreviation: 'PAR',    sortOrder: '4' },
		{text: 'Affiliate',    abbreviation: 'AFF',    sortOrder: '5' },
		{text: 'Sub-Agent',    abbreviation: 'SUB',    sortOrder: '6' }
	];

	sortOrder.forEach(function (obj) {
		try{
			var indCurSortItem = row['Proposed Partner Type'].indexOf(obj.text);
		} catch (e) {
			//console.error('failed on group :',JSON.stringify(row), e);
			process.exit();
		}

		if(indCurSortItem > -1) {
			groupName += obj.abbreviation + '-' + (row['Proposed Partner Name'][indCurSortItem].replace(/ /g, '').slice(0, 10)) + '/';
			//console.log(row['Proposed Partner Name'][indCurSortItem]);
		}
	});

	// trim last '/'
	row['Proposed Group Name'] = groupName.slice(0, groupName.length-1);

	cb(null, row);
};
