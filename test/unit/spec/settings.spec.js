describe('Package: ee.$http.CaseConverter, Module: settings', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.settings'));

    describe('predefined settings', function () {

        let eeHttpCaseConverterSettings;

        beforeEach(inject(function (_eeHttpCaseConverterSettings_) {
            eeHttpCaseConverterSettings = _eeHttpCaseConverterSettings_;
        }));

        it('should be an object with 3 conditions predefined', function () {
            expect(typeof eeHttpCaseConverterSettings.condition.request.camelToSnake.data).toBe('function');
            expect(typeof eeHttpCaseConverterSettings.condition.request.camelToSnake.params).toBe('function');
            expect(typeof eeHttpCaseConverterSettings.condition.response.snakeToCamel).toBe('function');
        });

        describe('request camelToSnake conditions', function () {

            it('should process requests with params or data', function () {
                const config = {
                    withParams: {
                        method: 'GET',
                        params: {},
                    },
                    withData: {
                        method: 'POST',
                        data: {},
                    },
                    basic: {
                        method: 'GET',
                    },
                };

                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.data(config.basic)).toBe(false);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.params(config.basic)).toBe(false);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.data(config.withParams)).toBe(false);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.params(config.withParams)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.data(config.withData)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.params(config.withData)).toBe(false);
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
                    // return true for every request config with method defined (every request config has)
                    camelToSnake: {
                        data: function (requestConfig) {
                            return !!requestConfig.method;
                        },
                        params: function (requestConfig) {
                            return !!requestConfig.method;
                        },
                    },
                };
            });

            inject(function (eeHttpCaseConverterSettings) {
                const config = {
                    withParams: {
                        method: 'GET',
                        params: {},
                    },
                    withData: {
                        method: 'POST',
                        data: {},
                    },
                    basic: {
                        method: 'GET',
                    },
                };

                // both have `foo`
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.data(config.basic)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.params(config.basic)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.data(config.withParams)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.params(config.withParams)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.data(config.withData)).toBe(true);
                expect(eeHttpCaseConverterSettings.condition.request.camelToSnake.params(config.withData)).toBe(true);
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
