'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var inline = require('gulp-inline');
var karma = require('gulp-karma');
var vulcanize = require('gulp-vulcanize');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');

var files = ['src/*.js', 'src/*.html', 'src/**/*.scss', 'src/**/*css', 'tests/spec/*.js'];


gulp.task('sass', function () {
    gulp.src(['src/scss/*.scss'])
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('../polymer-router-demo-publish/css/'))
        .pipe(gulp.dest('css/'));
});

gulp.task('css', function () {
    gulp.src(['src/css/*.css'])
        .pipe(cssmin())
        .pipe(gulp.dest('css/'))
        .pipe(gulp.dest('../polymer-router-demo-publish/css/'));
});


gulp.task('merge', function () {
    return gulp.src('src/index.html')
        .pipe(vulcanize({
            dest: './'
        }))
        .pipe(gulp.dest('../polymer-router-demo-publish'));
});

gulp.task('lint', function() {
  return gulp.src(['src/js/**/*.js'])
    .pipe(jshint.extract('always'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function() {
  gulp.src(['components/webcomponentsjs/webcomponents.js',
            'components/polymer/polymer.js',
            'components/core-focusable/polymer-mixin.js',
            'components/core-focusable/core-focusable.js',
            'components/web-animations-js/web-animations-next-lite.min.js'], {base: '.'})
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('../polymer-router-demo-publish/Polymer/'));


  return gulp.src('index-merged.html')
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('../polymer-router-demo-publish'));
});

gulp.task('minify', function() {
  return gulp.src('index-merged.html')
    .pipe(inline({
      base: '.',
      js: uglify()
    }))
    .pipe(gulp.dest('../polymer-router-demo-publish'));
});


// watch
gulp.task('watch', function() {
  gulp.watch(files, ['lint', 'sass', 'css', 'merge', 'build', 'minify'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

// default
gulp.task('publish', ['sass', 'css', 'merge', 'build', 'minify']);

gulp.task('default', ['lint', 'sass', 'css', 'merge', 'build', 'minify']);



// Travis CI
gulp.task('ci', ['lint']);
