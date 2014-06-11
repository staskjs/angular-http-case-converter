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

    });

});
