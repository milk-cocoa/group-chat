var gulp = require('gulp');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('js-task',function(){
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('exports/js/'));
});

gulp.task("js-lib-task",function(){
    return gulp.src("lib/js/*.js")
        .pipe(gulp.dest("exports/js/lib/"));
});

gulp.task('webserver', function() {
      gulp.src('exports')
        .pipe(webserver({
            livereload: false,
            directoryListing: false,
            open: true
        }));
});

gulp.task("watch",function(){
    return gulp.watch("src/js/**/*.js",["js-task"]);
});

gulp.task("default",["webserver", "watch", "js-task", "js-lib-task"]);
