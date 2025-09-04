var browserify = require('browserify'),
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  insert = require('gulp-insert'),
  jshint = require('gulp-jshint'),
  karma = require('karma'),
  package = require('./package.json'),
  replace = require('gulp-replace'),
  source = require('vinyl-source-stream');
  streamify = require('gulp-streamify'),
  uglify = require('gulp-uglify');

var srcDir = './src/';
var srcFiles = srcDir + '**.js';
var buildDir = './';

var header = "/*!\n\
 * chartjs-chart-financial\n\
 * Version: {{ version }}\n\
 *\n\
 * Copyright 2017 Ben McCann\n\
 * Released under the MIT license\n\
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md\n\
 */\n";

gulp.task('default', ['watch']);
gulp.task('build', buildTask);
gulp.task('jshint', jsHintTask);
gulp.task('watch', watchTask);

function buildTask() {
  var nonBundled = browserify('./src/index.js')
    .ignore('chart.js')
    .bundle()
    .pipe(source('Chart.Financial.js'))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', package.version)))
    .pipe(gulp.dest(buildDir))
    .pipe(streamify(uglify({
      preserveComments: 'some'
    })))
    .pipe(streamify(concat('Chart.Financial.min.js')))
    .pipe(gulp.dest(buildDir));

  return nonBundled;

}

function watchTask() {
  return gulp.watch(srcFiles, ['build', 'jshint']);
}

function jsHintTask() {
  return gulp.src(srcFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}
