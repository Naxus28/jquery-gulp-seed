/*
 * import config
 */
import config from './gulp.config';

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
    source = require('vinyl-source-stream'),
    wiredep = require('wiredep').stream;

/*
 * node environment variables
 * tasks check these variables to conditionally pipe plugins
 * environment is set on tasks 'set-dev' and 'set-prod', which run for the dev server and prod server respectively
 */
let development = plugins.environments.development,
    production = plugins.environments.production;

/*
 * output directory and filenames
 * these will be set conditionally on a gulp task to match the enviroment 
 * (i.e. '/development/styles.css' vs. '/dist/styles.min.css')
 * default to dev so we can run the 'build' task by itself
 */
let outputDir = config.paths.development, 
    outputCssFileName = 'styles.css',
    outputJsFileName = 'scripts.js'; 

/*
 * build
 */
gulp.task('build', ['clean', 'html', 'lint', 'scripts', 'sass', 'inject']);

/*
 * clean
 */
gulp.task('clean', () => {
  let dir = path.join(outputDir, '/**/*');
  return del(dir);
});

/*
 * html
 */
gulp.task('html', () => {
  gulp.src(config.srcFiles.htmlSrc)
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
  let jsSource = gulp.src(path.join(outputDir, '/js/', outputJsFileName), { read: false });
  let cssSource = gulp.src(path.join(outputDir, '/styles/', outputCssFileName), { read: false });
  let targetHtml = path.join(outputDir, '/**/*.html');

  return gulp.src(targetHtml)
    .pipe(plugins.inject(jsSource, injectOptions))
    .pipe(plugins.inject(cssSource, injectOptions))
    .pipe(gulp.dest(outputDir));
}); 

// to-do
gulp.task('wiredep-bower', function () {
  gulp.src(config.srcFiles.htmlSrc)
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(gulp.dest('./dest'));
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
 * sass
 */
gulp.task('sass', () => {
  let autoprefixerConfig = { browsers: ['last 2 versions'], cascade: false };
  
  gulp.src(config.srcFiles.sassSrc)
    .pipe(plugins.size({ title: 'SASS FILES SIZE:' }))
    .pipe(development(plugins.sourcemaps.init({ loadMaps: true }))) 
    .pipe(plugins.sass().on('error', plugins.notify.onError(config.notifyConfig('SASS'))))
    .pipe(plugins.autoprefixer(autoprefixerConfig))
    .pipe(plugins.concat(outputCssFileName))
    .pipe(plugins.header(config.headerMsg))
    .pipe(production(plugins.cssnano()))
    .pipe(development(plugins.sourcemaps.write('./')))
    .pipe(gulp.dest(path.join(outputDir, '/styles')))
    .pipe(production(plugins.size({ title: 'SASS BUNDLED FILES SIZE:' })));
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
    outputDir = config.paths.development;
    outputCssFileName = 'styles.css';
    outputJsFileName = 'scripts.js';
  } else {
    plugins.environments.current(production);
    outputDir = config.paths.dist;
    outputCssFileName = 'styles.min.css';
    outputJsFileName = 'scripts.min.js';
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
gulp.task('serve', ['set-dev', 'build', 'watch'], () => browserSyncInit(config.paths.development)); 

// production server
gulp.task('serve:dist', ['set-prod', 'build', 'watch'], () => browserSyncInit(config.paths.dist)); 


