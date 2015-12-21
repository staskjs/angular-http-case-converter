/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee>
 *
 * (c) Laboratorium EE 2014
 */
(function () {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.settings', [])
        .provider('eeHttpCaseConverter', function () {
            const caseConverterProvider = this;

            // This may be replaced with any custom logic callable to provide more precise yet still standard condition.
            caseConverterProvider.requestUrlFilter = function () {
                return true;
            };

            // This may be replaced with any custom logic callable to provide more precise yet still standard condition.
            caseConverterProvider.responseUrlFilter = function () {
                return true;
            };

            caseConverterProvider.requestConfig = {
                camelToSnake: {
                    data: function (config) {
                        // Only PATCH, POST, PUT methods can have data
                        return ['PATCH', 'POST', 'PUT'].indexOf(config.method) > -1 &&
                            !!config.data &&
                            caseConverterProvider.requestUrlFilter(config.url);
                    },
                    params: function (config) {
                        return !!config.params && caseConverterProvider.requestUrlFilter(config.url);
                    },
                },
            };

            caseConverterProvider.responseConfig = {
                snakeToCamel: function (response) {
                    const contentTypeHeader = response.headers('content-type');
                    return !!contentTypeHeader && caseConverterProvider.responseUrlFilter(response.config.url) && contentTypeHeader
                        .split(';')
                        .map(function (header) {
                            return header.trim();
                        })
                        .indexOf('application/json') > -1;
                },
            };

            caseConverterProvider.$get = function () {
                return {
                    condition: {
                        request: caseConverterProvider.requestConfig,
                        response: caseConverterProvider.responseConfig,
                    },
                };
            };
        });

})();
