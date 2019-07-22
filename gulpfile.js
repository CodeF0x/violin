const gulp = require('gulp');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');

gulp.task('copy', () => {
  return gulp
    .src(['src/**/*.png', '!src/**/icons/*', 'src/**/*.html'])
    .pipe(gulp.dest('build'));
});

gulp.task('minify-js', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build'));
});

gulp.task('minify-css', () => {
  return gulp
    .src('src/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('build'));
});

gulp.task('compile', gulp.series('copy', 'minify-js', 'minify-css'));
