describe('Package: ee.$http.CaseConverter.request, Module: camelToSnake', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.request.camelToSnake'));

    it('should change camelCased params to snake_cased for methods with no data',
        inject(function ($http, $httpBackend) {
            const configWithCamelCaseParams = {
                params: {
                    fooBar: 'barFoo',
                },
            };

            const expectedRequestUrl = 'foo?foo_bar=barFoo';

            $httpBackend.expectGET(expectedRequestUrl).respond(true);
            $httpBackend.expectHEAD(expectedRequestUrl).respond(true);
            $httpBackend.expectJSONP(expectedRequestUrl).respond(true);
            $httpBackend.expectDELETE(expectedRequestUrl).respond(true);

            $http.get('foo', configWithCamelCaseParams);
            $http.head('foo', configWithCamelCaseParams);
            $http.jsonp('foo', configWithCamelCaseParams);
            $http.delete('foo', configWithCamelCaseParams);

            $httpBackend.flush();
            // Those 2 will fail of params don't match.
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        })
    );

    /**
     * @see createShortMethodsWithData in the andular.js code
     */
    it('should change camelCased params and data keys to snake_cased for PUT and POST (methods with data)',
        inject(function ($http, $httpBackend) {
            const config = {
                camelCase: {
                    data: {
                        fooBar: 'barFoo',
                    },
                    params: {
                        fooBarParam: 'fooBarParamBody',
                    },
                },
                snakeCase: {
                    data: {
                        foo_bar: 'barFoo',
                    },
                    params: {
                        foo_bar_param: 'fooBarParamBody',
                    },
                },
            };

            const expectedRequestUrl = 'foo?foo_bar_param=fooBarParamBody';

            $httpBackend.expectPUT(expectedRequestUrl, config.snakeCase).respond(true);
            $httpBackend.expectPOST(expectedRequestUrl, config.snakeCase).respond(true);

            $http.put(expectedRequestUrl, config.camelCase);
            $http.post(expectedRequestUrl, config.camelCase);

            $httpBackend.flush();
            // Those 2 will fail of params don't match.
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        })
    );

});
