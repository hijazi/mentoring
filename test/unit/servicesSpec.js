'use strict';

/* jasmine specs for services go here */

describe('textSplit service', function (){
	var textSplitService, mockcharctersFilter;

	beforeEach(function(){
		module('mentoringServices');
		module(function($provide) {
			$provide.value('charactersFilter', mockcharctersFilter);
		});
		inject(function($injector){
			textSplitService = $injector.get('textSplit');
		});

	});

	mockcharctersFilter = function(text, size) {
		return '12345';
	};

    // it function

    var text;
    it('Should split data and return text in an array of strings', function() {
    	text = textSplitService.getSplitData('12345 12345',5);
    	expect(text).toEqual(['12345', '12345']);
    })
});