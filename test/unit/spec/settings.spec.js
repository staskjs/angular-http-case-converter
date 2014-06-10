describe('Package: ee.$http.CaseConverter, Module: settings', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.settings'));

    describe('predefined settings', function () {

        let eeHttpCaseConverterSettings;

        beforeEach(inject(function (_eeHttpCaseConverterSettings_) {
            eeHttpCaseConverterSettings = _eeHttpCaseConverterSettings_;
        }));

        it('should be an object with 2 conditions predefined', function () {
            expect(typeof eeHttpCaseConverterSettings.condition.request.camelToSnake).toBe('function');
            expect(typeof eeHttpCaseConverterSettings.condition.response.snakeToCamel).toBe('function');
        });

        describe('request camelToSnake condition', function () {

            it('should process requests with params', function () {
                const config = {
                    withParams: {
                        foo: {},
                        bar: [],
                        params: {},
                    },
                    withoutParams: {
                        foo: {},
                        bar: [],
                    },
                };

                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake(config.withoutParams)).toBe(false);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake(config.withParams)).toBe(true);
            });
        });

        describe('response snakeToCamel condition', function () {

            it('should process JSON requests', function () {
                const response = {
                    json: {
                        headers: function (headerName) {
                            return headerName === 'content-type' ? 'foo; bar; application/json;' : '';
                        },
                    },
                    xml: {
                        headers: function (headerName) {
                            return headerName === 'content-type' ? 'foo; bar; application/xml;' : '';
                        },
                    },
                };

                expect(eeHttpCaseConverterSettings.condition.response.snakeToCamel(response.xml)).toBe(false);
                expect(eeHttpCaseConverterSettings.condition.response.snakeToCamel(response.json)).toBe(true);
            });
        });
    });

    describe('configuring own settings', function () {

        it('should allow to replace requestConfig as a whole', function () {
            module(function (eeHttpCaseConverterSettingsProvider) {
                eeHttpCaseConverterSettingsProvider.requestConfig = {
                    camelToSnake: function (requestConfig) {
                        return !!requestConfig.foo;
                    },
                };
            });

            inject(function (eeHttpCaseConverterSettings) {
                const config = {
                    withParams: {
                        foo: {},
                        bar: [],
                        params: {},
                    },
                    withoutParams: {
                        foo: {},
                        bar: [],
                    },
                };

                // both have `foo`
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake(config.withoutParams)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake(config.withParams)).toBe(true);
            });
        });

        it('should allow to replace responseConfig as a whole', function () {
            module(function (eeHttpCaseConverterSettingsProvider) {
                eeHttpCaseConverterSettingsProvider.responseConfig = {
                    snakeToCamel: function () {
                        return true;
                    },
                };
            });

            inject(function (eeHttpCaseConverterSettings) {
                const response = {
                    json: {
                        headers: function (headerName) {
                            return headerName === 'content-type' ? 'foo; bar; application/json;' : '';
                        },
                    },
                    xml: {
                        headers: function (headerName) {
                            return headerName === 'content-type' ? 'foo; bar; application/xml;' : '';
                        },
                    },
                };

                // each response will now match
                expect(eeHttpCaseConverterSettings.condition.response.snakeToCamel(response.xml)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.response.snakeToCamel(response.json)).toBe(true);
            });
        });

    });

});
