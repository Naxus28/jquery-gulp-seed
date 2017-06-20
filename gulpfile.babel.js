/*
 * import config
 */
import config from './gulp.config';

/*
 * require tests to be able to run tests on terminal
 */
require('./gulp.tests');

/*
 * plugins
 */
const buffer = require('vinyl-buffer'),
    browserSync = require('browser-sync'),
    browserify = require('browserify'),
    del = require('del'),
    glob = require('glob'),
    gulp = require('gulp'),
    path = require('path'),
    plugins = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream');


/*
 * ==node environment variables==
 * tasks check these variables to conditionally pipe plugins
 * environment is set on tasks 'set-dev' and 'set-prod', which run for the dev server and prod server respectively
 */
let development = plugins.environments.development,
    production = plugins.environments.production;

/*
 * ==output directory and output filenames for each environment==
 * i.e. '/development/styles.css' vs. '/dist/styles.min.css'
 * default to dev and set production values in 'set-prod' task
 */
let outputDir = config.dirPaths.development, 
    outputCssFileName = config.fileTypesForBuilds.dev.css,
    outputJsFileName = config.fileTypesForBuilds.dev.js;

/*
 * build
 */
gulp.task('build', ['clean', 'copy-font-awesome-fonts', 'font-awesome', 'html', 'lint', 'scripts', 'sass', 'inject']);

/*
 * clean
 */
gulp.task('clean', () => {
  let dir = path.join(outputDir, '/**/*');
  return del.sync(dir);
});

/*
 * html
 */
gulp.task('html', () => {
  return gulp.src(config.srcFiles.htmlSrc)
    .pipe(plugins.size({ title: 'HTML FILES SIZE:' }))
    .pipe(production(plugins.htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest(outputDir))
    .pipe(production(plugins.size({ title: 'HTML BUNDLED FILES SIZE:' })));
});

/*
 * inject
 */
gulp.task('inject', ['scripts', 'sass'], () => {
  let injectOptions = { addRootSlash: false, ignorePath: outputDir, relative: true };
  let fontAwesomeFile = path.join(outputDir, config.fontAwesome.destDirs.css, config.fileTypesForBuilds.fontAwesomeCss);
  let cssFile = path.join(outputDir, '/styles/', outputCssFileName);
  
  let jsSource = gulp.src(path.join(outputDir, '/js/', outputJsFileName), { read: false });
  let cssSource = gulp.src( [cssFile, fontAwesomeFile], { read: false });
  let targetHtml = path.join(outputDir, '/**/*.html');

  return gulp.src(targetHtml)
    .pipe(plugins.inject(jsSource, injectOptions))
    .pipe(plugins.inject(cssSource, injectOptions))
    .pipe(gulp.dest(outputDir));
}); 

/*
 * copy font-awesome source files (.eot, .svg, .ttf, .woff, .woff2)
 */
gulp.task('copy-font-awesome-fonts', () => {
  return gulp.src(path.join(config.fontAwesome.srcFiles.fonts))
     .pipe(plugins.size({ title: 'FONT-AWESOME FONTS FILES SIZE:' }))
     .pipe(gulp.dest(path.join(outputDir, config.fontAwesome.destDirs.fonts)))
     .pipe(production(plugins.size({ title: 'FONT-AWESOME FONTS BUNDLED FILES SIZE:' })));
});

/*
 * runs tasks for /bower_components/font-awesome
 */
gulp.task('font-awesome', () => {
  return gulp.src(config.fontAwesome.srcFiles.css)
    .pipe(plugins.size({ title: 'FONT-AWESOME FILES SIZE:' }))
    .pipe(plugins.header(config.headerMsg))
    .pipe(production(plugins.cssnano()))
    .pipe(gulp.dest(path.join(outputDir, config.fontAwesome.destDirs.css)));
});

/*
 * sass
 */
gulp.task('sass', () => {
  return gulp.src([config.srcFiles.sassSrc])
    .pipe(plugins.size({ title: 'SASS FILES SIZE:' }))
    .pipe(development(plugins.sourcemaps.init({ loadMaps: true }))) 
    .pipe(plugins.sass().on('error', plugins.notify.onError(config.notifyConfig('SASS'))))
    .pipe(plugins.autoprefixer(config.sassAutoprefixerConfig))
    .pipe(plugins.concat(outputCssFileName))
    .pipe(plugins.header(config.headerMsg))
    .pipe(production(plugins.cssnano()))
    .pipe(development(plugins.sourcemaps.write('./')))
    .pipe(gulp.dest(path.join(outputDir, '/styles')))
    .pipe(production(plugins.size({ title: 'SASS BUNDLED FILES SIZE:' })));
});

/*
 * scripts
 */
gulp.task('scripts', ['lint'], () => {
  let entries = glob.sync(config.srcFiles.jsSrc); // creates an array with the js files
  let browserifyCustomOpts = { entries, debug: true }; // 'entries' needs to be a string or an array
  
  return browserify(browserifyCustomOpts)
    .transform('babelify', { presets: ['es2015'] }) 
    .bundle()
    .on('error', plugins.notify.onError(config.notifyConfig('JAVASCRIPT')))
    .pipe(source(outputJsFileName)) // in memory bundled file
    .pipe(buffer()) // need to buffer to be able to use other js plugins
    .pipe(plugins.size({ title: 'JS FILES SIZE:' }))
    .pipe(plugins.header(config.headerMsg))
    .pipe(development(plugins.sourcemaps.init({ loadMaps: true }))) 
    .pipe(production(plugins.uglify()))
    .pipe(development(plugins.sourcemaps.write('./')))
    .pipe(gulp.dest(path.join(outputDir, '/js')))
    .pipe(production(plugins.size({ title: 'JS BUNDLED FILES SIZE:' })));
}); 

/*
 * lint js
 */
gulp.task('lint', () => {
  return gulp.src(config.srcFiles.jsSrc)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});


/*
 * watch
 */
gulp.task('watch', () => {
  gulp.watch(config.srcFiles.htmlSrc, () => runSequence('html', 'inject', 'reload'));
  gulp.watch(config.srcFiles.sassSrc, ['sass', 'reload']);
  gulp.watch(config.srcFiles.jsSrc, () => runSequence('scripts', 'reload'));
});

/*
 * reload servers
 */
gulp.task('reload', () => browserSync.reload());

/*
 * set environments
 */
let setEnvironment = (env) => {
  if (env === 'dev') {
    plugins.environments.current(development);
  } else {
    plugins.environments.current(production);
    outputDir = config.dirPaths.dist;
    outputCssFileName = config.fileTypesForBuilds.prod.minCss;
    outputJsFileName = config.fileTypesForBuilds.prod.minJs;
  }
};

gulp.task('set-dev', () => setEnvironment('dev')); 

gulp.task('set-prod', () => setEnvironment('prod')); 

/*
 * servers
 */
//initialize server
let browserSyncInit = (serveDir) => {
  browserSync({
    server: {
      baseDir: serveDir
    }
  });
};

// development server
gulp.task('serve', ['set-dev', 'build', 'watch'], () => browserSyncInit(config.dirPaths.development)); 

// production server
gulp.task('serve:dist', ['set-prod', 'build', 'watch'], () => browserSyncInit(config.dirPaths.dist)); 

