# jquery-gulp-seed

This seed project is intended to help javascript and jquery developers streamline their work. 

_The project offers:_

1) A standard directory structure for front end apps.

2) Several gulp tasks already configured.

3) A development server and a production server.

4) Support for ECMAScript 2015 (including module loader using import/export).

5) Several essential node packages already installed, including jQuery and jQuery Validation.

6) An example of form validation using [jquery-validation](https://jqueryvalidation.org/).

6) A comprehensive `.gitignore` file.

7) A `.eslintrc.json` file with configuration that enforces best code practices.



## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project you need the following software installed on your system:

* [node.js and npm](https://nodejs.org/en/). Run `node -v` and `npm -v` on the terminal window to check if you have node and npm.

* [gulp cli](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md). Run `gulp -v` on the terminal window to check if you have gulp-cli.

* [ruby](https://www.ruby-lang.org/en/downloads/). Run `ruby -v` on the terminal window to check if you have ruby (macs come with a ruby installation).

* [sass](http://sass-lang.com/install). Run `sass -v` on the terminal window to check if you have sass (sass is a ruby gem; you need to have ruby on your system before you install sass).


### Installation

Open a terminal window and:

```bash
$ cd ~/Sites #or wherever you keep your projects

$ git clone https://github.com/Naxus28/jquery-gulp-seed.git

$ cd jquery-gulp-seed

$ npm install #npm postinstall will run bower install and serve /builds/development on port 3000 (http://localhost:3000)
```

## Understanding the app's structure

### Directory structure and config files

* Work must be done on the `/src` directory

* The `/builds` directory is only intended to serve the app. NO CODE SHOULD BE WRITTEN ON THIS DIRECTORY.

* `/bower_components` holds all bower components (packages) installed on this project

* `/node_modules` holds all node modules (packages) installed on this project

* `.babelrc` has the preset for babel transpilation

* `.gitignore` lists the directories and files that git will ignore when you push your code to the remote repo

* `bower.json` is used to manage and configure bower packages

* `.eslintrc.json` has rules to enforce good syntax on `.js` files. If you don't already have one you __need__ to install a linter plugin on your IDE to pick up these rules

* `package.json` is used to manage and configure node packages and to run node tasks 

* `karma.conf.js` is used to configure karma, a testing tool (see more about karma under "Tests" below)


### Gulp Files

* `gulp.config.js` has all configuration code used on gulp tasks

* `gulp.babel.js` has all gulp tasks 


## Development tasks

### Gulp: build and serve

Gulp is configured to build a "builds/development" directory and a "builds/dist (production)" directory


#### build the "builds/development" directory
```bash
$ gulp build
```

#### build and serve the "builds/development" directory
```bash
$ gulp serve
```

#### build and serve the "builds/dist" directory
```bash
$ gulp serve:dist
```

When you write HTML, Sass, JavaScript, and jQuery and save the code Gulp will re-bundle the code and reload the server. As soon as the reload is finished you will see the changes you made on your code on the UI.


## New Gulp Tasks

Developers can add other gulp tasks if they need to. I just advise that they familiarize themselves with current tasks to make sure new tasks are registered in the right order to not break the pipeline.

## Server Environments

Although you can develop while serving from the /dist directory, it is not recommended because production tasks such as minification and uglification of code are not necessary for development and may delay the gulp build by a couple of seconds on every 'save'.

## Tests

This project uses the [jasmine](https://jasmine.github.io/) testing framework and [karma](https://karma-runner.github.io/1.0/index.html), "...a tool which spawns a web server that executes source code against test code for each of the browsers connected." (https://karma-runner.github.io/) 

__Running tests__

You can run tests via command `gulp karma` (check `gulp.tests.js`). Feel free to use the karma-cli directly if you need to pass custom parameters to your test (https://karma-runner.github.io/1.0/intro/configuration.html).

__Installing the karma-cli (optional)__

On the terminal window run `npm install -g karma-cli` to be able to to run karma commands if you ever need to (http://karma-runner.github.io/1.0/intro/installation.html).

__Karma Config file__

You will find the configuration for karma on `karma.conf.js`. If for any reason you need to change the configuration during a test (you shouldn't need to) make sure you don't break any other test and communicate with team members before pushing your changes (https://karma-runner.github.io/1.0/config/configuration-file.html).

__Tests directory structure and filename__

To keep tests organized I suggest that:

*  Test's filename match the ".js" file whose functionality is being tested against. Test file names should follow this convention: "filename.spec.js" (i.e. a test for "form-validation.js" should be written on file "form-validation.spec.js")

* Tests be written in a sub-directory of the `./spec` directory whose name matches the "/js" sub-directory where the app's functionality is written .  

i.e. 

__js file__: `src/js/utilities/form-validation.js` 

__spec.js file__: `src/spec/utilities/form-validation.spec.js` (sample test included in the app)


## Built With

[node and npm](https://nodejs.org/en/) - Package (dependencies) management

[bower](https://bower.io/) - Package (dependencies) management

[gulp](http://gulpjs.com/) - An automating tool to streamline the development workflow

[javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - The browser's native scripting language

[jquery](https://jquery.com/) - Main frontend javascript library

[jquery-validation](https://jqueryvalidation.org/) - Form validation library

[lodash](https://lodash.com/) - A JavaScript utility library used for modularity and better performance

[jasmine](https://jasmine.github.io/) - A JavaScript unit testing framework

[karma](https://karma-runner.github.io/1.0/index.html) - A tool that executes source code against browsers


#### __About javascript and javascript libraries__

* This app supports es2015 syntax, including "import/export" statements through browserify. 

* If you need to perform front-end form validation you can use the "jquery-validation" plugin already installed to have access to out-of-the-box form validation methods.


## Author

**Gabriel Ferraz** | gabrielferraz27@gmail.com





