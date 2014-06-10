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

            caseConverterSettingsProvider.requestConfig = {
                camelToSnake: function (requestConfig) {
                    return !!requestConfig.params;
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
