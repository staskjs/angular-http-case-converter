/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee>
 *
 * (c) Laboratorium EE 2014
 */
(function () {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.settings', [])
        .provider('eeHttpCaseConverterSettings', function () {
            const caseConverterSettingsProvider = this;

            // This may be replaced with any custom logic callable to provide more precise yet still standard condition.
            caseConverterSettingsProvider.urlFilter = function () {
                return true;
            };

            caseConverterSettingsProvider.requestConfig = {
                camelToSnake: {
                    data: function (config) {
                        // Only POST and PUT methods can have data
                        return ['PUT', 'POST'].indexOf(config.method) > -1 &&
                            !!config.data &&
                            caseConverterSettingsProvider.urlFilter(config.url);
                    },
                    params: function (config) {
                        return !!config.params && caseConverterSettingsProvider.urlFilter(config.url);
                    },
                },
            };

            caseConverterSettingsProvider.responseConfig = {
                snakeToCamel: function (response) {
                    const contentTypeHeader = response.headers('content-type');
                    return !!contentTypeHeader && contentTypeHeader
                        .split(';')
                        .map(function (header) {
                            return header.trim();
                        })
                        .indexOf('application/json') > -1;
                },
            };

            caseConverterSettingsProvider.$get = function () {
                return {
                    condition: {
                        request: caseConverterSettingsProvider.requestConfig,
                        response: caseConverterSettingsProvider.responseConfig,
                    },
                };
            };
        });

})();
