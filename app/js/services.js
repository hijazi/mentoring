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
				// throw away starting spaces
				text = text.replace(/^\s+/g, "");
				var firstSpace;
				// check if text has at least one word shorter than size to cut
				firstSpace = text.indexOf(' ');
				if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)))) {
					// actual work
					text = text.slice(0, size);
					var lastspace = text.lastIndexOf(' ');
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
				text = text.replace(regExSpecialChars, "");
				text = text.replace(regExspaces, " ");
				text = text.replace(regExTrim, "");
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
					terminatingplain = this.charactersTruncate(plainText, remainingSize);
					var textToPush = text.slice(0, lastMatchEnd) + " " + remainingPlain;
					textArray.push(textToPush);
					var reaminingLength = remainingPlain.length + (remainingPlain.length > 0 ? 1 : 0);
					text = text.slice(lastMatchEnd + reaminingLength);
				} else {
					textArray.push(text.slice(0, lastMatchEnd));
					text = text.slice(lastMatchEnd);
				}

				lastMatchEnd += match.index + match[0].length;
			}
			// no more matches and still remainingSize so get terminating plane
			var textPost = text.slice(lastMatchEnd, workBoundry);
			plainText = this.getPlainText(textPost);
			terminatingplain = this.charactersTruncate(plainText, remainingSize);
			// pluls one is for the space truncated
			var pivot = lastMatchEnd + terminatingplain.length + (terminatingplain.length > 0 ? 1 : 0);
			textArray.push(text.slice(0,pivot));
			text = text.slice(pivot);
			return text;
		},
		// this is handle middle work
		sliceFormatted: function(text, size) {
			var match, regExTag = /(<([^>]+)>)/ig,
			plainRegEx = /(&([^;]+);|\r?\n|\r)|(<([^>]+)>)/ig,
			plainContent, plainLength = 0,
			remainingSize = size,
			plainText = "",
			plainPreTag = "",
			plainPostTag = "",
			lastTagEnd = 0,
			terminatingplain = "",
			terminatingTags = "",
			openDepth = 0,
			openTags = [],
			stillOpenedTags = "",
			truncatedLength = 0;


			// plainContent = text.replace(plainRegEx,"");
			debugger;


			if (text.length > size) {

				while (((match = regExTag.exec(text)) != null) && remainingSize > 0) {

					// tag type handling
					if (this.tagType(match[0]) === "open") {
						openDepth++;
						openTags.push(match[0]);
					} else if ((this.tagType(match[0]) === "close") && (openDepth > 0)) {
						openDepth--;
						openTags.pop();
					} else {
						debugger;
						lastTagEnd = match.index + match[0].length;
						console.log("match:" + match[0] + "index:" + match.index);
						continue;
					}

					// getting plain text between tags, lastTagEnd is zero in first iteration
					plainText = this.getPlainText(text.slice(lastTagEnd, match.index)).length;

					// reamining size starts seem as entered size
					if (plainText.length < remainingSize) {
						remainingSize -= plainText.length;
					} else if (plainText.length > remainingSize) {
						terminatingplain = this.charactersTruncate(plainText, remainingSize);
						remainingSize = 0;
						if ((terminatingplain === "") && (openDepth > 0) && (this.tagType(match[0]) === "close")) {
							terminatingTags = this.getClosingTags(text.slice(match.index + match[0].length), openDepth - 1);
							stillOpenedTags.pop();
						} else {
							terminatingTags = this.getClosingTags(text.slice(match.index), openDepth);
						}

						stillOpenedTags = openTags.join("");
						text = text.slice(0, lastTagEnd) + terminatingplain;
					} else if (plainText.length === remainingSize) {
						terminatingTags = this.getClosingTags(text.slice(match.index), openDepth);
						if ((openDepth > 0) && (this.tagType(match[0]) === "close")) {
							openTags.pop();
						}
						stillOpenedTags = openTags.join("");
						text = text.slice(0, lastTagEnd) + plainText;
					}
					lastTagEnd = match.index + match[0].length;
				}
				if (remainingSize > 0) {
					if ((plainPostTag = text.slice(lastTagEnd)) !== "") {
						// silice(...,size+50) is for optimization
						plainPostTag = this.getPlainText(text.slice(lastTagEnd, remainingSize + 50), remainingSize).text;
						remainingSize -= plainPostTag.length;

					}
				}
			}
			var obj = {
				text: text,
				tagsToOpen: stillOpenedTags,
				tagsToClose: terminatingTags
			};
			return text;
		},
		handleTextBefore: function(text, size, textArray) {

			var textNoTag
			,	plainNoTag
			,	plainNoTagHandeled = []
			,	regExTag = /(<([^>]+)>)/g
			,	regExMatch;

			// check text before first tag
			regExMatch = regExTag.exec(text);
			if (regExMatch == !null) {
				// there's text before tag
				textNoTag = text.slice(0, regExMatch.index);
			} else {
				textNoTag = text;
			}
			plainNoTag = this.getPlainText(textNoTag);
			// while its length is greater than size
			if (plainNoTag.length >= size) {
				// handle it and fill passed array
				text = this.smartSlice(text, size, textNoTag.length, textArray);
			}
			return text;
		},
		handleTextMiddle: function(text, size, textArray) {

			var splitResult, doneText, truncatedLength;

			// actual work
			splitResult = this.sliceFormatted(text, size);
			// get splitted text
			doneText = splitResult.text;

			// add closing tags
			doneText += splitResult.tagsToClose;
			// get remaining text
			text = text.slice(truncatedLength);

			// get rid of unnecessary closing tag at the start
			if (splitResult.tagsToOpen === "" && splitResult.tagsToClose !== "") {
				text = text.slice(text.indexOf(">"));
			}
			if (text.length === splitResult.tagsToClose.length) {
				// only closing tags remaining
				text = "";
			} else {
				//reformat
				text = splitResult.tagsToOpen + text;
			}
		},
		handleTextAfter: function(text, size, textArray) {

			var firstSpace, splitResult, doneText, truncatedLength;

			if ((firstSpace <= size) && ((firstSpace !== -1) || (text && (text.length <= size)))) {
				// actual work
				splitResult = this.charactersTruncate(text, size);
				doneText = splitResult;
				truncatedLength = doneText.length;
				text = text.slice(truncatedLength);
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