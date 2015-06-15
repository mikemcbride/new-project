// Gulp tasks

// Load plugins
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  })
});

gulp.task('bs-reload', function() {
  browserSync.reload();
})

// compile LESS to CSS
gulp.task('compile-less', function() {
  return gulp.src('src/css/main.less')
    .pipe(less())
    .pipe(rename('main.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify('LESS compiled and minified'))
    .pipe(browserSync.reload({stream: true}));
});

// concatenate and minify javascript
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }))
    .pipe(browserSync.reload({stream: true}));
});

// clean up dist folder
gulp.task('clean', function(cb) {
  del(['dist/css', 'dist/js', 'dist/img'], cb)
});

/* Serve Task
 *
 * Compiles LESS to CSS
 * Starts a server on port 3000
 * Watches LESS, HTML, and JS for changes and reloads browser on change
 */

gulp.task('serve', ['clean'], function() {
  gulp.start('compile-less', 'scripts', 'bs-reload', 'browser-sync');
  gulp.watch('src/css/*.less', ['compile-less']);
  gulp.watch('src/css/main.css', ['bs-reload']);
  gulp.watch('src/*.html', ['bs-reload']);
  gulp.watch('src/js/*.js', ['scripts']);
});

// default task - calls serve
gulp.task('default', ['serve']);
