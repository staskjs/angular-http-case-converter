module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks automatically and only necessary ones.
    // Those that doesn't match the pattern have to be provided here.
    require('jit-grunt')(grunt, {
        jscs: 'grunt-jscs-checker',
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        defs: {
            options: {
                transformDest: function transformDest(path) {
                    return path.replace(/\.js$/, '.defs.js');
                },
                defsOptions: {
                    disallowDuplicated: true,
                    disallowUnknownReferences: false,
                    disallowVars: true,
                },
            },
            src: {
                src: [
                    'src/**/*.js',
                    '!src/**/*.defs.js',
                ],
            },
            test: {
                src: [
                    'test/unit/spec/**/*.spec.js',
                    '!test/unit/spec/**/*.spec.defs.js',
                ],
            },
        },
        ngAnnotate: {
            all: {
                files: {
                    '.tmp/<%= pkg.name %>.js': ['src/**/*.defs.js'],
                },
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %>, <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            },
            build: {
                src: '.tmp/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js',
            },
        },
        copy: {
            dev: {
                src: '.tmp/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.js',
            },
        },
        clean: {
            defs: '**/*.defs.js',
            tmp: '.tmp',
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: '0.0.0.0',
                open: true,
            },
        },
        watch: {
            livereload: {
                files: [
                    'src/**/*.js',
                ],
                options: {
                    livereload: true,
                },
                tasks: ['build'],
            },
        },
        jshint: {
            options: {
                jshintrc: true,
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'src/**/*.js',
                    'test/unit/config/karma.conf.js',
                    'test/unit/spec/**/*.spec.js',
                ],
            },
        },
        jscs: {
            all: {
                src: '<%= jshint.all.src %>',
                options: {
                    config: '.jscs.json',
                },
            },
        },
        jsonlint: {
            all: {
                src: [
                    '*.json',
                    '{src,test}/**/*.json',
                ],
            },
        },
        'merge-conflict': {
            files: '<%= jshint.all.src %>',
        },
        karma: {
            options: {
                configFile: 'test/unit/config/karma.conf.js',
            },
            unit: {},
            live: {
                port: 8081,
                singleRun: false,
                background: true,
            },
        },
    });


    grunt.registerTask('lint', [
        'jshint',
        'jscs',
        'jsonlint',
        'merge-conflict',
    ]);

    grunt.registerTask('build', [
        'clean',
        'lint',
        'defs',
        'ngAnnotate',
        'copy:dev',
        'uglify',
        'clean:tmp',
    ]);

    grunt.registerTask('serve', [
        'build',
        'watch',
    ]);

    grunt.registerTask('test', [
        'lint',
        'defs',
        'karma:unit',
    ]);

    grunt.registerTask('default', [
        'serve',
    ]);
};
