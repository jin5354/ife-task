var gulp = require('gulp');

var jshint = require('gulp-jshint');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');

gulp.task('lint', function(){
    gulp.src('./task001/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('style', function(){
    gulp.src('./task001/*.css')
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('./task001/css'))
        .pipe(notify({ message: 'Styles task complete.' }));
});

gulp.task('watch', function(){
    gulp.watch('./task001/*.css', ['style']);
    
});