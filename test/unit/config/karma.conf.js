'use strict';

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        basePath: '../../../',
        files: [
            'test/unit/bower_components/angular/angular.js',
            'test/unit/bower_components/angular-mocks/angular-mocks.js',
            'src/**/*.defs.js',
            'test/unit/spec/**/*.defs.js',
            'test/**/*.json',
        ],
        preprocessors: {
            '**/*.json': 'json2js',
        },
        port: 8080,
        runnerPort: 9100,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        reporters: ['progress'],
        colors: true,
        captureTimeout: 60000,
        reportSlowerThan: 20,
    });
};
