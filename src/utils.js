/**
 * @author Jarek Rencz <jarek.rencz@laboratorium.ee> - package maintainer
 * @author Mikołaj Dądela <mikolaj.dadela@laboratorium.ee> - object converter code
 *
 * (c) Laboratorium EE 2014
 */
(function () {
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
        .service('eeHttpCaseConverterUtils', function ($filter) {
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
        });

})();
