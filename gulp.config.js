const plugins = require('gulp-load-plugins')(),
    path = require('path');

/*
 * paths to main directories
 */
const dirPaths = {
  src: 'src',
  dist: 'builds/dist',
  development: 'builds/development'
};

/*
 * paths to source files
 */
const srcFiles = {
  htmlSrc: path.join(dirPaths.src, '/**/*.html'),
  sassSrc: path.join(dirPaths.src, '/styles/**/*.scss'),
  jsSrc: path.join(dirPaths.src, '/js/**/*.js')
};

/*
 * paths to font-awesome files/directories
 */
const fontAwesome = {
  srcFiles: {
    fonts: './bower_components/font-awesome/fonts/**',
    css: './bower_components/font-awesome/css/font-awesome.css'
  },
  destDirs: {
    fonts: '/styles/fonts/',
    css: '/styles/font-awesome/'
  }
};

/*
 * file extensions for different builds
 */
const fileTypesForBuilds = {
  dev: {
    css: 'styles.css',
    js: 'scripts.js'
  },
  prod: {
    minCss: 'styles.min.css',
    minJs: 'scripts.min.js'
  },
  
  fontAwesomeCss: 'font-awesome.css'
};

/*
 * header msg to insert on built/dev js and css files
 */
let headerMsg = '/*****This file is generated via gulp. Do not edit it.*****/\n\n';

/*
 * auto-prefixer for sass task
 */
let sassAutoprefixerConfig = { browsers: ['last 2 versions'], cascade: false };

/*
 * log messages
 */
let logCustomMessage = (customMessage) => {
  plugins.util.log(plugins.util.colors.blue(customMessage));
};

/*
 * notify plugin config--error handler
 */
let notifyConfig = (fileType) => {
  let config = {
    message: `ERROR ON ${fileType}: <%= error.message %>`,
    sound: false // deactivate Frog sound
  };

  return config;
};


/*
 * export module properties/functions
 */
export default {
  dirPaths,
  fileTypesForBuilds,
  fontAwesome,
  headerMsg,
  logCustomMessage,
  notifyConfig,
  sassAutoprefixerConfig,
  srcFiles
};