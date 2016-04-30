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

	// the mock returns entered text and you should act as the service's own logic
	mockcharctersFilter = function(text, size) {
		// one test case demands this which is right and separability tested behavior
		if ((text === "good experience") && size < text.length){
			text = "good";
		};
		return text;
	};

    // it function

    var splitArray;
    it('Should return empty array without calling the filter when text is one word and longer than size', function() {
    	splitArray = textSplitService.getSplitData('OneWordLognerThanFive',5);
    	expect(splitArray).toEqual([]);
    });
    it('Should return empty array when size is NaN', function () {
    	splitArray = textSplitService.getSplitData('what ever string', 'size not a number');
    	expect(splitArray).toEqual([]);
    });
    it('Should return empty array when size is negative or zero disregarding text; first case text with spaces', function () {
    	splitArray = textSplitService.getSplitData('what ever string', -1);
    	expect(splitArray).toEqual([]);
    });
    it('Should return empty array when size is negative or zero disregarding text; second case text without spaces', function () {
    	splitArray = textSplitService.getSplitData('whatEverString', -1);
    	expect(splitArray).toEqual([]);
    });
    it('Should return empty array when text is not a string disregarding the number', function () {
    	splitArray = textSplitService.getSplitData(50, 30);
    	expect(splitArray).toEqual([]);
    });

    it('Should return empty array when text is empty string', function () {
    	splitArray = textSplitService.getSplitData('', 40);
    	expect(splitArray).toEqual([]);
    });
    it('Should ignore the starting spaces', function () {
    	splitArray = textSplitService.getSplitData('   12345', 5);
    	expect(splitArray).toEqual(['12345']);
    });
    it('Should return one word if its size is same as size', function () {
    	splitArray = textSplitService.getSplitData('12345', 5);
    	expect(splitArray).toEqual(['12345']);
    });
    it('Should return one word if its size is smaller than size', function () {
    	splitArray = textSplitService.getSplitData('123', 5);
    	expect(splitArray).toEqual(['123']);
    });
    it('Should return first word if it is the only one shorter or equal the size', function () {
    	splitArray = textSplitService.getSplitData('good experience', 5);
    	expect(splitArray).toEqual(['good']);
    });
    it('Should not split single word', function () {
    	splitArray = textSplitService.getSplitData('good experience', 13);
    	expect(splitArray).toEqual(['good', 'experience']);
    });
});