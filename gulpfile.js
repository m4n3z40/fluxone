'use strict';

/**
 * Declaring the needed tools
 */
var paths = require('./configs/es5/paths'),
    serverConfig = require('./configs/es5/server'),
    gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    stylus = require('gulp-stylus'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    pm2 = require('pm2'),
    _ = require('lodash'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    runSequence = require('run-sequence');

/**
 * Declaring reusable configurations
 */
var env = process.env.NODE_ENV,
    isDevelopment = env === 'development',
    babelOptions = {
        optional: [
            'utility.inlineEnvironmentVariables',
            'utility.deadCodeElimination'
        ]
    },
    browserifyOptions = {
        entries: paths.clientJSEntryPoint,
        debug: true,
        transform: [babelify.configure(babelOptions)]
    },
    devBrowserifyOptions = _.assign({}, watchify.args, browserifyOptions),
    browserifyWatcher = isDevelopment ? watchify(browserify(devBrowserifyOptions)) : null;

//If in development and watcher is working
if (browserifyWatcher) {
    browserifyWatcher.on('update', devBundle);
    browserifyWatcher.on('log', gutil.log);
}

/**
 * Bundles the js files in development mode
 *
 * @return {void|*}
 */
function devBundle() {
    var b = browserifyWatcher || browserify(browserifyOptions);

    return b.bundle()
        .on('error', gutil.log)
        .pipe(source(paths.clientJSDestinyFile))
        .pipe(buffer())
        .pipe(gulp.dest(paths.clientJSDestinyFolder))
        .pipe(reload({stream: true}));
}

/**
 * Starts the server process
 */
gulp.task('start-server', function(done) {
    pm2.connect(function() {
        pm2.start(paths.serverEntryPoint, done);
    });
});

/**
 * Restart the server process
 */
gulp.task('restart-server', function(done) {
    pm2.connect(function() {
        pm2.restart(paths.serverEntryPoint, done);
    });
});

/**
 * Transforms es6 to es5 and bundles the app js together for the client to consume
 * Also reloads the connected browsers
 */
gulp.task('js:dev', devBundle);

/**
 * Transforms es6 to es5, jsx to js, bundles and minifies the app js together for the client to consume
 * Also generates the sourcemap
 */
gulp.task('js:prod', function() {
    return browserify(browserifyOptions)
        .bundle()
        .on('error', gutil.log)
        .pipe(source(paths.clientJSDestinyFile))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.clientJSDestinyFolder));
});

/**
 * Compiles the styles files into an app.css
 */
gulp.task('css:dev', function() {
    return gulp.src(paths.clientStylesEntryPoint)
        .on('error', gutil.log)
        .pipe(stylus())
        .pipe(gulp.dest(paths.clientStylesDestinyFolder))
        .pipe(reload({stream: true}));
});

/**
 * Compiles and minifies the styles files into an app.css
 */
gulp.task('css:prod', function() {
    return gulp.src(paths.clientStylesEntryPoint)
        .on('error', gutil.log)
        .pipe(sourcemaps.init())
        .pipe(stylus({ compress: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.clientStylesDestinyFolder));
});

/**
 * Runs the js:dev & css:dev tasks
 */
gulp.task('build:dev', ['js:dev', 'css:dev']);

/**
 * Runs the js:prod & css:prod tasks
 */
gulp.task('build:prod', ['js:prod', 'css:prod']);

/**
 * Runs the build task equivalent to the environment that we are in
 */
gulp.task('build', [isDevelopment ? 'build:dev' : 'build:prod']);

/**
 * Sets up an watcher that keeps the files up to date running all the needed tasks
 * Restarts the server and reloads the connected browsers with any change
 */
gulp.task('watch:dev', function(done) {
    gulp.watch(paths.developmentStylesWatchers, ['css:dev']);
    gulp.watch(paths.developmentJSWatchers, ['restart-server']);
    gulp.watch(paths.developmentLayoutsWatchers, reload);

    browserSync.init({ proxy: serverConfig[env].address + ':' + serverConfig[env].port });

    done();
});

/**
 * Sets up an watcher that keeps the files up to date running all the needed tasks
 * Restarts the server with any change
 */
gulp.task('watch:prod', function(done) {
    gulp.watch(paths.productionWatchers, ['build:prod', 'restart-server']);

    done();
});

/**
 * Runs the watch task depending on which environment we are in
 */
gulp.task('watch', [isDevelopment ? 'watch:dev' : 'watch:prod']);

/**
 * Runs the server in development mode
 */
gulp.task('serve:dev', function(done) {
    runSequence(
        'build:dev',
        'start-server',
        'watch:dev',
        done
    );
});

/**
 * Runs the server in production mode
 */
gulp.task('serve:prod', function(done) {
    runSequence(
        'build:prod',
        'start-server',
        'watch:prod',
        done
    );
});

/**
 * Runs the serve tasks depending on which environment we are in
 */
gulp.task('serve', [isDevelopment ? 'serve:dev' : 'serve:prod']);

/**
 * Run the default task: build
 */
gulp.task('default', ['build']);
