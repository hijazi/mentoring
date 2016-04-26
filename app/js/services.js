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

				// && text needed for strange behavior entring loop with empty string noticed with unit testing!
				while ((text.length > 0) && text){
						// throw away starting sapces
						while (text[0] === ' '){
							text = text.slice(1);						
						};
						// check if text has at least one word shorter than size to cut
						firstSpace = text.indexOf(' ');
						if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)) )) {
							// actual work
							doneText = $filter('characters')(text, size);
							truncatedLength = doneText.length;
							text = text.slice(truncatedLength);
							textArray.push(doneText)
						} else {
							text = '';
						};
					};
				};
				return textArray;
			}
		};
	}]);