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
