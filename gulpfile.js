const gulp = require('gulp')
const babel = require('gulp-babel')

gulp.task('build', () => {
  return gulp
    .src('./src/**/*.js')
    .pipe(babel({
      presets: ['babel-preset-env']
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('dev', function() {
  gulp.watch('./src/**/*.js', ['build'])
})

gulp.task('default', ['build'])
