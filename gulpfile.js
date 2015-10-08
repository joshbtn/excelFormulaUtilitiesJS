var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    del = require('del');

gulp.task('build', function() {
  return gulp.src('src/ExcelFormulaUtilities.js')
    .pipe(concat('src/ExcelFormulaUtilities.js'))
    .pipe(rename("excel-formula.js"))
    .pipe(gulp.dest('lib'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
