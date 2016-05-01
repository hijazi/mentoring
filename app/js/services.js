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
			// getThrownText: function(text, regEx, getIndices) {
			// 	var thrownText = ""
			// 	,	plainText = ""
			// 	,	planeLength = 0
			// 	,	match
			// 	,	matchIndices = [[],[]]
			// 	,	lastSplitEnd = 0;

			// 	if (getIndices){

			// 		while ((match = regEx.exec(text)) != null) {
			// 			thrownText += match[0];
			// 			matchIndices[0].push(match.index);
			// 			matchIndices[1].push(planeLength);
			// 			plainText += text.slice(lastSplitEnd,match.index);
			// 			planeLength = plainText.length;


			// 			lastSplitEnd = match.index + match[0].length;


			// 		}
			// 		// console.log("regEx:"+regEx+"\nmatchIndices[0]:"+matchIndices[0]);
			// 		// console.log("\n\n\n\n\n\n\nmatchIndices[1]:"+matchIndices[1])
			// 	} else
			// 	{

			// 		while ((match = regEx.exec(text)) != null) {
			// 			thrownText += match[0];
			// 		}
			// 	}

			// 	return thrownText;
			// },
			// helperStripHtml: function(formatedText) {
			// 	var regExTag = /(<([^>]+)>)/ig
			// 	,   regExSpcae = /(&([^;]+);)/ig
			// 	,	regExNewLine = /\r?\n|\r/g
			// 	,	thrownText = ""
			// 	,   doneText;

			// 	thrownText += this.getThrownText(formatedText, regExTag, true);
			// 	doneText = formatedText.replace(regExTag, "");

			// 	thrownText += this.getThrownText(formatedText, regExNewLine, false);
			// 	doneText = doneText.replace(regExNewLine, "");

			// 	thrownText += this.getThrownText(formatedText, regExSpcae, false);
			// 	doneText = doneText.replace(regExSpcae, "");
			// 	var obj = {done: doneText,thrown: thrownText};
			// 	return  obj;
			// },

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
				// console.log("getPlane not text:"+text);
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
			,	planeLength = 0
			,	remainingSize = size
			,	planeText = ""
			,	lastTagEnd = 0
			,	terminatingPlane = ""
			,	terminatingTags = ""
			,	openDepth = 0
			,	requestedFormattedText = ""
			,	openTags = []
			,	stillOpenedTags
			,	truncatedLength;

			if (text.length > size){

				while ((match = regEx.exec(text)) != null) {

					planeText = this.getPlane(text.slice(lastTagEnd,match.index));
					// console.log("sent:"+text.slice(lastTagEnd,match.index)+";last:"+lastTagEnd+";match.index:"+match.index);
					// console.log(text.slice(lastTagEnd,match.index));
					// console.log(";last:"+lastTagEnd+";match.index:"+match.index+"\n\n\n\n\n\n\n\n\n");
					// console.log("plane:"+planeText);
					// console.log("remainingSize:"+remainingSize+";plane.length"+planeText.length);
					if (planeText.length < remainingSize){
						remainingSize -= planeText.length;	
					} else{
						terminatingPlane = this.splitText(planeText, remainingSize);
						// console.log("terminatingPlane:"+terminatingPlane+";its size:"+terminatingPlane.length+";remainingSize:"+remainingSize);
						terminatingTags = this.getClosingTags(text.slice(match.index), openDepth);
						// console.log(openTags+"depth:"+openDepth);
						stillOpenedTags = openTags.join("");
						// console.log("lastTagEnd"+lastTagEnd);



						// console.log("1"+ text.slice(0, lastTagEnd)+"\n\n\n\n");
						// console.log("2"+terminatingPlane+"\n\n\n\n");
						// console.log("3"+terminatingTags+"\n\n\n\n");
						// console.log("4"+stillOpenedTags);

						requestedFormattedText = text.slice(0, lastTagEnd) + terminatingPlane + terminatingTags;
						truncatedLength = requestedFormattedText.length - terminatingTags.length;
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
						// console.log("this.tagType");
					}
					lastTagEnd = match.index + match[0].length;
				}
				// console.log("my requestedFormattedText:"+requestedFormattedText);
				// console.log("my stillOpenedTags:"+ stillOpenedTags);
				var obj = {text: requestedFormattedText,tagsToOpen: stillOpenedTags, truncatedLength: truncatedLength};
				// console.log("myObj");
				// console.log(obj);
			} else {
				var obj = {text: text,tagsToOpen: ""};
			}
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
					while ((text.length >= size) && text){
						
						// check if text has at least one word shorter than size to cut
						firstSpace = text.indexOf(' ');
						if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)) )) {
							// actual work
							splitResult = this.splitFormatted(text, size);
							doneText = splitResult.text;
							truncatedLength = splitResult.truncatedLength;
							text = text.slice(truncatedLength);
							//reformat
							text = splitResult.tagsToOpen + text;

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



// handle text smaller than size