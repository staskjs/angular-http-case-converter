/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - current implementation
 * @author Michał Gołębiowski <michal.golebiowski@laboratorium.ee> - original idea
 * @author Mikołaj Dądela <mikolaj.dadela@laboratorium.ee> - object converter code
 *
 * (c) Laboratorium EE 2014
 */
(function () {
    'use strict';

    angular
        .module('ee.$http.CaseConverter', [
            'ee.$http.CaseConverter.request.camelToSnake',
            'ee.$http.CaseConverter.response.snakeToCamel',
        ]);

})();

/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - package maintainer
 * @author Mikołaj Dądela <mikolaj.dadela@laboratorium.ee> - filters code
 *
 * (c) Laboratorium EE 2014
 */
(function () {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.filter', [])
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
        });

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
                            if (eeHttpCaseConverterSettings.condition.request.camelToSnake.data(requestConfig)) {
                                requestConfig.data =
                                    eeHttpCaseConverterUtils.convertKeyCase.camelToSnake(requestConfig.data);
                            }
                            if (eeHttpCaseConverterSettings.condition.request.camelToSnake.params(requestConfig)) {
                                requestConfig.params =
                                    eeHttpCaseConverterUtils.convertKeyCase.camelToSnake(requestConfig.params);
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
                                response.data = eeHttpCaseConverterUtils.convertKeyCase.snakeToCamel(response.data);
                            }
                            return response;
                        },
                    };
                }]);
            $httpProvider.interceptors.push('httpCaseConverterSnakeToCamelResponseInterceptor');
        }]);

})();

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
            var caseConverterSettingsProvider = this;

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

})();

/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - package maintainer
 * @author Mikołaj Dądela <mikolaj.dadela@laboratorium.ee> - object converter code
 *
 * (c) Laboratorium EE 2014
 */
(function () {
    'use strict';

    angular
        .module('ee.$http.CaseConverter.utils', [
            'ee.$http.CaseConverter.filter',
        ])
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

            this.convertKeyCase = {
                snakeToCamel: createConverterFunction($filter('snakeToCamel')),
                camelToSnake: createConverterFunction($filter('camelToSnake')),
            };
        }]);

})();
