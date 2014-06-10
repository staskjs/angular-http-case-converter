/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - package maintainer
 * @author Michał Gołębiowski <michal.golebiowski@laboratorium.ee> - original idea
 *
 * (c) Laboratorium EE 2014
 */
(function () {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.request.camelToSnake', [
            'ee.$http.CaseConverter.utils',
            'ee.$http.CaseConverter.settings',
        ])
        .config(function ($provide, $httpProvider) {
            $provide.factory('httpCaseConverterCamelToSnakeRequestInterceptor',
                function (eeHttpCaseConverterUtils, eeHttpCaseConverterSettings) {
                    return {
                        request: function (requestConfig) {
                            if (eeHttpCaseConverterSettings.condition.request.camelToSnake(requestConfig)) {
                                requestConfig.params =
                                    eeHttpCaseConverterUtils.convertObjectKeyCaseFromCamelToSnake(requestConfig.params);
                            }

                            return requestConfig;
                        },
                    };
                });
            $httpProvider.interceptors.push('httpCaseConverterCamelToSnakeRequestInterceptor');
        });

})();
