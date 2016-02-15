var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    del = require('del'), 
    paths = {scripts: ['src/core.js', 'src/ExcelFormulaUtilities.js']};


gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
      .pipe(concat('core.js'))
      .pipe(concat('excel-formula.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
});
