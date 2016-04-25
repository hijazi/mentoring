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
			var text = enteredText || 'No text abailable!';
			var doneText = '';
			var truncatedLength = 0;
			var textArray = [];

			

			if ( (!(NaN === size)) && text){
				var i=0;
				while (text.length > 0){
					if (text[0] === ' '){
						text = text.slice(1);						
					};

					doneText = $filter('characters')(text, size);
					truncatedLength = doneText.length;
					text = text.slice(truncatedLength);
					textArray.push(doneText)
				}


			}

			return textArray;
		}


	}
}]);