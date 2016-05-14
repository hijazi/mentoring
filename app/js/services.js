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
					// actual work
 					text = text.slice(0, size);
					//get last space
 					var lastspace = text.lastIndexOf(' ');
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
 			regExTag = /(<([^>]+)>)/g,
 			regExTrim = /^\s+|\s+$/g;

 			if ((typeof text === "string" || text instanceof String) && (text.length > 0)) {
				//clean text
 				text = text.replace(regExspaces, " ");
				// text = text.replace(regExTrim, "");
 				text = text.replace(regExSpecialChars, " "),
 				text = text.replace(regExTag, "");
 			}
 			result =text;
 			return result;
 		},
 		tagType: function(tag) {
 			if (tag.indexOf("</") === 0) {
 				return "close";
 			} else if (tag.indexOf("/>") === tag.length - 2) {
 				return "unpaired"
 			} else if (tag.indexOf("<") === 0){
 				return "open";
 			}
 			return "Not Tag";
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
 		// smartSlice: function(text, size, workBoundry , textArray) {
			// // implement according to tests
 		// 	var regEx = /(&([^;]+);|\r?\n|\r)/ig,
 		// 	plainText,
 		// 	remainingSize = size,
 		// 	plainLength = 0,
 		// 	lastMatchEnd = 0,
 		// 	textInside = "",
 		// 	terminatingplain,plainText,match,result;


 		// 	while (((match = regEx.exec(text)) !== null) && (match.index < workBoundry)) {
 		// 		textInside = text.slice(lastMatchEnd, match.index);
 		// 		plainText = this.getPlainText(textInside);

 		// 		plainLength = plainText.length;
 		// 		if (plainLength < remainingSize) {
 		// 			remainingSize -= plainLength;
 		// 		} else if (plainLength > remainingSize) {
 		// 			terminatingplain = this.charactersTruncate(plainText, remainingSize);
 		// 			var textToPush, reaminingLength, pivot;
 		// 			if (textInside === plainText){
 		// 				lastMatchEnd = regEx.lastIndex;
 		// 				textToPush = text.slice(0, lastMatchEnd);
 		// 				pivot = lastMatchEnd;
 		// 			} else{
 		// 				textToPush = text.slice(0, lastMatchEnd) + terminatingplain;
 		// 				pivot = lastMatchEnd + terminatingplain.length;
 		// 			}
 		// 			remainingSize = 0;
 		// 			var plainPushed = this.getPlainText(textToPush);
			// 		console.log("\n\n\n\n\n\n\nplain pushed.length:"+ plainPushed.length);
			// 		console.log("++++++++++++++++++++++++++++++++++++plainPushed:"+plainPushed);
 		// 			textArray.push(textToPush);
 		// 			text = text.slice(pivot);
 		// 			return text;
 		// 		} else {
			// 		// pivot includes the match
 		// 			remainingSize = 0;
 		// 			pivot = regEx.lastIndex;
 		// 			var plainPushed = this.getPlainText(textToPush);
			// 		console.log("\n\n\n\n\n\n\nplain pushed.length:"+ plainPushed.length);
			// 		console.log("++++++++++++++++++++++++++++++++++++plainPushed:"+plainPushed);
 		// 			textArray.push(text.slice(0, pivot));
 		// 			text = text.slice(pivot);
 		// 			return text;
 		// 		}

 		// 		lastMatchEnd = regEx.lastIndex;
 		// 	}
			// // no more matches and still remainingSize so get terminating plane
 		// 	var textPost = text.slice(lastMatchEnd, workBoundry);
 		// 	plainText = this.getPlainText(textPost);
 		// 	terminatingplain = this.charactersTruncate(plainText, remainingSize);
			// // pluls one is for the space truncated
 		// 	var pivot = lastMatchEnd + terminatingplain.length;
 		// 	var textPost = text.slice(0,pivot);
 		// 	var plainPushed = this.getPlainText(textToPush);
			// 		console.log("\n\n\n\n\n\n\nplain pushed.length:"+ plainPushed.length);
			// 		console.log("++++++++++++++++++++++++++++++++++++plainPushed:"+plainPushed);
 		// 	textArray.push(textToPush);
 		// 	text = text.slice(pivot);
 		// 	return text;
 		// },
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
					// lastTagEnd = regExTag.lastIndex;
				}
				lastTagEnd = regExTag.lastIndex;
			}

			return text;
		},
		handleTextAfter: function(text, size, textArray) {

			var regEx = /(&([^;]+);|\r?\n|\r|(<([^>]+)>))/ig,
			lastMatchEnd = 0,
			remainingSize = size,
			match,textInside, plainText, textToPush, remainingText;
			while (((match = regEx.exec(text)) != null)) {
				textInside = text.slice(lastMatchEnd, match.index);
				plainText = this.getPlainText(textInside);
				remainingSize -= plainText.length;
				lastMatchEnd = regEx.lastIndex;
			}
			if (lastMatchEnd !== 0){
				remainingText = this.charactersTruncate(text.slice(lastMatchEnd), remainingSize);
				textToPush = text.slice(0, lastMatchEnd) + remainingText;
				textArray.push(textToPush);
				console.log("textToPush:"+ textToPush);
				console.log("\n\n\n\n\n\n\nplain pushed"+ this.getPlainText(textToPush).length);
				console.log("text.length:"+text.length);
				text = text.slice(textToPush.length);
			}
			while(text.length > 50){
				textToPush = this.charactersTruncate(text, size);
				text = text.slice(textToPush.length);
				console.log("textToPush:"+ textToPush);
				console.log("*************************************************************\n\n\n\n\n\n\nplain pushed"+ this.getPlainText(textToPush).length);
				console.log("text.length:"+text.length);
				textArray.push(textToPush);
			}
			console.log("text at last:"+text);
			return text;

		},
		genericSlice: function (text, size, textArray) {
			var match, textInside,	plainText, plainLength,	terminatingPlain, textToPush, reaminingLength, pivot
			,	remainingSize = size
			,	lastMatchEnd = 0
			,	openDepth = 0
			,	openTags = []
			,	initialTextToPush
			,	initialText
			,	tagsToOpen = ""
			,	tagsToClose
			,	i = 0
			,	regEx = /(&([^;]+);|\r?\n|\r|(<([^>]+)>))/ig;

			if (text.length < 50){
				return "";
			}
			while ((match = regEx.exec(text)) !== null) {
				i++;
				if (i > 100000){
					console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%i:"+i);
					break;

				}
				textInside = text.slice(lastMatchEnd, match.index);
				plainText = this.getPlainText(textInside);
				
				plainLength = plainText.length;
				if (plainLength < remainingSize) {
					remainingSize -= plainLength;
				} else if (plainLength >= remainingSize) {
					terminatingPlain = this.charactersTruncate(plainText, remainingSize);
					if (textInside === terminatingPlain){
						lastMatchEnd = regEx.lastIndex;
						pivot = lastMatchEnd;
					} else{
						textToPush = text.slice(0, lastMatchEnd) + terminatingPlain;
						pivot = lastMatchEnd + terminatingPlain.length;
					}
					initialTextToPush = text.slice(0, pivot);
					initialText = text.slice(pivot);
					tagsToClose = this.getClosingTags(initialText, openDepth);
					textToPush = initialTextToPush + tagsToClose;
					console.log("textToPush:"+ textToPush);
					var plainPushed = this.getPlainText(textToPush);
					console.log("\n\n\n\n\n\n\nplain pushed.length:"+ plainPushed.length);
					console.log("++++++++++++++++++++++++++++++++++++plainPushed:"+plainPushed);
					textArray.push(textToPush);
					tagsToOpen = openTags.join("");
					text = tagsToOpen + initialText;
					console.log("text.length:"+text.length);
					text = this.fixTextFormatting(text);
					remainingSize = size;
					if (text.length > 50){
						this.genericSlice(text, size, textArray);	
					} else{
						break;
					}

					
				}
				if (this.tagType(match[0]) === "open") {
					openDepth++;
					openTags.push(match[0]);
				} else if ((this.tagType(match[0]) === "close") && (openDepth > 0)) {
					openDepth--;
					openTags.pop();
				} else {
					// console.log("match:" + match[0] + "index:" + match.index);
				}
				lastMatchEnd = regEx.lastIndex;
			}
			if (i>10000){
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%i:"+i);
				return "";
			}
			text = this.handleTextAfter(text, size, textArray);
			textArray.push(text);
			console.log("text: "+ text);
			return text;
		},
		getSplitData: function(text, size) {
			// variables declaration and initialization
			var textArray = [];

			// well format
			text = this.fixTextFormatting(text);
			// initial check size is number and text is string
			if (!isNaN(size) && (typeof text === "string" || text instanceof String)) {

				// text = this.handleTextBefore(text, size, textArray);

				// text = this.handleTextMiddle(text, size, textArray);

				// text = this.handleTextAfter(text, size, textArray);

				// debug
				text = this.genericSlice(text, size, textArray);
			}
			console.log(textArray);
			return textArray;
		}
	}
});