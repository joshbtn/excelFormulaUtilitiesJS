var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    del = require('del'),
    paths = {
      scripts: ['src/core.js', 'src/ExcelFormulaUtilities.js'],
      siteScripts: ['js/*.js'],
      css: ['bootstrap.min.css', 'css/*.css']
    };

gulp.task('libs', function(){
  gulp.src('node_modules/bootstrap/dist/js/*.min.js')
    .pipe(gulp.dest('js'));
  gulp.src('node_modules/jquery/dist/jquery.min.*')
    .pipe(gulp.dest('js'));
  gulp.src('node_modules/bootstrap/dist/css/*.min.css')
    .pipe(gulp.dest('css'));
  gulp.src('node_modules/bootstrap/dist/fonts/*')
    .pipe(gulp.dest('fonts'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
      .pipe(concat('core.js'))
      .pipe(concat('excel-formula.js'))
      .pipe(gulp.dest('dist'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
});

gulp.task('site', function() {
  return gulp.src(paths.siteScripts)
      .pipe(concat('page.js'))
      .pipe(concat('beautifier.js'))
      .pipe(gulp.dest('js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('js'))
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.scripts, ['site']);
});

gulp.task('default', ['scripts'])
