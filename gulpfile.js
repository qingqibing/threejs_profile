var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
    const plugins = [
        autoprefixer({ browsers: ['last 2 version', '>5%', 'ie 8'] }),
    ];
    return gulp.src('./source/sass/*.sass')
        .pipe(connect.reload())
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./docs/css'));
});

gulp.task('connect', function() {
   return connect.server({
       root: './docs',
       livereload: true
   }) ;
});

gulp.task('html', function() {
    return gulp.src('docs/*.html')
        .pipe(connect.reload());
});

gulp.task('babel', function() {
    return gulp.src('./source/js/*.js')
        .pipe(connect.reload())
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./docs/js'));
});

gulp.task('watch', function() {
    gulp.watch(['source/sass/*.sass', 'source/js/*.js', 'docs/*.html'], ['sass', 'babel', 'html']);
});

gulp.task('default', ['connect', 'watch']);