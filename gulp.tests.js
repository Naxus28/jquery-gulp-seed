let gulp = require('gulp');
let Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('karma', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});