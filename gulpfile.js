const gulp = require('gulp');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const { exec } = require('child_process');

gulp.task('copy', () => {
  return gulp
    .src(['!src/img/icons/*', 'src/**/*', 'main.js', 'modules/**/*'])
    .pipe(gulp.dest('build/src'));
});

gulp.task('minify-js', () => {
  return gulp
    .src('build/src/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/src'));
});

gulp.task('minify-css', () => {
  return gulp
    .src('build/src/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/src'));
});

gulp.task('build', cb => {
  exec(
    './node_modules/.bin/electron-builder --mac',
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(error);
    }
  );

  exec(
    './node_modules/.bin/electron-builder --linux',
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(error);
    }
  );

  exec(
    './node_modules/.bin/electron-builder --windows',
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      cb(error);
    }
  );
});

gulp.task('compile', gulp.series('copy', 'minify-js', 'minify-css'));
