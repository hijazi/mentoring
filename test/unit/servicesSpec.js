"use strict";

/* jasmine specs for services go here */

describe("textSplitter service", function (){
	var textSplitterService, mockcharctersFilter;

	beforeEach(function(){
		module("mentoringServices");
		// module(function($provide) {
		// 	$provide.value("charactersFilter", mockcharctersFilter);
		// });
		inject(function($injector){
			textSplitterService = $injector.get("textSplitter");
		});

	});
    describe("charactersTruncate function", function(){
        var plainSplitted;

        // unformatted text

        // one word
        // >size
        it("Should return empty string when text is one word and longer than size", function() {
            plainSplitted = textSplitterService.charactersTruncate("OneWordLognerThanFive",5);
            expect(plainSplitted).toEqual("");
        });
        // ===size
        it("Should return one word if its size is same as size", function () {
            plainSplitted = textSplitterService.charactersTruncate("12345", 5);
            expect(plainSplitted).toEqual("12345");
        });
        // <size
        it("Should return one word if its size is smaller than size", function () {
            plainSplitted = textSplitterService.charactersTruncate("123", 5);
            expect(plainSplitted).toEqual("123");
        });
        // 1st word < size
        it("Should return first word if it is the only one shorter or equal the size", function () {
            plainSplitted = textSplitterService.charactersTruncate("good experience", 5);
            expect(plainSplitted).toEqual("good");
        });

        // size NaN
        it("Should return empty string when size is NaN", function () {
            plainSplitted = textSplitterService.charactersTruncate("what ever string", "size not a number");
            expect(plainSplitted).toEqual("");
        });

        // size negative or zero
        // 1st case spaces
        // 2ed no spaces
        it("Should return empty string when size is negative or zero disregarding text; first case text with spaces", function () {
            plainSplitted = textSplitterService.charactersTruncate("what ever string", -1);
            expect(plainSplitted).toEqual("");
            plainSplitted = textSplitterService.charactersTruncate("whatEverString", -1);
            expect(plainSplitted).toEqual("");
            expect(textSplitterService.charactersTruncate("1234567890", 0)).toEqual("");
        });
        // text not string
        it("Should return empty string when text is not a string disregarding the number", function () {
            plainSplitted = textSplitterService.charactersTruncate(50, 30);
            expect(plainSplitted).toEqual("");
        });
        // text empty
        it("Should return empty string when text is empty string", function () {
            plainSplitted = textSplitterService.charactersTruncate("", 40);
            expect(plainSplitted).toEqual("");
        });
        // ignore starting spaces
        it("Should ignore the starting spaces", function () {
            plainSplitted = textSplitterService.charactersTruncate("   12345", 5);
            expect(plainSplitted).toEqual("12345");
        });
        // no cutted words        
        it("Should not split single word", function () {
            plainSplitted = textSplitterService.charactersTruncate("good experience", 13);
            console.log("plainSplitted:"+plainSplitted);
            expect(plainSplitted).toEqual("good");
        });
        it("Should do nothing to this string", function () {
            expect(textSplitterService.charactersTruncate("12345678907")).toEqual("12345678907");
        });

        it("should not reutrn any number", function () {
            expect(textSplitterService.charactersTruncate(null, 30)).toEqual("");
        });

        it("Should not trim these down", function () {
            expect(textSplitterService.charactersTruncate("1234567890", 30)).toEqual("1234567890");
        });

        it("Should trim this down including the space", function () {
            expect(textSplitterService.charactersTruncate("123456789 10 11 12 13 14", 13)).toEqual("123456789 10");
        });

        it("Should handle invalid chars numbers type", function () {
            expect(textSplitterService.charactersTruncate("1234567890", "abc")).toEqual("");
        });
    });

    describe("getPlainText function in textSplitter service", function () {

        it("Should return 0 1st", function () {
            expect(textSplitterService.getPlainText("").length).toEqual(0);
        });
        it("Should return 0 2ed", function () {
            expect(textSplitterService.getPlainText("     ").length).toEqual(0);
        });
        it("Should return 0 3rd", function () {
            expect(textSplitterService.getPlainText("   &npsb; \n\n\n   \r  \r  ").length).toEqual(0);
        });
        it("Should return 0 4th", function () {
            expect(textSplitterService.getPlainText("   12   &npsb; \n\n\n   \r  \r  ").length).toEqual(2);
        });
        it("Should return 0 5th", function () {
            expect(textSplitterService.getPlainText("12   &npsb; \n\n\n   \r  \r  ").length).toEqual(2);
        });
        // spaces in between
        it("Should return 0 sth", function () {
            expect(textSplitterService.getPlainText("   12 45 &npsb; \n\n\n   \r  \r ab ").length).toEqual("12 45 ab".length);
        });
    });
    describe("tagType function in textSplitter service", function () {

        it("Should return open", function () {
            expect(textSplitterService.tagType("<whatever>")).toEqual("open");
        });
        it("Should return close", function () {
            expect(textSplitterService.tagType("</whatever>")).toEqual("close");
        });
        it("Should return unpaired", function () {
            expect(textSplitterService.tagType("<whatever/>")).toEqual("unpaired");
        });
    });
    describe("getClosingTags function in textSplitter service", function () {

        it("Should return empty string; depth is 0 or negative", function () {
            expect(textSplitterService.getClosingTags("</whatever>", 0)).toEqual("");
            expect(textSplitterService.getClosingTags("</whatever>", -1)).toEqual("");
        });

        it("Should return </whatever>", function () {
            expect(textSplitterService.getClosingTags("</whatever>", 1)).toEqual("</whatever>");
        });
        it("Should return first </requested>", function () {
            expect(textSplitterService.getClosingTags("</requested></whatever>", 1)).toEqual("</requested>");
        });
        it("Should return </requested> ignoring closing tags with openning tags before them taking depth into account", function () {
            expect(textSplitterService.getClosingTags("<something><somethingelse></somethingelse></something></requested>", 1)).toEqual("</requested>");
            expect(textSplitterService.getClosingTags("<something><something else></something else></something></requested><third thing></third thing></requested2>", 2)).toEqual("</requested></requested2>");
        });
        it("Should return </requested> ignoring closing tags with openning tags before them taking depth into account", function () {
            expect(textSplitterService.getClosingTags("<something><something else></something else></something></requested><third thing></third thing></requested2>", 1)).toEqual("</requested>");
        });
        it("Should return </requested></requested2> ignoring that open depth is bigger than available tags", function () {
            expect(textSplitterService.getClosingTags("<something><something else></something else></something></requested><third thing></third thing></requested2>", 3)).toEqual("</requested></requested2>");
        });
    });
    describe("fixTextFormating function that return text with fiexd spacing", function () {
        it("Should put space srrounding special characters with trimming", function () {
            expect(textSplitterService.fixTextFormatting("12&45; 89")).toEqual("12 &45; 89");
            expect(textSplitterService.fixTextFormatting("12&45; 89<tag>")).toEqual("12 &45; 89 <tag>");
            expect(textSplitterService.fixTextFormatting("12&45; 89<tag>dsf")).toEqual("12 &45; 89 <tag> dsf");
        });
    });
    describe("smartSlice function that pushes to array and returns rest of text", function () {

        var array = [];

        it("Should push all of the text to the array and return empty string", function () {
            debugger;
            expect(textSplitterService.smartSlice("12&45; 89", 5, 10, array)).toEqual("");
            expect(array).toEqual(["12&45; 89"])
        });
        it("Should keep the special characters 2", function () {
            debugger;
            array = [];
            expect(textSplitterService.smartSlice("12&45; 89", 3, 10, array)).toEqual(" 89");
            expect(array).toEqual(["12&45;"]);
        });
    });
    describe("handleNoTags function that takes no tags text and fills the textArray with splitted text and returns cutted text", function () {
        it("should return this as is", function () {
            var array = [];
            expect(textSplitterService.handleNoTags("12 &56; 9", 2,10, array)).toEqual(" 9");
            expect(textSplitterService.handleNoTags("12 &56; 9",3, 10, array)).toEqual("");
            expect(textSplitterService.handleNoTags("12 &56; 9",1, 10, array)).toEqual("");
        })
    })

    describe("sliceFormatted function that return array of strings splitted depending on size", function () {
        it("Should split text without loosing special characters", function () {
            debugger;
            expect(textSplitterService.sliceFormatted("12&45; 89", 3)).toEqual("12 &45;");
        });
        it("Should splitted text without damaging html tags", function () {
            expect(textSplitterService.sliceFormatted("12<b> 89</b>", 3)).toEqual("12");
        });
    });

    // @TO_DO
    describe("getSplitData function that return array of strings splitted depending on size", function () {
        it("Should split text without loosing special characters", function () {
            expect(textSplitterService.getSplitData("12&45; 89"), 3).toEqual(["12 &45;","89"]);
        });
        it("Should splitted text without damaging html tags", function () {
            expect(textSplitterService.getSplitData("12<b> 89</b>"), 3).toEqual(["12","<b> 89 </b>"]);
        });
    });

});






