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
			,	firstSpace
			,	lastOpen
			,	lastClose
			,	processText = enteredText;

			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === 'string' || text instanceof String) ){
				text = text.slice(0, size);
				// && text needed for strange behavior entring loop with empty string noticed with unit testing!
				while ((text.length > 0) && text){
					// throw away starting sapces
					while (text[0] === ' '){
						text = text.slice(1);						
					};
					// check if text has at least one word shorter than size to cut
					firstSpace = text.indexOf(' ');
					lastOpen = text.lastIndexOf("<");
					lastClose = text.lastIndexOf("/");
					if (lastClose < lastOpen){
						text = text.slice(0, lastOpen);
						text = text.slice(0, text.lastIndexOf(">")+1);
					}
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
		},
		helperStripHtml: function(formatedText) {
			var regExTag = /(<([^>]+)>)/ig
			,   regExSpcae = /(&([^;]+);)/ig
			,	regExNewLine = /\r?\n|\r/g
			,   doneText;


			doneText = formatedText.replace(regExTag, "");
			doneText = doneText.replace(regExNewLine, "");
			doneText = doneText.replace(regExSpcae, "");
			
			return doneText;
		}
	};
}]);