var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	runSequence = require('run-sequence'),
	clean = require('gulp-clean'),
	watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),
	karma = require('gulp-karma');


var paths = {
	jslib: 'src/main/webapp/jslib/',
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

		'bower_components/jquery/dist/jquery.js',
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/jquery/dist/jquery.min.js.map',

		'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
		'bower_components/jquery.i18n.properites/jquery.i18n.properties.js',

		'bower_components/underscore/underscore.js',

		'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',

		'bower_components/angular-ui-tinymce/src/tinymce.js'
	],
	sources: [
		'src/main/webapp/css/virkailija.css',
		'src/main/webapp/css/other.css',
		'src/main/webapp/html/**',
		'src/main/webapp/js/**'
	]
}

// DEFAULT
gulp.task('default', function (callback) {
	runSequence('scripts', callback);
});

gulp.task('scripts', function () {
	return gulp
		.src(paths.bower_components)
		.pipe(gulp.dest(paths.jslib));
});

gulp.task('livereload', function () {
	return gulp
		.src(paths.sources)
		.pipe(watch())
		.pipe(livereload());
});

// Run tests
gulp.task('test', function () {
	return gulp.src(paths.unitTests)
		.pipe(karma({
			configFile: 'src/test/ui/valintaperusteet-test.conf.js',
			action: 'run'
		})
		.on('error', function (err) {
			throw err;
		}));
});