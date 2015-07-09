var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  coffee = require('gulp-coffee');

gulp.task('test', function(){
	gulp.src('ls.js')
		.pipe(uglify)
		.pipe(gulp.dest('dist/'));
});

gulp.task('function', function(){
	gulp.src('functions.coffee')
		.pipe(coffee())
		.pipe(gulp.dest('dist/'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('functions.coffee', ['function']);
  // gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['test', 'function', 'watch']);