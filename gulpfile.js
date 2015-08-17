var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify')
    del = require('del')
    rename = require('gulp-rename'),
    esLint = require('gulp-eslint'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel')
    liveReload = require('gulp-livereload')
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    notify = require('gulp-notify');


gulp.task('delete', function() {
    del(['build/*'], function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Files deleted');
        }
    });
});


gulp.task('style', function() {
    return gulp
        .src('css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(minifyCSS())
            .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('build'))
        .pipe(liveReload());
});

gulp.task('lint', function () {
    return gulp
        .src(['js/**/*.js'])
        .pipe(plumber())
        .pipe(esLint())
        .pipe(esLint.format())
        .pipe(esLint.failOnError());
});

gulp.task('script', function() {
    return gulp
        .src('js/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(concat('main.js'))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('build'))
        .pipe(liveReload());
});

gulp.task('php', function() {
    return gulp
        .src('*.php')
        .pipe(liveReload());
}); 

gulp.task('image', function() {
    return gulp.src('img/*')
        .pipe(imagemin({ 
            optimizationLevel: 3, 
            progressive: true, 
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()] 
        }))
        .pipe(gulp.dest('build/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('watch', function() {
    liveReload.listen();
    gulp.watch('css/**/*.scss', ['style']);
    gulp.watch('js/**/*.js', ['lint', 'script']);
    gulp.watch('**/*.php', ['php']);
    gulp.watch('img/**/*', ['php']);
});


gulp.task('default', ['delete', 'style', 'lint', 'script', 'image', 'watch']);
