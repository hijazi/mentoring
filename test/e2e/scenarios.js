'use strict';

// http://docs.angularjs.org/guide/dev_guide.e2e-testing 

describe('my app', function() {

	beforeEach(function() {
		browser.get('app/index.html');
	});

});

describe('PhonecatListCtrl', function() {
	it('should creat "phones" model with 3 phones', function() {
		var scope = {},
			ctrl = new PhonecatListCtrl(scope);
		expect(scope.mentors.length).toBe(2);
	});
});