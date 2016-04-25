'use strict';

/* jasmine specs for filters go here */

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
        it('should ignore the starting spaces', function () {
        	expect(characterFilter('   123', 3).toEqual('123');
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