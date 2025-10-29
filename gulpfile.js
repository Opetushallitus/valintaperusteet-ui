const gulp = require('gulp')
const livereload = require('gulp-livereload')
const { Server: KarmaServer, config: karmaConfig } = require('karma')
const path = require('path')
const sass = require('gulp-sass')(require('sass'))


var paths = {
    common: 'src/main/resources/webapp/common/',
    awesomeFontsOutput: 'src/main/resources/webapp/common/fonts/',
    awesomeFontsSrc: 'bower_components/fontawesome/fonts/**.*',
    fontAwesomeSrc: 'bower_components/fontawesome/css/font-awesome.min.css',
    fontAwesomeOutput: 'src/main/resources/webapp/common/css/',

    jslib: 'src/main/resources/webapp/common/jslib/',
    testSourceRoot: 'src/test/ui/',

    bower_components: [
        'bower_components/angular/angular.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular/angular.min.js.map',

        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-resource/angular-resource.min.js.map',

        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-route/angular-route.min.js.map',

        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-animate/angular-animate.min.js.map',

        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/angular-cookies/angular-cookies.min.js.map',

        'bower_components/jquery/dist/jquery.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery/dist/jquery.min.map',

        'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
        'bower_components/jquery.i18n.properites/jquery.i18n.properties.js',

        'bower_components/lodash/lodash.min.js',

        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',

        'bower_components/angular-ui-tinymce/src/tinymce.js',

        'bower_components/angular-cache/dist/angular-cache.js',
        'bower_components/angular-cache/dist/angular-cache.min.js',
        'bower_components/angular-cache/dist/angular-cache.min.map'

    ],
    livereloadSources: [
        'src/main/resources/webapp/app/**/*.*',
        'src/main/resources/webapp/common/css/other.css',
        'src/main/resources/webapp/common/css/virkailija.css',
        'src/main/resources/webapp/common/js/**/*.*',
        'src/main/resources/webapp/common/partials/**/*.*'
    ],
    css: 'src/main/resources/webapp/common/css/',
    sass: 'sass/valintaperusteet.scss',
    dev: [
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-mocks/angular-scenario.js'
    ],
    testfiles: [
        'src/main/resources/webapp/common/jslib/jquery.js',
        'src/main/resources/webapp/common/jslib/angular.js',
        'src/main/resources/webapp/common/jslib/*.js',
        '!src/main/resources/webapp/common/jslib/**/*.min.js',
        '!src/main/resources/webapp/common/jslib/ui-bootstrap-tpls-0.7.0.js',
        'src/main/resources/webapp/app/valintaperusteet.js',
        'src/main/resources/webapp/app/**/*.js',
        'src/main/resources/webapp/common/js/**/*.js',
        'src/test/ui/angular-mocks.js',
        'src/test/ui/unit/**/*.js'
    ]
};

gulp.task('sourceLibs', function () {
    return gulp
        .src(paths.bower_components, { allowEmpty: true })
        .pipe(gulp.dest(paths.jslib));
});

gulp.task('css', function () {
    return gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest(paths.css));
});

gulp.task('fontAwesomeCss', function () {
    return gulp
        .src(paths.fontAwesomeSrc)
        .pipe(gulp.dest(paths.fontAwesomeOutput));

});

gulp.task('icons', function() {
    return gulp
        .src(paths.awesomeFontsSrc)
        .pipe(gulp.dest(paths.awesomeFontsOutput));
});


gulp.task('testLibs', function () {
    return gulp
        .src(paths.dev, { allowEmpty: true })
        .pipe(gulp.dest(paths.testSourceRoot));
});

gulp.task('livereload', function () {
    livereload.listen({ quiet: true });

    const watcher = gulp.watch(paths.livereloadSources);
    watcher.on('all', (_event, filePath) => {
        livereload.changed(filePath);
    });

    return watcher;
});

gulp.task('test-singlerun', function () {
    try {
        // green test run will require mocks/stubs setup.
        process.env.CHROME_BIN = require('puppeteer').executablePath();
    } catch (e) {}
    return new Promise((resolve, reject) => {
        const server = new KarmaServer({
            configFile: path.resolve(__dirname, 'src/test/resources/ui/valintaperusteet.conf.js'),
            singleRun: true
        }, exitCode => {
            exitCode === 0 ? resolve() : reject(new Error(`Karma failed with code ${exitCode}`));
        });
        server.start();
    });
});

// Run tests
gulp.task('test-watch', function () {
    // Prefer Puppeteer’s Chromium if available;
    // green test run will require mocks/stubs setup.
    try { process.env.CHROME_BIN = require('puppeteer').executablePath(); } catch (e) {}

    const karmaConfPath = path.resolve(__dirname, 'src/test/resources/ui/valintaperusteet.conf.js');

    // Use parseConfig (Karma 6+), and override for watch mode
    return karmaConfig.parseConfig(
        karmaConfPath,
        { singleRun: false, autoWatch: true },
        { promiseConfig: true, throwErrors: true }
    ).then(cfg =>
        new Promise((resolve, reject) => {
            const server = new KarmaServer(cfg, code =>
                code === 0 ? resolve() : reject(new Error(`Karma exited with code ${code}`))
            );
            server.start();
        })
    );
});


// Default
gulp.task('default', gulp.series('test-singlerun', function(done) {
    done()
}));

// Development
gulp.task('dev', gulp.series('test-watch', 'css', 'livereload', function(done) {
    done()
}));

gulp.task('build', gulp.series('sourceLibs', 'testLibs', 'icons', 'fontAwesomeCss', function(done) {
    done()
}));
