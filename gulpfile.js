const gulp = require('gulp');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const { exec } = require('child_process');

gulp.task('copy', () => {
  const filesToMove = [
    'main.js',
    'src/**/*',
    '!**/img/icons',
    '!**/img/icons/**/*',
    '**/img/icons/icon.png',
    'modules/**/*'
  ];
  return gulp.src(filesToMove, { base: './' }).pipe(gulp.dest('dist'));
});

gulp.task('minify-js', () => {
  gulp
    .src('dist/src/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('dist/src'));

  gulp
    .src('dist/*.js')
    .pipe(terser())
    .pipe(gulp.dest('dist'));

  return gulp
    .src('dist/modules/*.js')
    .pipe(terser())
    .pipe(gulp.dest('dist/modules'));
});

gulp.task('minify-css', () => {
  return gulp
    .src('dist/src/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/src'));
});

gulp.task('build', cb => {
  exec('electron-builder --mac', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(error);
  });

  exec('electron-builder --linux', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(error);
  });

  exec('electron-builder --windows', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(error);
  });
});

gulp.task('compile', gulp.series('copy', 'minify-js', 'minify-css'));
gulp.task('all', gulp.series('compile', 'build'));
