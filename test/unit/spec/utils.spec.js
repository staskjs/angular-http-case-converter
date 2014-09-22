describe('Package: ee.$http.CaseConverter, Module: utils', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.utils'));
    beforeEach(module('test/unit/mock.json'));

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

        it('should leave Date instances unchanged', function () {
            const now = new Date();
            const input = {fooBar: now};
            const expected = {'foo_bar': now};
            expect(eeHttpCaseConverterUtils.convertKeyCase.camelToSnake(input))
                .toEqual(expected);
        });

        it('should leave Null instances unchanged', function () {
            const input = {fooBar: null};
            const expected = {'foo_bar': null};
            expect(eeHttpCaseConverterUtils.convertKeyCase.camelToSnake(input))
                .toEqual(expected);
        });

        it('should leave Function instances unchanged', function () {
            const fn = function () {};
            const input = {fooBar: fn};
            const expected = {'foo_bar': fn};
            expect(eeHttpCaseConverterUtils.convertKeyCase.camelToSnake(input))
                .toEqual(expected);
        });
    });

});
