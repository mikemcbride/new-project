// Gulp tasks

// Load plugins
var gulp = require('gulp');
var less = require('gulp-less');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./src"
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
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}));
});

/* Serve Task
 *
 * Compiles LESS to CSS
 * Starts a server on port 3000
 * Watches LESS, HTML, and JS for changes and reloads browser on change
 */

gulp.task('serve', ['compile-less', 'bs-reload', 'browser-sync'], function() {
  gulp.start('compile-less');
  gulp.watch('src/css/*.less', ['compile-less']);
  gulp.watch('src/css/main.css', ['bs-reload']);
  gulp.watch('src/*.html', ['bs-reload']);
  gulp.watch('src/js/*.js', ['bs-reload']);
});

// default task - calls serve
gulp.task('default', ['serve']);
