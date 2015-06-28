var gulp = require('gulp'),
  uglify = require('gulp-uglify');

gulp.task('default', function(){
  gulp.src('ls.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});