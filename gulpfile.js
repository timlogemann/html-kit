'use strict';

// Include gulp plugins
var path = require('path');
var del = require('del');
var gulp = require('gulp');
var chalk = require('chalk');
var sequence = require('run-sequence');
var postcss      = require('gulp-postcss');;
var autoprefixer = require('autoprefixer');
var atImport = require('postcss-import');
var clean      = require('postcss-clean');
var cssnano = require('cssnano');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('clean:src', function()  {
  return del([
    './js',
    './css',
    '*.json',
  ]);
});

gulp.task('clean:js', function()  {
  return del([
    './main.js',
  ]);
});

gulp.task('clean:css', function()  {
  return del([
    './main.css',
  ]);
});

//**************************************************
// Autoprefix and minify CSS
//**************************************************

gulp.task('css', function() {
  var plugins = [
    atImport({
      root: './css',
      // path: './components',
    }),
    autoprefixer({
      browsers: [
        'last 2 versions',
        'ie >= 11',
        'Safari >= 7'
      ]
    }),
    cssnano()
  ];

  return gulp.src('./css/main.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./'));
});


//**************************************************
// concat & uglify JavaScript
//**************************************************

gulp.task('javascript', function() {
  var options = {
    mangle: false,
    warnings: true,
    keep_fnames: true,
  }

  return (gulp
    .src('./js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'))
  );
});

//**************************************************
// Set up a new html page
//**************************************************

gulp.task('addPage', function() {
  return (
    gulp.src('default.html', { base: './templates' })
    .pipe(gulp.dest('./'))
  );
});

//**************************************************
// Default process
// cleans any existing output (not likely though)
// @fires after running 'npm install'
//**************************************************

gulp.task('default', function(done) {
  sequence(
    [
      'clean:css',
      'clean:js',
      'css',
      'javascript',
      'clean:src'
    ],
    done
  );
});


//**************************************************
// Watch process
// Keeps watching all the files while you change them
// @fires running 'npm start'
//*************************************************

gulp.task('watch', function() {
  sequence(
    [
      // 1. Clean minified files
      'clean:css',
      'clean:js',
    ],
    [
      // 2. Compile & build
      'css',
      'javascript',
    ],
  );

  // Log file changes to console
  function logFileChange(event) {
    var fileName = path.basename(event.path);

    console.log('[ ' + chalk.green('WATCH') + ' ] ' + chalk.magenta(fileName) + ' was ' + event.type + ', running tasks...');
  }

  // CSS Watch
  gulp.watch([ 'css/**/*.css' ], ['clean:css', 'css']).on('change', function(event) {
    logFileChange(event);
  });

  // JS Watch
  gulp.watch(['js/**/*.js' ], ['clean:js', 'javascript']).on('change', function(event) {
    logFileChange(event);
  });
});


//**************************************************
// Build process
// cleans the output, runs the tasks and removes the source
// Use this if you're ready to launch the project
// @fires running 'npm run build'
//**************************************************

gulp.task('build', function(done) {
  sequence(
    [
      'clean:css',
      'clean:js',
      'css',
      'javascript',
      'clean:src'
    ],
    done
  );
});