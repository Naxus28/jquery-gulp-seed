const plugins = require('gulp-load-plugins')(),
    path = require('path');

/*
 * paths to parent directories
 */
const paths = {
  src: 'src',
  dist: 'builds/dist',
  development: 'builds/development'
};

/*
 * paths to source files directories
 */
const srcFiles = {
  htmlSrc: path.join(paths.src, '/**/*.html'),
  sassSrc: path.join(paths.src, '/styles/**/*.scss'),
  jsSrc: path.join(paths.src, '/js/**/*.js')
};

/*
 * header msg to insert on built/dev js and css files
 */
let headerMsg = '/*****This file is generated via gulp. Do not edit it.*****/\n\n';

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
  headerMsg,
  logCustomMessage,
  notifyConfig,
  paths,
  srcFiles
};