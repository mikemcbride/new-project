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
    del = require('del'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    bower = require('main-bower-files');

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
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}));
});

// concatenate and minify javascript
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream: true}));
});

// copy HTML files
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream: true}));
});

// clean up dist folder
gulp.task('clean', function(cb) {
  del(['dist/css', 'dist/js', 'dist/img', 'dist/lib'], cb)
});

// install main bower files. You still need to include these in your index.html. Path will be ./lib/component_name/main_file.ext
gulp.task('bower', function() {
  return gulp.src(bower(), { base: './bower_components' })
    .pipe(plumber())
    .pipe(gulp.dest('dist/lib'))
});

// build task to populate the dist folder
gulp.task('build', ['clean'], function() {
  gulp.start('bower', 'compile-less', 'scripts', 'html');
});

// watch task
gulp.task('watch', function() {
  gulp.watch('src/css/*.less', ['compile-less']);
  gulp.watch('src/css/main.css', ['bs-reload']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/js/*.js', ['scripts']);
});

// cleans dist, builds the files, starts a server, and watches files for changes
gulp.task('serve', ['clean', 'build', 'browser-sync', 'watch']);

// default task - calls serve
gulp.task('default', ['serve']);
