'use strict';

/* jasmine specs for services go here */

describe('textSplit service', function (){
	var textSplitService, mockcharctersFilter;
	// var truncationData =
	// {
	// 	''
	// }

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
		console.log(text);
		if (size == 5){
			console.log('yah');
		}
		return '12345';
	};

    // it function

    var splitArray;
    it('Should return empty array without calling the filter', function() {
    	splitArray = textSplitService.getSplitData('OneWordLognerThanFive',5);
    	expect(splitArray).toEqual([]);
    });

});