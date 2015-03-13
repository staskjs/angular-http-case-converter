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
                ["eeHttpCaseConverterUtils", "eeHttpCaseConverter", function (eeHttpCaseConverterUtils, eeHttpCaseConverter) {
                    return {
                        request: function (requestConfig) {
                            if (eeHttpCaseConverter.condition.request.camelToSnake.data(requestConfig)) {
                                requestConfig.data =
                                    eeHttpCaseConverterUtils.convertKeyCase.camelToSnake(requestConfig.data);
                            }
                            if (eeHttpCaseConverter.condition.request.camelToSnake.params(requestConfig)) {
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
                ["$q", "eeHttpCaseConverterUtils", "eeHttpCaseConverter", function ($q, eeHttpCaseConverterUtils, eeHttpCaseConverter) {
                    var convert = function (response) {
                      if (eeHttpCaseConverter.condition.response.snakeToCamel(response)) {
                          response.data = eeHttpCaseConverterUtils.convertKeyCase.snakeToCamel(response.data);
                      }

                      return response;
                    };

                    return {
                        response: function (response) {
                            return convert(response);
                        },
                        responseError: function (response) {
                            return $q.reject(convert(response));
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
        .provider('eeHttpCaseConverter', function () {
            var caseConverterProvider = this;

            // This may be replaced with any custom logic callable to provide more precise yet still standard condition.
            caseConverterProvider.urlFilter = function () {
                return true;
            };

            caseConverterProvider.requestConfig = {
                camelToSnake: {
                    data: function (config) {
                        // Only PATCH, POST, PUT methods can have data
                        return ['PATCH', 'POST', 'PUT'].indexOf(config.method) > -1 &&
                            !!config.data &&
                            caseConverterProvider.urlFilter(config.url);
                    },
                    params: function (config) {
                        return !!config.params && caseConverterProvider.urlFilter(config.url);
                    },
                },
            };

            caseConverterProvider.responseConfig = {
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

/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - package maintainer
 * @author Mikołaj Dądela <mikolaj.dadela@laboratorium.ee> - object converter code
 * @author Patryk Hes <patryk.hes@laboratorium.ee> - object converter code
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
            function getClass(obj) {
                // Workaround for detecting native classes.
                // Examples:
                // getClass({}) === 'Object'
                // getClass([]) === 'Array'
                // getClass(function () {}) === 'Function'
                // getClass(new Date) === 'Date'
                // getClass(null) === 'Null'

                // Here we get a string like '[object XYZ]'
                var typeWithBrackets = Object.prototype.toString.call(obj);
                // and we extract 'XYZ' from it
                return typeWithBrackets.match(/\[object (.+)\]/)[1];
            }
            function createConverterFunction(keyConversionFun) {
                return function convertObjectKeys(obj) {
                    // Creates a new object mimicking the old one with keys changed using the keyConversionFun.
                    // Does a deep conversion.
                    if (getClass(obj) !== 'Object' && getClass(obj) !== 'Array') {
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
