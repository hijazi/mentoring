'use strict';

/**
* mettoringServices Module
*
* Services for the mentoring app
*/
angular.module('mentoringServices', [])
.factory('textSplit',  function() {
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
			// variables declaration and initialization
			var text = enteredText
			,	doneText = ''
			,	firstSpace;

			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === 'string' || text instanceof String) ){			
					// throw away starting spaces
					text = text.replace(/^\s+/g,"");
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
			var result = 0
			,	regEx = /(&([^;]+);|\r?\n|\r)/ig
			,	regExTrim = /^\s+|\s+$/g;
			if ((typeof text === 'string' || text instanceof String) && (text.length > 0) ){
				//clean text
				text = text.replace(regEx, "");
				text = text.replace(regExTrim,"");
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

			while (((match = regEx.exec(text)) != null) && depth > 0 ){
				if (this.tagType(match[0]) === "open"){
					internalDepth++;
				} else{
					if (internalDepth === 0){
						requestedTags += match[0];
						depth--;
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
			debugger;
			if (text.length > size){



				while ((match = regEx.exec(text)) != null) {

					if (this.tagType(match[0]) === "open"){
						openDepth++;
						openTags.push(match[0]);
					} else if ((this.tagType(match[0]) === "close") && (openDepth > 0)){
						openDepth--;
						openTags.pop();
					}else{
						lastTagEnd = match.index + match[0].length;
						console.log("match:"+match[0]+"index:"+match.index);
						continue;
					}

					planeText = this.getPlane(text.slice(lastTagEnd,match.index));
					if (planeText.length < remainingSize){
						remainingSize -= planeText.length;	
					} else if (planeText.length > remainingSize){
						terminatingPlane = this.splitText(planeText, remainingSize);
						if ((terminatingPlane === "") && (openDepth > 0) && (this.tagType(match[0]) === "close") ){
							terminatingTags = this.getClosingTags(text.slice(match.index+match[0].length), openDepth-1);
							stillOpenedTags.pop();
						} else {
							terminatingTags = this.getClosingTags(text.slice(match.index), openDepth);
						}
						
						stillOpenedTags = openTags.join("");
						text = text.slice(0, lastTagEnd) + terminatingPlane;
						break;
					} else if (planeText.length === remainingSize){
						terminatingTags = this.getClosingTags(text.slice(match.index), openDepth);
						if ((openDepth > 0) && (this.tagType(match[0]) === "close")) {
							openTags.pop();
						}
						stillOpenedTags = openTags.join("");
						text = text.slice(0, lastTagEnd) + planeText;
					}
					lastTagEnd = match.index + match[0].length;
				}
			}
			var obj = {text: text,tagsToOpen: stillOpenedTags,tagsToClose:terminatingTags};
			return obj;	

		},
		getSplitData: function(enteredText, size) {

			// variables declaration and initialization
			var text = enteredText
			,	remainingSize = size
			,	doneText = ''
			,	truncatedLength = 0
			,	textArray = []
			,	truncatedLength
			,	firstSpace
			,	splitResult;

			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === 'string' || text instanceof String) ){
				// && text needed for strange behavior entering loop with empty string noticed with unit testing!
				while ((text.length > 0) && text){

					debugger;

					// remove starting spaces
					text = text.replace(/^\s+/g,"");

					if (text.indexOf("<") >= 0){

						
						// actual work
						splitResult = this.splitFormatted(text, size);
						doneText = splitResult.text;
						
						// add closing tags
						doneText += splitResult.tagsToClose;
						text = text.slice(truncatedLength);

						// get rid of unnecessary closing tag at the start
						if (splitResult.tagsToOpen === "" && splitResult.tagsToClose !== ""){
							text = text.slice(text.indexOf(">"));
						}
						if (text.length === splitResult.tagsToClose.length){
							// only closing tags remaining
							text = "";
						} else{
							//reformat
							text = splitResult.tagsToOpen + text;	
						}
					} else{

						// check if text has at least one word shorter than size to cut
						if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)) )) {
						// actual work
						splitResult = this.splitText(text, size);
						doneText = splitResult;
						truncatedLength = doneText.length;
						text = text.slice(truncatedLength);
						
					} else {
						text = '';

					}
				}
				textArray.push(doneText);
			}
		}
		console.log(textArray);
		return textArray;
	}
};
});




// get rid of text.slice(1)