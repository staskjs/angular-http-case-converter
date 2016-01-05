describe('Package: ee.$http.CaseConverter, Module: settings', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.settings'));

    describe('predefined settings', function () {

        let eeHttpCaseConverter;

        beforeEach(inject(function (_eeHttpCaseConverter_) {
            eeHttpCaseConverter = _eeHttpCaseConverter_;
        }));

        it('should be an object with 3 conditions predefined', function () {
            expect(typeof eeHttpCaseConverter.condition.request.camelToSnake.data).toBe('function');
            expect(typeof eeHttpCaseConverter.condition.request.camelToSnake.params).toBe('function');
            expect(typeof eeHttpCaseConverter.condition.response.snakeToCamel).toBe('function');
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

                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.basic)).toBe(false);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.basic)).toBe(false);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.withParams)).toBe(false);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.withParams)).toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.withData)).toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.withData)).toBe(false);
            });
        });

        describe('response snakeToCamel condition', function () {

            it('should process JSON requests', function () {
                const response = {
                    json: {
                        headers: function (headerName) {
                            return headerName === 'content-type' ? 'foo; bar; application/json;' : '';
                        },
                        config: {url: ''},
                    },
                    xml: {
                        headers: function (headerName) {
                            return headerName === 'content-type' ? 'foo; bar; application/xml;' : '';
                        },
                        config: {url: ''},
                    },
                };

                expect(eeHttpCaseConverter.condition.response.snakeToCamel(response.xml)).toBe(false);
                expect(eeHttpCaseConverter.condition.response.snakeToCamel(response.json)).toBe(true);
            });
        });
    });

    describe('configuring own settings', function () {

        it('should allow to provide url filtering function', function () {
            module(function (eeHttpCaseConverterProvider) {
                eeHttpCaseConverterProvider.requestUrlFilter = function (url) {
                    // math only urls starting with 'foo'
                    return url.indexOf('foo') === 0;
                };
            });

            inject(function (eeHttpCaseConverter) {
                const config = {
                    correntUrl: {
                        withParams: {
                            url: 'foo/backend/path',
                            method: 'GET',
                            params: {},
                        },
                        withData: {
                            url: 'foo/backend/path',
                            method: 'POST',
                            data: {},
                        },
                    },
                    wrongUrl: {
                        withParams: {
                            url: 'bar/backend/path',
                            method: 'GET',
                            params: {},
                        },
                        withData: {
                            url: 'bar/backend/path',
                            method: 'POST',
                            data: {},
                        },
                    },
                };

                // both have `foo`
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.correntUrl.withParams))
                    .toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.correntUrl.withData))
                    .toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.wrongUrl.withParams))
                    .toBe(false);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.wrongUrl.withData))
                    .toBe(false);
            });
        });

        it('should allow to replace requestConfig as a whole', function () {
            module(function (eeHttpCaseConverterProvider) {
                eeHttpCaseConverterProvider.requestConfig = {
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

            inject(function (eeHttpCaseConverter) {
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
                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.basic)).toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.basic)).toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.withParams)).toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.withParams)).toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.data(config.withData)).toBe(true);
                expect(eeHttpCaseConverter.condition.request.camelToSnake.params(config.withData)).toBe(true);
            });
        });

        it('should allow to replace responseConfig as a whole', function () {
            module(function (eeHttpCaseConverterProvider) {
                eeHttpCaseConverterProvider.responseConfig = {
                    snakeToCamel: function () {
                        return true;
                    },
                };
            });

            inject(function (eeHttpCaseConverter) {
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
                expect(eeHttpCaseConverter.condition.response.snakeToCamel(response.xml)).toBe(true);
                expect(eeHttpCaseConverter.condition.response.snakeToCamel(response.json)).toBe(true);
            });
        });

    });

});
