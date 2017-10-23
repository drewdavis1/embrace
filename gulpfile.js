var gulp = require('gulp');

// gulp plugins and utils
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');


var scssInput = 'assets/scss/**/*.scss';
var cssOutput = 'assets/css';
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']    
}

var swallowError = function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

var nodemonServerInit = function () {
    livereload.listen();
};


gulp.task('build', ['scss'], function (/* cb */) {
    return nodemonServerInit();
});

gulp.task('scss', function () {    
    return gulp
        .src(scssInput)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        
        .pipe(autoprefixer(autoprefixerOptions))
        //.pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssOutput))
        .pipe(livereload());    
})


gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('assets/scss/**', ['scss']);
    gulp.watch('**/*.hbs', ['scss']);
});

gulp.task('zip', ['scss'], function() {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src(['**', '!node_modules', '!node_modules/**'])
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
});

gulp.task('default', ['build'], function () {
    gulp.start('watch');
});
