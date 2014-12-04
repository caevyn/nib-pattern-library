var gulp      = require('gulp');
var sequence  = require('run-sequence');
var rimraf    = require('rimraf');
var builder   = require('nib-component-builder');
var open      = require('open');
var prefixer  = require('gulp-autoprefixer');

gulp.task('clean', function(done) {
  rimraf('build/', done)
});

gulp.task('metalsmith', function(done) {
  require('./metalsmith')(done);
});

gulp.task('component', function(done) {
  builder('components', {installDir: __dirname+'/build/components', buildDir:  __dirname+'/build/assets'}, function(errors) {
    if (errors.length) {
      done(errors[0]);
    } else {
      done();
    }
  });
});

gulp.task('autoprefix', function() {
  return gulp.src('build/assets/*.css')
    .pipe(prefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('build/assets'))
  ;
});

gulp.task('open', function() {
  open('./build/index.html')
});

gulp.task('watch', function() {

  gulp.watch(
    [
      'content/**',
      'templates/**'
    ],
    ['metalsmith']
  );

  gulp.watch('components/**', ['component']);

});

gulp.task('build', ['clean'], function() {
  sequence(
    ['metalsmith', 'component']
  );
});

gulp.task('default', ['clean'], function() {
  sequence(
    ['metalsmith', 'component'],
    ['autoprefix'],
    ['open']
  );
});
