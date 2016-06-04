var gulp   = require('gulp'); // core gulp
var uncss  = require('gulp-uncss'); // removes unused css
var csso   = require('gulp-csso'); // minify css
var gzip   = require('gulp-gzip'); // gzip compression

gulp.task('uncss', function() {
  return gulp.src('build/assets/stylesheets/*.css')
    .pipe(uncss({
        html: ['build/**/*.html', 'build/*.html']
    }))
    .pipe(csso())
    .pipe(gulp.dest('./build/assets/stylesheets'))
    .pipe(gzip())
    .pipe(gulp.dest('./build/assets/stylesheets'));
});

// Scan site, remove unused css
gulp.task('buildcss', ['uncss']);
