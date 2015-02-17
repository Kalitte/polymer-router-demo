var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var inline = require('gulp-inline');
var karma = require('gulp-karma');
var vulcanize = require('gulp-vulcanize');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync');
var gulpFilter = require('gulp-filter');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: __dirname + '/'
    },
    ghostMode: false,
    notify: false,
    debounce: 200,
    port: 9001,
    startPath: '/app/'
  });

  // gulp.watch([
  //   '!' + __dirname + '/app/components/**/*.*',
  //   __dirname + '/app/**/*.{js,html}'
  // ], {
  //   debounceDelay: 400
  // }, function() {
  //   browserSync.reload();
  // });
});

gulp.task('merge', function() {
  return gulp.src('app/index.html')
    .pipe(vulcanize({
      dest: './app',
      strip: true,
      csp: true
    }))
    .pipe(gulp.dest('publish'))
    .pipe(gulpFilter(['*.js']))
    .pipe(uglify())
    .pipe(gulp.dest('publish'));
});

gulp.task('sass-dev', function() {
  gulp.src(['app/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('app/css'));
});



gulp.task('sass-publish', function() {
  gulp.src(['app/scss/*.scss'])
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest('publish/css'));
});

gulp.task('css-publish', function() {
  gulp.src(['app/css/*.css'])
    .pipe(cssmin())
    .pipe(gulp.dest('publish/css'));
});

gulp.task('vendor', function() {
  gulp.src(['app/bower_components/webcomponentsjs/webcomponents.js',
    'app/bower_components/polymer/polymer.js',
    'app/bower_components/core-focusable/polymer-mixin.js',
    'app/bower_components/core-focusable/core-focusable.js',
    'app/bower_components/web-animations-js/web-animations-next-lite.min.js',
    'app/bower_components/app-states-ui/app-states-ui.js',
    'app/bower_components/app-states/app-states.js',
    'app/bower_components/app-states/core.js',
    'app/bower_components/marked/lib/marked.js',
    'app/elements/mark-down/highlight.pack.js',
    'app/bower_components/js-beautify/js/lib/beautify-html.js',
    'app/bower_components/js-beautify/js/lib/beautify.js'
  ], {
    base: './app'
  })
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('publish/'));
});



gulp.task('publish', ['merge', 'sass-publish', 'css-publish', 'vendor']);

gulp.task('default', ['browser-sync', 'sass-dev']);
