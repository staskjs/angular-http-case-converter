#ee.$http.CaseConverter [![Build Status](https://travis-ci.org/EE/angular-http-case-converter.png?branch=master)](https://travis-ci.org/EE/angular-http-case-converter) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Module provides a way to convert requests and responses on the fly in a drop-in manner.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

  - [How it works?](#how-it-works)
- [How to use?](#how-to-use)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How it works?

Module attaches [http interceptors](https://docs.angularjs.org/api/ng/service/$http#interceptors) which will transform 
request/response parts. It is configurable which requests/responses will be processed. By default all requests with 
parameters and all JSON responses are processed but you may use `eeHttpCaseConverterSettingsProvider` to change the 
semantics of conditions if you need to.

# How to use?

Decide what type of conversion you want to use. Currently the package provides modules:

- `ee.$http.CaseConverter.request.camelToSnake` that converts request params case from camel case used in the
  AngularJS application to snake case (a.k.a. underscore notation) used in the backend which is a default for many 
  popular backend REST API solutions such as [Symfony](http://symfony.com) 
  [FOSRestBundle](https://github.com/FriendsOfSymfony/FOSRestBundle) and 
  [Django Rest Framework](http://www.django-rest-framework.org/).
  
- `ee.$http.CaseConverter.response.snakeToCamel` that converts response JSON objects from snake case to camel case.

All you have to do is to depend your main module on the chosen package modules:

    var myApp = angular.module('app', [
        'ee.$http.CaseConverter.request.camelToSnake',
        'ee.$http.CaseConverter.response.snakeToCamel',
    ])

The most basic filtering of requests is already provided. By default 

* requests with `params` defined have `params` processed,
* POST and PUT requests (only those may have data) with `data` defined have `data` processed 
* each response returned as `application/json` is processed.

You may adjust those defaults by providing `urlFilter` function to `eeHttpCaseConverterSettingsProvider`. The function 
should return `true` for URLs which should be processed and false otherwise:

    myApp.config(function (eeHttpCaseConverterSettingsProvider) {
        eeHttpCaseConverterSettingsProvider.urlFilter = function (url) {
            // Your custom logic to decide whether process requests or not. Should return a boolean.
        }
    })
    
If URL filtering is not enough You may also use `caseConverterSettingsProvider` to define custom conditions under which 
processing takes place. If you wish only certain requests/responses to be process use:


    myApp.config(function (eeHttpCaseConverterSettingsProvider) {
        eeHttpCaseConverterSettingsProvider.requestConfig = {
            camelToSnake: {
                params: function (requestConfig) {
                    // Your custom logic to decide whether to process `params` or not. Should return a boolean.
                },
                data: function (requestConfig) {
                    // Your custom logic to decide whether to process `data` or not. Should return a boolean.
                }
            }
        }
        eeHttpCaseConverterSettingsProvider.responseConfig = {
            snakeToCamel: function (response) {
                // Your custom logic to decide whether to process `response.data` or not. Should return a boolean.
            }
        }
    })


#License

The module is available under the MIT license (see LICENSE for details).
