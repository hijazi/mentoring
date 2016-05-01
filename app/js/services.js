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
						doneText = $filter('characters')(text, size);
						truncatedLength = doneText.length;
					} else {
						doneText = '';
					};
				
			};
			return doneText;
		},
		getThrownText: function(text, regEx, getIndices) {
			var thrownText = ""
			,	plainText = ""
			,	planeLength = 0
			,	match
			,	matchIndices = [[],[]]
			,	lastSplitEnd = 0;

			if (getIndices){

				while ((match = regEx.exec(text)) != null) {
					thrownText += match[0];
					matchIndices[0].push(match.index);
					matchIndices[1].push(planeLength);
					plainText += text.slice(lastSplitEnd,match.index);
					planeLength = plainText.length;


					lastSplitEnd = match.index + match[0].length;


				}
				console.log("regEx:"+regEx+"\nmatchIndices[0]:"+matchIndices[0]);
				console.log("\n\n\n\n\n\n\nmatchIndices[1]:"+matchIndices[1])
			} else
			{

				while ((match = regEx.exec(text)) != null) {
					thrownText += match[0];
				}
			}
			
			return thrownText;
		},
		helperStripHtml: function(formatedText) {
			var regExTag = /(<([^>]+)>)/ig
			,   regExSpcae = /(&([^;]+);)/ig
			,	regExNewLine = /\r?\n|\r/g
			,	thrownText = ""
			,   doneText;

			thrownText += this.getThrownText(formatedText, regExTag, true);
			doneText = formatedText.replace(regExTag, "");

			thrownText += this.getThrownText(formatedText, regExNewLine, false);
			doneText = doneText.replace(regExNewLine, "");

			thrownText += this.getThrownText(formatedText, regExSpcae, false);
			doneText = doneText.replace(regExSpcae, "");
			var obj = {done: doneText,thrown: thrownText};
			return  obj;
		},

		// today
		getPlane: function(text) {
			var result = 0;
			if (text){
				//clean text
				var regEx = /(&([^;]+);|\r?\n|\r)/ig;
				text = text.replace(regEx, "");
				result = text.length;
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
			var regEx = /(<([^>]+)>)/ig
			,	internalDepth = 0
			,	requestedTags = "";
			while ((match = regEx.exec(text)) != null){
				if (tagType(match[0]) === "open"){
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

		// today
		getClosingTags: function(text){
			var regEx = /(<([^>]+)>)/ig
			,	internalDepth = 0
			,	requestedTags = "";
			while ((match = regEx.exec(text)) != null){
				if (tagType(match[0]) === "open"){
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
			var regEx = /(<([^>]+)>)/ig
			,	planeLength = 0
			,	remainingSize = size
			,	planeText = ""
			,	lastTagEnd = 0
			,	terminatingPlane = ""
			,	terminatingTags = ""
			,	openDepth = 0
			,	requestedFormattedText = ""
			,	openTags = [];

			while ((match = regEx.exec(text)) != null) {

				// dangerous
				if (tagType(match[0]) === "open"){
					openDepth++;
					openTags.push(match[0]);
				} else if (tagType(match[0]) === "close"){
					openDepth--;
					openTags.pop();
				} else {
					// should'nt get here
					console.log("tagType");
				}
				planeText = getPlane(text.split(lastTagEnd,match.index));
				if (planeText.length < remainingSize){
					remainingSize -= planeText.length;	
				} else{
					terminatingPlane = this.splitText(planeText, remainingSize);
					terminatingTags = getClosingTags(text.split(match.index), openDepth);
					stillOpenedTags = openTags.join("");
					requestedFormattedText = text.split(0, lastTagEnd) + terminatingPlane + terminatingTags;

				}
				lastTagEnd = match.index + match[0].length;
			}
			var obj = {text: requestedFormattedText,tagsToOpen: stillOpenedTags};
			return obj;

		}
		
	};
}]);