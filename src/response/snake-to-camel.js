/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - package maintainer
 * @author Michał Gołębiowski <michal.golebiowski@laboratorium.ee> - original idea
 *
 * (c) Laboratorium EE 2014
 */
(function () {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.response.snakeToCamel', [
            'ee.$http.CaseConverter.utils',
            'ee.$http.CaseConverter.settings',
        ])
        .config(function ($provide, $httpProvider) {
            $provide.factory('httpCaseConverterSnakeToCamelResponseInterceptor',
                function (eeHttpCaseConverterUtils, eeHttpCaseConverter) {
                    return {
                        response: function (response) {
                            if (eeHttpCaseConverter.condition.response.snakeToCamel(response)) {
                                response.data = eeHttpCaseConverterUtils.convertKeyCase.snakeToCamel(response.data);
                            }
                            return response;
                        },
                    };
                });
            $httpProvider.interceptors.push('httpCaseConverterSnakeToCamelResponseInterceptor');
        });

})();
