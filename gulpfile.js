// Import Plugins
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var autoprefixer= require('gulp-autoprefixer');
var zip         = require('gulp-zip');

// Set Global Variables
var scssInput   = 'assets/scss/**/*.scss';
var cssOutput   = 'assets/css';
var webHost     = 'localhost:2368'    

//Set Options
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']    
}

// Tasks

// Proxy + watching scss/hbs files
gulp.task('proxy', ['sass'], function() {

    browserSync.init({
        proxy: webHost
    });

    gulp.watch(scssInput, ['sass']);
    gulp.watch(["*.hbs", "partials/*.hbs"]).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(scssInput)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssOutput))
        .pipe(browserSync.stream());
});



// Zip template for distribution
gulp.task('zip', ['sass'], function() {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src(['**', '!node_modules', '!node_modules/**'])
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
});


gulp.task('default', ['proxy']);