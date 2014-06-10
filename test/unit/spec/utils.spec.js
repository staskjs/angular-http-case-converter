describe('Package: ee.$http.CaseConverter, Module: utils', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.utils'));
    beforeEach(module('test/unit/mock.json'));

    describe('filters', function () {

        describe('snakeToCamel', function () {
            let $filter;

            beforeEach(inject(function (_$filter_) {
                $filter = _$filter_;
            }));

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
                const underscorized = 'foo_bar_text';
                const camelCase = $filter('snakeToCamel')(underscorized);
                const reversed = $filter('camelToSnake')(camelCase);
                expect(reversed).toBe(underscorized);
            });

        });

        describe('camelToSnake', function () {
            let $filter;

            beforeEach(inject(function (_$filter_) {
                $filter = _$filter_;
            }));

            it('should convert camelCase text to snake_case', function () {
                expect($filter('camelToSnake')('fooBarText')).toBe('foo_bar_text');
            });

            it('should convert camelCase starting with capital letter', function () {
                expect($filter('camelToSnake')('FooBarText')).toBe('_foo_bar_text');
            });

            it('should be reversible by snakeToCamel', function () {
                const camelCase = 'fooBarText';
                const underscorized = $filter('camelToSnake')(camelCase);
                const reversed = $filter('snakeToCamel')(underscorized);
                expect(reversed).toBe(camelCase);
            });

        });

    });

    describe('Service: eeHttpCaseConverterUtils', function () {

        let eeHttpCaseConverterUtils, testUnitMock;

        beforeEach(inject(function (_testUnitMock_, _eeHttpCaseConverterUtils_) {
            eeHttpCaseConverterUtils = _eeHttpCaseConverterUtils_;
            testUnitMock = _testUnitMock_;
        }));

        it('should change snake_case keys and values to camelCase without affecting other cases', function () {
            expect(eeHttpCaseConverterUtils.convertKeyCase.snakeToCamel(testUnitMock.mixed))
                .toEqual(testUnitMock.afterSnakeToCamel);
        });

        it('should change camelCase keys and values to snake_case without affecting other cases', function () {
            expect(eeHttpCaseConverterUtils.convertKeyCase.camelToSnake(testUnitMock.mixed))
                .toEqual(testUnitMock.afterCamelToSnake);
        });

    });

});
