var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    karma = require('gulp-karma');
    //sass = require('gulp-sass');


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
