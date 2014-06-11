describe('Package: ee.$http.CaseConverter, Module: utils', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.filter'));
    let $filter;

    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    describe('Filter: snakeToCamel', function () {

        it('should convert snake_case text to camelCase', function () {
            expect($filter('snakeToCamel')('foo_bar_text')).toBe('fooBarText');
        });

        it('should work on text starting with "_"', function () {
            expect($filter('snakeToCamel')('_foo_bar_text')).toBe('FooBarText');
        });

        it('should not change a hyphenated text', function () {
            expect($filter('snakeToCamel')('foo-bar-text')).toBe('foo-bar-text');
        });

        it('should not change a hyphenated text starting with "-"', function () {
            expect($filter('snakeToCamel')('-foo-bar-text')).toBe('-foo-bar-text');
        });

        it('should be reversible by camelToSnake', function () {
            const initial = 'foo_bar_text';
            const transformed = $filter('snakeToCamel')(initial);
            const reversed = $filter('camelToSnake')(transformed);
            expect(reversed).toBe(initial);
        });

    });

    describe('Filter: camelToSnake', function () {

        it('should convert camelCase text to snake_case', function () {
            expect($filter('camelToSnake')('fooBarText')).toBe('foo_bar_text');
        });

        it('should convert camelCase starting with capital letter', function () {
            expect($filter('camelToSnake')('FooBarText')).toBe('_foo_bar_text');
        });

        it('should be reversible by snakeToCamel', function () {
            const initial = 'fooBarText';
            const transformed = $filter('camelToSnake')(initial);
            const reversed = $filter('snakeToCamel')(transformed);
            expect(reversed).toBe(initial);
        });

    });

});
