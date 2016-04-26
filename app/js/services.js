'use strict';

/**
* mettoringServices Module
*
* Services for the mentoring app
*/
angular.module('mentoringServices', ['truncate'])
.factory('textSplit', ['$filter', function($filter) {
	return {
		getSplitData: function(enteredText, size) {

			// variables declaration and intialization
			var text = enteredText
			,	doneText = ''
			,	truncatedLength = 0
			,	textArray = []
			,	firstSpace;

			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === 'string' || text instanceof String) ){

					do {
						// throw away starting sapces
						while (text[0] === ' '){
							text = text.slice(1);						
						};
						// check if text has at least one word to cut
						firstSpace = text.indexOf(' ');
						if ((firstSpace <= size) && ((firstSpace !== -1) || (text.length <= size) )) {
							// actual work
							doneText = $filter('characters')(text, size);
							truncatedLength = doneText.length;
							text = text.slice(truncatedLength);
							textArray.push(doneText)
						} else {
							// one word beggir than size
							console.log("thrown away:"+text+";spaceIndex:"+firstSpace);
							text = '';
						};
				} while (text.length > 0);
			};
			return textArray;
		}
	};
}]);