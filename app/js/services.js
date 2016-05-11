"use strict";

/**
 * mettoringServices Module
 *
 * Services for the mentoring app
 */
 angular.module("mentoringServices", [])
 .factory("textSplitter", function() {
 	return {
 		charactersTruncate: function(text, size) {
 			if (size === undefined) return text;
 			if (isNaN(size)) return "";
 			if (size <= 0) return "";
 			if (typeof text === "string" || text instanceof String) {
 				var firstSpace;
				// check if text has at least one word shorter than size to cut
				firstSpace = text.indexOf(' ');
				if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)))) {
					if (text.length === size){
						return text;
					}
					var lastspace = text.lastIndexOf(' ');
					// actual work
					text = text.slice(0, size);
					//get last space
					if (lastspace !== -1) {
						text = text.slice(0, lastspace);
					}
				} else {
					text = "";
				};
				return text;
			} else {
				return "";
			}
			return text;
		},
		// function to fix text spacing
		fixTextFormatting: function(text) {
			var regExTrim = /^\s+|\s+$/,
			regExDoublePlusSpaces = /\s+/g,
			regExSpecialChars = /\s*((&([^;]+);|\r?\n|\r))\s*/g,
			regExTagNoSpace = /\s*(<([^>]+)>)\s*/g,
			regExTag = /(<([^>]+)>)/g;

			text = text.replace(regExTagNoSpace, " $1 ");
			text = text.replace(regExSpecialChars, " $1 ");
			text = text.replace(regExDoublePlusSpaces, " ");
			text = text.replace(regExTrim, "");

			return text;
		},
		getPlainText: function(text) {
			var result, length = 0,
			regExSpecialChars = /(&([^;]+);|\r?\n|\r)/g,
			regExspaces = /\s+/g,
			regExTrim = /^\s+|\s+$/g;
			if ((typeof text === "string" || text instanceof String) && (text.length > 0)) {
				//clean text
				text = text.replace(regExspaces, " ");
				// text = text.replace(regExTrim, "");
				text = text.replace(regExSpecialChars, " ");
			}
			result =text;
			return result;
		},
		tagType: function(tag) {
			if (tag.indexOf("</") === 0) {
				return "close";
			} else if (tag.indexOf("/>") === tag.length - 2) {
				return "unpaired"
			}
			return "open";
		},
		getClosingTags: function(text, depth) {
			var match,
			regExTag = /(<([^>]+)>)/g,
			internalDepth = 0,
			requestedTags = "";

			while (((match = regExTag.exec(text)) != null) && depth > 0) {
				if (this.tagType(match[0]) === "open") {
					internalDepth++;
				} else {
					if (internalDepth === 0) {
						requestedTags += match[0];
						depth--;
					} else {
						internalDepth--;
					}
				}
			}
			return requestedTags;
		},
		smartSlice: function(text, size, workBoundry , textArray) {
			// implement according to tests
			var regEx = /(&([^;]+);|\r?\n|\r)/ig,
			plainText,
			remainingSize = size,
			plainLength = 0,
			lastMatchEnd = 0,
			textInside = "",
			terminatingplain,plainText,match,result;


			while (((match = regEx.exec(text)) !== null) && (match.index < workBoundry)) {
				textInside = text.slice(lastMatchEnd, match.index);
				plainText = this.getPlainText(textInside);
				
				plainLength = plainText.length;
				if (plainLength < remainingSize) {
					remainingSize -= plainLength;
				} else if (plainLength > remainingSize) {
					debugger;
					terminatingplain = this.charactersTruncate(plainText, remainingSize);
					var textToPush, reaminingLength, pivot;
					if (textInside === plainText){
						lastMatchEnd = regEx.lastIndex;
						textToPush = text.slice(0, lastMatchEnd);
						pivot = lastMatchEnd;
					} else{
						textToPush = text.slice(0, lastMatchEnd) + terminatingplain;
						pivot = lastMatchEnd + terminatingplain.length;
					}
					remainingSize = 0;
					textArray.push(textToPush);
					text = text.slice(pivot);
					return text;
				} else {
					// pivot includes the match
					remainingSize = 0;
					pivot = regEx.lastIndex;
					textArray.push(text.slice(0, pivot));
					text = text.slice(pivot);
					return text;
				}

				lastMatchEnd = regEx.lastIndex;
			}
			// no more matches and still remainingSize so get terminating plane
			var textPost = text.slice(lastMatchEnd, workBoundry);
			plainText = this.getPlainText(textPost);
			terminatingplain = this.charactersTruncate(plainText, remainingSize);
			console.log("term:"+terminatingplain);
			// pluls one is for the space truncated
			var pivot = lastMatchEnd + terminatingplain.length;
			textArray.push(text.slice(0,pivot));
			text = text.slice(pivot);
			console.log("text"+text);
			return text;
		},
		handleTextBefore: function(text, size, textArray) {

			var tagIndex
			,	textNoTag
			,	plainNoTag
			,	plainNoTagHandeled = []
			,	regExTag = /(<([^>]+)>)/
			,	regExMatch;


			
			
			
			do {
				// get Index of first tag
				regExMatch = regExTag.exec(text);
				if (regExMatch !== null) {
					// there's text before tag
					tagIndex = regExMatch.index;
				} else {
					// no Tag found
					tagIndex = -1;
				}

				// get text before tag if there was any
				textNoTag = (tagIndex >= 0 ? text.slice(0, tagIndex) : text);				
				
				// get plain text to test length
				plainNoTag = this.getPlainText(textNoTag);
				if (plainNoTag.indexOf(" ") > size){
					break;
				}

				// if its length is greater than size
				if (plainNoTag.length >= size) {
					// handle it and fill passed array
					text = this.smartSlice(text, size, textNoTag.length, textArray);
				}
			} while (plainNoTag.length >= size); // gets out when no text to fill the array
			
			return text;
		},
		// this is handle middle work
		handleTextMiddle: function(text, size, textArray) {

			var match, regExTag = /(<([^>]+)>)/ig,
			remainingSize = size,
			plainText = "",
			lastTagEnd = 0,
			terminatingplain = "",
			terminatingTags = "",
			openDepth = 0,
			openTags = [],
			tagsToOpen = "",
			tagsToClose,
			truncatedLength = 0,
			textToPush, pivot, initialTextToPush, initialText, remainingText;


			// plainContent = text.replace(plainRegEx,"");
			debugger;

			while (((match = regExTag.exec(text)) != null)) {

				var textNoTag = text.slice(lastTagEnd, match.index);
				// getting plain text between tags, lastTagEnd is zero in first iteration
				plainText = this.getPlainText(textNoTag);

				// reamining size starts seem as entered size
				if (plainText.length < remainingSize) {
					remainingSize -= plainText.length;
				} else if (plainText.length >= remainingSize) {
					// handle this
					if (plainText.length === remainingSize){
						// append tag in slicing and pop it
						pivot = lastTagEnd;
						openDepth--;
						openTags.pop();
					} else{
						remainingText =  this.smartSlice(textNoTag, remainingSize);
						pivot = lastTagEnd + remainingText.length;
					}					
					initialTextToPush = text.slice(0, pivot);
					initialText = text.slice(pivot);
					tagsToClose = this.getClosingTags(initialText, openDepth);
					textToPush = initialTextToPush + tagsToClose;
					textArray.push(textToPush);
					tagsToOpen = openTags.join("");
					text = tagsToOpen + initialText;
					text = this.fixTextFormatting(text);
					remainingSize = 0;
					this.handleTextMiddle(text, size, textArray);
				}
				// tag type handling
				if (this.tagType(match[0]) === "open") {
					openDepth++;
					openTags.push(match[0]);
				} else if ((this.tagType(match[0]) === "close") && (openDepth > 0)) {
					openDepth--;
					openTags.pop();
				} else {
					debugger;
					// lastTagEnd = regExTag.lastIndex;
					console.log("match:" + match[0] + "index:" + match.index);
				}
				lastTagEnd = regExTag.lastIndex;
			}

			return text;
		},
		handleTextAfter: function(text, size, textArray) {

			var regExTag = /(<([^>]+)>)/ig,
			lastTagEnd = 0,
			match;
			while (((match = regExTag.exec(text)) != null)) {
				lastTagEnd = regExTag.lastIndex;
			}
			if (lastTagEnd !== 0){
				var plainText = this.getPlainText(text.slice(0, lastTagEnd).replace(regExTag,""));
				remainingSize
			}
		},
		getSplitData: function(enteredText, size) {

			// variables declaration and initialization
			var textArray = [];

			// well format
			text = this.fixTextFormatting(text);
			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === "string" || text instanceof String)) {

				text = this.handleTextBefore(text, size, textArray);

				text = this.handleTextMiddle(text, size, textArray);

				text = this.handleTextAfter(text, size, textArray);

				// debug
				console.log("work should be done;text:" + text);
			}
			console.log(textArray);
			return textArray;
		}

	}
});