var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    karma = require('gulp-karma');


var paths = {
    jslib: 'src/main/webapp/common/jslib/',
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

        'bower_components/angular-translate/angular-translate.js',

        'bower_components/jquery/dist/jquery.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery/dist/jquery.min.js.map',

        'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
        'bower_components/jquery.i18n.properites/jquery.i18n.properties.js',

        'bower_components/lodash/dist/lodash.underscore.js',

        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',

        'bower_components/angular-ui-tinymce/src/tinymce.js'

    ],
    livereloadSources: [
        'src/main/webapp/app/**/*.*',
        'src/main/webapp/common/css/other.css',
        'src/main/webapp/common/css/virkailija.css',
        'src/main/webapp/common/js/**/*.*',
        'src/main/webapp/common/partials/**/*.*'
    ],
    dev: [
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-mocks/angular-scenario.js'
    ],
    testfiles: [
        'src/main/webapp/common/jslib/jquery.js',
        'src/main/webapp/common/jslib/angular.js',
        'src/main/webapp/common/jslib/*.js',
        '!src/main/webapp/common/jslib/**/*.min.js',
        '!src/main/webapp/common/jslib/ui-bootstrap-tpls-0.7.0.js',
        'src/main/webapp/app/valintaperusteet.js',
        'src/main/webapp/app/**/*.js',
        'src/main/webapp/common/js/**/*.js',
        'src/test/ui/angular-mocks.js',
        'src/test/ui/unit/**/*.js'
    ]
};


// Default
gulp.task('default', function (callback) {
    runSequence('test-singlerun', callback);
});

// Development
gulp.task('dev', function (callback) {
    runSequence(['test-watch', 'livereload'], callback);
});


gulp.task('scripts', function () {
    return gulp
        .src(paths.bower_components)
        .pipe(gulp.dest(paths.jslib));
});

gulp.task('livereload', function () {
    return gulp
        .src(paths.livereloadSources)
        .pipe(watch())
        .pipe(livereload());
});

gulp.task('test-singlerun', function () {
    return gulp.src(paths.testfiles)
        .pipe(karma({
            configFile: 'src/test/ui/valintaperusteet.conf.js'
        }).on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        }));
});

// Run tests
gulp.task('test-watch', function () {
    return gulp.src(paths.testfiles)
        .pipe(karma({
            configFile: 'src/test/ui/valintaperusteet.conf.js',
            action: 'watch'
        }).on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        }));
});


