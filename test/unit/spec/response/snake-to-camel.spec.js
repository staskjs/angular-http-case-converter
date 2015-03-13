describe('Package: ee.$http.CaseConverter.response, Module: snakeToCamel', function () {
    'use strict';

    beforeEach(module('ee.$http.CaseConverter.response.snakeToCamel'));

    it('should change snake_cased data in the JSON response', inject(function ($http, $httpBackend) {
        const expectedResponse = {
            foo_bar: 'foo bar data',
        };

        $httpBackend.expectGET('foo').respond(expectedResponse, {
            'content-type': 'application/json',
        });

        $http.get('foo').then(function (response) {
            expect(response.data.foo_bar).toBeUndefined();
            expect(response.data.fooBar).toBe(expectedResponse.foo_bar);
        });

        $httpBackend.flush();
    }));

    it('should also change snake_cased data in error cases', inject(function ($http, $httpBackend) {
      const expectedResponse = {
          foo_bar: 'foo bar data',
      };

      $httpBackend.expectGET('foo').respond(422, expectedResponse, {
          'content-type': 'application/json',
      });

      $http.get('foo').then(function (response) {
          expect(response.data.foo_bar).toBeUndefined();
          expect(response.data.fooBar).toBe(expectedResponse.foo_bar);
      });

      $httpBackend.flush();
    }));
});
