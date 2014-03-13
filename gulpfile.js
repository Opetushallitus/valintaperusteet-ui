var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	runSequence = require('run-sequence'),
	clean = require('gulp-clean');


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

		'bower_components/underscore/underscore.js',

		'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',

		'bower_components/angular-ui-tinymce/src/tinymce.js'
	]
}

// DEFAULT
gulp.task('default', function(callback) {
	runSequence('scripts', callback);
});

gulp.task('scripts', function() {
    return gulp
		.src(paths.bower_components)
		.pipe(gulp.dest(paths.jslib));
});