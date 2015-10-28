var gulp = require('gulp');
var apidoc = require('gulp-apidoc');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var webpack = require('webpack');
var webpackConfiguration = require('./webpack.config.js');
var del = require('del');
require('babel/register');

/*** Unit tests ***/
gulp.task('lint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('mocha', function() {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log);
});

gulp.task('test', ['lint', 'mocha']);

/*** Documentation ***/
gulp.task('apidoc', function(done) {
  apidoc({
    src: 'src/',
    dest: 'doc/'
  }, done);
});

gulp.task('doc', ['apidoc']);

/*** Frontend ***/
gulp.task('webpack', function(callback) {
  // run webpack
  webpack(webpackConfiguration, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({}));
    callback();
  });
});

gulp.task('client', ['webpack']);

/*** Backend ***/
gulp.task('babel', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('copy', function() {
  return gulp.src(['src/**/*', '!src/**/*.js'])
    .pipe(gulp.dest('lib'));
});

gulp.task('server', ['babel', 'copy']);

/*** Wrap up ***/

gulp.task('watch', function() {
  gulp.watch(['src/**', 'test/**'], ['mocha', 'lint']);
});

gulp.task('clean', function() {
  return del([
    'dist/**/*',
    'lib/**/*'
  ]);
});

gulp.task('default', ['test', 'doc', 'client', 'server']);
