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
        .pipe(gulp.dest('src/css/'))
        .pipe(gulp.dest('css/'));
});

gulp.task('css', function () {
    gulp.src(['src/css/*.css'])
        .pipe(cssmin())
        .pipe(gulp.dest('css/'));
});


gulp.task('merge', function () {
    return gulp.src('src/index.html')
        .pipe(vulcanize({
            dest: 'src/index-merged.html',
            strip: true
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(jshint.extract('always'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function() {
  return gulp.src('src/index-merged.html')
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('index.html'));
});

gulp.task('minify', function() {
  return gulp.src('src/index-merged.html')
    .pipe(inline({
      base: 'src/',
      js: uglify()
    }))
    .pipe(gulp.dest('index.html'));
});


// watch
gulp.task('watch', function() {
  gulp.watch(files, ['lint', 'sass', 'css', 'merge', 'build', 'minify'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

// default
gulp.task('default', ['lint', 'sass', 'css', 'merge', 'build', 'minify']);

// Travis CI
gulp.task('ci', ['lint']);
