var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    del = require('del');

gulp.task('minify', function() {
  return gulp.src('src/*.js')
      .pipe(concat('excel-formula.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
      .pipe(notify({ message: 'Scripts task complete' }));
});
