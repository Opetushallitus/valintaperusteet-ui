// Karma configuration
// Generated on Mon Mar 17 2014 14:29:11 GMT+0200 (EET)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../..',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // test shims
            'test/resources/ui/shims/url-shim.js',

            // vendor libs (order matters)
            'main/resources/webapp/common/jslib/jquery.js',
            'main/resources/webapp/common/jslib/lodash.min.js',
            'main/resources/webapp/common/jslib/angular.js',
            'main/resources/webapp/common/jslib/angular-animate.js',
            'main/resources/webapp/common/jslib/angular-route.js',
            'main/resources/webapp/common/jslib/angular-cookies.js',
            'main/resources/webapp/common/jslib/angular-resource.js',
            'main/resources/webapp/common/jslib/angular-cache.js',

            // test stub + URL properties (stub first)
            'test/resources/ui/stubs/oph-url.stub.js',
            //'main/resources/webapp/app/valintaperusteet-ui-web-url_properties.js',

            // any remaining jslib helpers (if you need them)
            'main/resources/webapp/common/jslib/!(*angular*).js',

            // app sources
            'main/resources/webapp/common/modules/oph-roles/roleparser.js',
            'main/resources/webapp/app/valintaperusteet.js',
            'main/resources/webapp/common/modules/**/*.js',
            'main/resources/webapp/app/**/*.js',
            'main/resources/webapp/common/js/**/*.js',

            // test libs and specs last
            'test/resources/ui/angular-mocks.js',
            'test/resources/ui/unit/**/*.js'
        ],

        exclude: [
            // exclude minified angular cores to prevent double loading
            'main/resources/webapp/common/jslib/angular.min.js',
            'main/resources/webapp/common/jslib/angular-animate.min.js',
            'main/resources/webapp/common/jslib/angular-route.min.js',
            'main/resources/webapp/common/jslib/angular-cookies.min.js',
            'main/resources/webapp/common/jslib/angular-resource.min.js',
            // (keep this only if you aren't using the minified cookies/resource files)
            'main/resources/webapp/common/jslib/ui-boostrap-tpls-0.7.0.js',
            'test/resources/ui/valintaperusteet.conf.js'
        ],

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-coverage'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'junit'],

        junitReporter: {
            outputFile: 'target/karma_out/unit.xml'
        },

        coverageReporter: {
            type: 'html',
            dir: 'target/karma_out/coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [process.env.CI ? 'ChromeHeadlessNoSandbox' : 'ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-dev-shm-usage']
            }
        },

        captureTimeout: 120000,
        browserNoActivityTimeout: 120000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

    });
};
