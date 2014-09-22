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
        .service('eeHttpCaseConverterUtils', function ($filter) {
            function getClass(obj) {
                // Workaround for detecting native classes.
                // Examples:
                // getClass({}) === 'Object'
                // getClass([]) === 'Array'
                // getClass(function () {}) === 'Function'
                // getClass(new Date) === 'Date'
                // getClass(null) === 'Null'

                // Here we get a string like '[object XYZ]'
                const typeWithBrackets = Object.prototype.toString.call(obj);
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
        });

})();
