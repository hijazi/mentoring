'use strict';

/* jasmine specs for controllers go here */

// describe('Mentoring controllers', function() {


// 	describe('Fetching Data from server', function() {
// 		var scope, ctrl, $httpBackend;

// 		beforeEach(module('mentoringApp'));

// 		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
// 			$httpBackend = _$httpBackend_;
// 			$httpBackend.expectGET('data/mentorsInfo.json').
// 			respond([{
// 				name: 'Baha Hijazi'
// 			}, {
// 				name: 'Mhd Aljuboori'
// 			}]);
// 			scope = $rootScope.$new();
// 			ctrl = $controller('mentorsListController', {
// 				$scope: scope
// 			});

// 		}));

// 		it('should creat "mentors" model with 2 mentors fetched from xhr', function() {
// 			expect(scope.mentors).toBeUndefined();
// 			$httpBackend.flush();
// 			// there's a function that's using split text and adding newBio seperately
// 			expect(scope.mentors).toEqual([{
// 				name: 'Baha Hijazi',
// 				newBio: ['No text abailable!']
// 			}, {
// 				name: "Mhd Aljuboori",
// 				newBio: ['No text abailable!']
// 			}]);
// 			});
// 	});

	

// });

// describe('Spliting text service', function() {
// var textSplit, charactersFilter;
// 		// myModule.service('textSplit', ['charactersFilter', function(charactersFilter){
// 		// 	var text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'

// 		// }])
// beforeEach(module('monitoringApp'));
// 		beforeEach(inject(function(_textSplit_, _charactersFilter_) {
// 			textSplit = _textSplit_;
// 			charactersFilter = _charactersFilter_;
// 		}));

// 		it('should return text in an array with specfic size without cutting words in half', function{
			

// 		});

// });


describe('textSplit service', function (){
	beforeEach(module('textSplit'));
	describe('getSplitData', function(){
		var getSplitData,charactersFilter, text;

		beforeEach(inject(function(_textSplit_, _charactersFilter_) {
			textSplit = _textSplit_;
			charactersFilter = _charactersFilter_;
		}));

		it('should do something', function() {
			text = textSplit.getSplitData('12345 12345',7);
			expect(text).toEqual(['12345', '12345']);
		})
	});

});


describe('truncate', function () {

    beforeEach(module('truncate'));

    describe('characters', function () {
        var characterFilter;

        beforeEach(inject(function ($filter) {
            characterFilter = $filter('characters');
        }));

        it('should do nothing to this string', function () {
            expect(characterFilter('1234567890')).toEqual('1234567890');
        });

        it('should fail', function () {
            expect(characterFilter(null, 30)).toNotEqual('1234567890');
        });

        it('should not trim these down', function () {
            expect(characterFilter('1234567890', 30)).toEqual('1234567890');
        });

        it('should trim these down', function () {
            expect(characterFilter('1234567890', 5)).toEqual('12345');
        });

        it('should trim this down including the space', function () {
            expect(characterFilter('123456789 10 11 12 13 14', 13)).toEqual('123456789 10');
        });

        it('should handle invalid numbers', function () {
            expect(characterFilter('1234567890', 0)).toEqual('');
        });

        it('should handle invalid chars numbers type', function () {
            expect(characterFilter('1234567890', 'abc')).toEqual('1234567890');
        });
    });

});