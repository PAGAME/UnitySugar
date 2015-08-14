var gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber = require('gulp-plumber'),
  lispyscript = require('gulp-lispyscript'),
  //wisp = require('gulp-wisp'),
  jisp = require('gulp-jisp');


/*gulp.task('test', function(){
	gulp.src('ls.js')
		.pipe(uglify)
		.pipe(gulp.dest('dist/'));
});*/

/*gulp.task('function', function(){
	gulp.src('functions.coffee')
		.pipe(coffee())
		.pipe(gulp.dest('dist/'));
});*/

// Rerun the task when a file changes
/*gulp.task('watch', function() {
	gulp.watch('functions.coffee', ['function']);
  // gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.images, ['images']);
});*/

// The default task (called when you run `gulp` from cli)
//gulp.task('default', ['test', 'function', 'watch']);

var CoffeeSrc = '*/*.coffee';
var CoffeeDes = './';

gulp.task('toCoffee', function(){
	gulp.src(CoffeeSrc)
		.pipe(sourcemaps.init())
			.pipe(plumber())
			.pipe(coffee())
		.pipe(sourcemaps.write('./')) // create in current folder
		.pipe(gulp.dest(CoffeeDes));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch(CoffeeSrc, ['toCoffee']);
});



var LispySrc = 'lispy/*.ls';
var LispyDes = 'lispy';

gulp.task('toLispy', function() {
	gulp.src(LispySrc)
		.pipe(sourcemaps.init())
			.pipe(plumber())
			.pipe(lispyscript())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(LispyDes));
});
gulp.task('watch_Lispy',function() {
	gulp.watch(LispySrc, ['toLispy']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('coffee', ['toCoffee', 'watch']);

gulp.task('lispy', ['toLispy', 'watch_Lispy'])


var jispSrc = 'jisp/*.jisp';
var jispDes = 'jisp';

gulp.task('tojisp', function() {
	gulp.src(jispSrc)
		.pipe(sourcemaps.init())
			.pipe(plumber())
			.pipe(jisp())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(jispDes));
});
gulp.task('watch_jisp',function() {
	gulp.watch(jispSrc, ['tojisp']);
});
gulp.task('jisp', ['tojisp', 'watch_jisp'])