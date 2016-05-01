'use strict';

/**
* mettoringServices Module
*
* Services for the mentoring app
*/
angular.module('mentoringServices', ['truncate'])
.factory('textSplit', ['$filter', function($filter) {
	return {
		// today
		charactersTruncate: function (text, size) {
			if (isNaN(size)) return text;
			if (size <= 0) return '';
			if (text && text.length >= size) {
				text = text.substring(0, size);
				var lastspace = text.lastIndexOf(' ');
            	//get last space
            	if (lastspace !== -1) {
            		text = text.substr(0, lastspace);
            	}
            	return text ;
            }
            return text;
        },
		// today to test
		splitText: function(enteredText, size){
			// variables declaration and intialization
			var text = enteredText
			,	doneText = ''
			,	firstSpace;

			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === 'string' || text instanceof String) ){			
					// throw away starting sapces
					while (text[0] === ' '){
						text = text.slice(1);						
					};
					// check if text has at least one word shorter than size to cut
					firstSpace = text.indexOf(' ');
					if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)) )) {
						// actual work
						doneText = this.charactersTruncate(text, size);
					} else {
						doneText = '';
					};

				};
				return doneText;
			},
		// today
		getPlane: function(text) {
			var result = 0;
			if ((typeof text === 'string' || text instanceof String) && (text.length > 0) ){
				//clean text
				var regEx = /(&([^;]+);|\r?\n|\r)/ig;
				text = text.replace(regEx, "");
				result = text;
			} else {
				result = "";
			}
			return result;
		},

		// today
		tagType: function(tag) {
			if (tag.indexOf("/") > 0){
				return "close";
			}
			return "open";
		},

		// today
		getClosingTags: function(text, depth) {
			var match,
			regEx = /(<([^>]+)>)/ig
			,	internalDepth = 0
			,	requestedTags = "";
			while ((match = regEx.exec(text)) != null){
				if (this.tagType(match[0]) === "open"){
					internalDepth++;
				} else{
					if (internalDepth === 0){
						requestedTags += match[0];
					} else{
						internalDepth--;
					}
				}
			}
			return requestedTags;
		},

		// today to test
		splitFormatted: function(text, size) {
			var match
			,	regEx = /(<([^>]+)>)/ig
			,	planeRegEx = /(&([^;]+);|\r?\n|\r)|(<([^>]+)>)/ig
			,	planeContent
			,	planeLength = 0
			,	remainingSize = size
			,	planeText = ""
			,	lastTagEnd = 0
			,	terminatingPlane = ""
			,	terminatingTags = ""
			,	openDepth = 0
			,	openTags = []
			,	stillOpenedTags = ""
			,	truncatedLength = 0;

			// planeContent = text.replace(planeRegEx,"");

			if (text.length > size){

				while ((match = regEx.exec(text)) != null) {

					planeText = this.getPlane(text.slice(lastTagEnd,match.index));
					if (planeText.length < remainingSize){
						remainingSize -= planeText.length;	
					} else{
						terminatingPlane = this.splitText(planeText, remainingSize);
						terminatingTags = this.getClosingTags(text.slice(match.index), openDepth);
						stillOpenedTags = openTags.join("");
						text = text.slice(0, lastTagEnd) + terminatingPlane;
						break;
					}
					// dangerous
					if (this.tagType(match[0]) === "open"){
						openDepth++;
						openTags.push(match[0]);
					} else if (this.tagType(match[0]) === "close"){
						openDepth--;
						openTags.pop();
					} else {
						// should'nt get here
					}
					lastTagEnd = match.index + match[0].length;
				}
				truncatedLength = text.length - terminatingTags.length;
			}
			var obj = {text: text,tagsToOpen: stillOpenedTags,tagsToClose:terminatingTags , truncatedLength: truncatedLength};
			return obj;	

		},
		getSplitData: function(enteredText, size) {

			// variables declaration and intialization
			var text = enteredText
			,	doneText = ''
			,	truncatedLength = 0
			,	textArray = []
			,	truncatedLength
			,	firstSpace
			,	splitResult;

			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === 'string' || text instanceof String) ){
				// && text needed for strange behavior entring loop with empty string noticed with unit testing!
				if (text.indexOf("<") >= 0){
					while ((text.length > 0) && text){
						
						// check if text has at least one word shorter than size to cut
						firstSpace = text.indexOf(' ');
						if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)) )) {
							// actual work
							splitResult = this.splitFormatted(text, size);
							doneText = splitResult.text;
							truncatedLength = doneText.length;
							// add closing tags
							doneText += splitResult.tagsToClose;
							text = text.slice(truncatedLength);
							if (text.length === splitResult.tagsToClose.length){
								// only closing tags remaining
								text = "";
							} else{
								//reformat
								text = splitResult.tagsToOpen + text;	
							}
							textArray.push(doneText);
						} else {
							text = '';
						}
					}
				} else{
					while ((text.length >= 0) && text){

					// check if text has at least one word shorter than size to cut
					firstSpace = text.indexOf(' ');
					if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)) )) {
						// actual work
						splitResult = this.splitText(text, size);
						doneText = splitResult;
						truncatedLength = doneText.length;
						text = text.slice(truncatedLength);
						textArray.push(doneText);
					} else {
						text = '';
					}
				}
			}
		}
		console.log(textArray);
		return textArray;
	}
};
}]);