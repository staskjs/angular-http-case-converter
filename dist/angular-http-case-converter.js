/**
 * Module provides a way to convert requests and responses on the fly in a drop-in manner.
 *
 * # How to use?
 *
 * Decide what type of convertion you want to use. Currently the package provides modules:
 *
 * - `ee.$http.CaseConverter.request.camelToSnake` that converts request params case from camel case used in the
 *   AngularJS application to snake case (a.k.a. underscore notation) used in the backend which is default for both
 *   Symfony FOSRestBundle and Django.
 *
 * - 'ee.$http.CaseConverter.response.snakeToCamel' that converts response JSON objects from snake case to camel case.
 *
 * All you have to do is to depend your main module on the chosen package modules:
 * ```
 * var myApp = angular.module('app', [
 *     'ee.$http.CaseConverter.request.camelToSnake',
 *     'ee.$http.CaseConverter.response.snakeToCamel',
 * ])
 * ```
 * You may also use `caseConverterSettingsProvider` to define custom conditions under which processing takes place.
 * By default every request with any params and every response returned as `application/json` is processed.
 * If you wish only certain requests/responses to be process use:
 *
 * ```
 * myApp.config(function (caseConverterSettingsProvider) {
 *     caseConverterSettingsProvider.requestConfig = {
 *         camelToSnake: function (requestConfig) {
 *             // Your custom logic to decide whether process or not. Should return a boolean.
 *         }
 *     }
 * })
 * ```
 *
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - current implementation
 * @author Michał Gołębiowski <michal.golebiowski@laboratorium.ee> - original idea
 * @author Mikołaj Dądela <mikolaj.dadela@laboratorium.ee> - object converter code
 *
 * (c) Laboratorium EE 2014
 */
(function (angular) {
    'use strict';

    angular
        .module('ee.$http.CaseConverter', [
            'ee.$http.CaseConverter.request.camelToSnake',
            'ee.$http.CaseConverter.response.snakeToCamel',
        ]);

})();

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
        .config(["$provide", "$httpProvider", function ($provide, $httpProvider) {
            $provide.factory('httpCaseConverterCamelToSnakeRequestInterceptor',
                ["eeHttpCaseConverterUtils", "eeHttpCaseConverterSettings", function (eeHttpCaseConverterUtils, eeHttpCaseConverterSettings) {
                    return {
                        request: function (requestConfig) {
                            if (eeHttpCaseConverterSettings.condition.request.camelToSnake(requestConfig)) {
                                requestConfig.params =
                                    eeHttpCaseConverterUtils.convertObjectKeyCaseFromCamelToSnake(requestConfig.params);
                            }

                            return requestConfig;
                        },
                    };
                }]);
            $httpProvider.interceptors.push('httpCaseConverterCamelToSnakeRequestInterceptor');
        }]);

})();

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
        .config(["$provide", "$httpProvider", function ($provide, $httpProvider) {
            $provide.factory('httpCaseConverterSnakeToCamelResponseInterceptor',
                ["eeHttpCaseConverterUtils", "eeHttpCaseConverterSettings", function (eeHttpCaseConverterUtils, eeHttpCaseConverterSettings) {
                    return {
                        response: function (response) {
                            if (eeHttpCaseConverterSettings.condition.response.snakeToCamel(response)) {
                                response.data =
                                    eeHttpCaseConverterUtils.convertObjectKeyCaseFromSnakeToCamel(response.data);
                            }
                            return response;
                        },
                    };
                }]);
            $httpProvider.interceptors.push('httpCaseConverterSnakeToCamelResponseInterceptor');
        }]);

})();

/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - current implementation
 *
 * (c) Laboratorium EE 2014
 */
(function (angular) {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.settings', [])
        .provider('eeHttpCaseConverterSettings', function () {
            var caseConverterSettingsProvider = this;

            caseConverterSettingsProvider.requestConfig = {
                camelToSnake: function (requestConfig) {
                    return !!requestConfig.params;
                },
            };

            caseConverterSettingsProvider.responseConfig = {
                snakeToCamel: function (response) {
                    var contentTypeHeader = response.headers('content-type');
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

})(angular);

/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - package maintainer
 * @author Mikołaj Dądela <mikolaj.dadela@laboratorium.ee> - object converter code
 *
 * (c) Laboratorium EE 2014
 */
(function (angular) {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.utils', [])
        .filter('snakeToCamel', function () {
            return function (input) {
                return input.replace(/_([a-zA-Z0-9])/g, function (all, letter) {
                    return letter.toUpperCase();
                });
            };
        })
        .filter('camelToSnake', function () {
            return function (input) {
                return input.replace(/[A-Z]/g, function (letter) {
                    return '_' + letter.toLowerCase();
                });
            };
        })
        .service('eeHttpCaseConverterUtils', ["$filter", function ($filter) {
            function createConverterFunction(keyConversionFun) {
                return function convertObjectKeys(obj) {
                    // Creates a new object mimicking the old one with keys changed using the keyConversionFun.
                    // Does a deep conversion.
                    if (typeof obj !== 'object' || obj == null) {
                        return obj; // Primitives are returned unchanged.
                    }
                    return Object.keys(obj).reduce(function (newObj, key) {
                        newObj[keyConversionFun(key)] = convertObjectKeys(obj[key]);
                        return newObj;
                    }, Array.isArray(obj) ? [] : {}); // preserve "arrayness"
                };
            }

            this.convertObjectKeyCaseFromSnakeToCamel = createConverterFunction($filter('snakeToCamel'));
            this.convertObjectKeyCaseFromCamelToSnake = createConverterFunction($filter('camelToSnake'));
        }]);

})(angular);
