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
