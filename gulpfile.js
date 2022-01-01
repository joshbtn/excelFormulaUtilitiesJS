var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    webpack = require('webpack-stream'),
    del = require('del'),
    fs = require('fs.extra'),
    paths = {
      scripts: ['src/core.js', 'src/ExcelFormulaUtilities.js'],
      siteScripts: ['js/page.js', 'js/beautifier.js'],
      css: ['bootstrap.min.css', 'css/*.css']
    };

gulp.task('update_jquery', function(){
  return gulp.src('node_modules/jquery/dist/jquery.min.*')
    .pipe(gulp.dest('js'));
})

gulp.task('update_bs_css', function(){
  return gulp.src('node_modules/bootstrap/dist/css/*.min.css')
    .pipe(gulp.dest('css'));
});

gulp.task('update_bs_js', function(){
  return gulp.src('node_modules/bootstrap/dist/js/*.min.js')
    .pipe(gulp.dest('js'));
});

gulp.task('update_bs_fonts', function(){
  return gulp.src('node_modules/bootstrap/dist/fonts/*')
    .pipe(gulp.dest('fonts'));
});

gulp.task('libs', gulp.series('update_jquery', 'update_bs_js', 'update_bs_css', 'update_bs_fonts'));

gulp.task('script-concat', function() {
  return gulp.src(paths.scripts)
  .pipe(webpack({
    mode: 'production',
    output: {
      filename: 'excel-formula.js',
    },
    optimization: {
      minimize: false
    }
  }))
  .pipe(gulp.dest('dist'))
});

gulp.task('script-minify', function() {
  return gulp.src(paths.scripts)
  .pipe(webpack({
    mode: 'production',
    output: {
      filename: 'excel-formula.js',
    }
  }))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist'))
});

gulp.task('scripts', gulp.series(['script-concat', 'script-minify']))

gulp.task('site', function() {
  return gulp.src(paths.siteScripts)
      .pipe(concat('page.js'))
      .pipe(concat('beautifier.js'))
      .pipe(gulp.dest('js/tmp'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('js'))
      .on('end', function(){
        fs.rmrfSync('js/tmp/')
      })
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.scripts, ['site']);
});

gulp.task('default', gulp.series('scripts'))
