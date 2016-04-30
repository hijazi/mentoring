'use strict';

/* jasmine specs for filters go here */

describe('truncate', function () {

    beforeEach(module('truncate'));

    describe('characters', function () {
        var characterFilter;

        beforeEach(inject(function ($filter) {
            characterFilter = $filter('characters');
        }));

        it('Should do nothing to this string', function () {
            expect(characterFilter('1234567890')).toEqual('1234567890');
        });

        it('Should fail', function () {
            expect(characterFilter(null, 30)).toEqual('1234567890');
        });

        it('Should not trim these down', function () {
            expect(characterFilter('1234567890', 30)).toEqual('1234567890');
        });

        it('Should trim these down', function () {
            expect(characterFilter('1234567890', 5)).toEqual('12345');
        });
        it('Should trim this down including the space', function () {
            expect(characterFilter('123456789 10 11 12 13 14', 13)).toEqual('123456789 10');
        });

        it('Should handle invalid numbers', function () {
            expect(characterFilter('1234567890', 0)).toEqual('');
        });

        it('Should handle invalid chars numbers type', function () {
            expect(characterFilter('1234567890', 'abc')).toEqual('1234567890');
        });
    });

});