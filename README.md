# jquery-gulp-seed

This seed project is intended to help javascript and jquery developers streamline their work. 

_The project offers:_

1) A standard directory structure for front end apps.

2) Several gulp tasks already configured.

3) A development server and a production server.

4) Support for ECMAScript 2015.

5) Several essential node packages and bower components already installed, including jQuery and jQuery Validation.

6) A comprehensive `.gitignore` file.

7) A `.eslintrc.json` file with configuration that enforces best code practices.



## Features


## Install

`git clone https://github.com/Naxus28/jquery-gulp-seed.git`

`npm install` (runs development server in `postinstall`)

## Usage

build
```bash
$ gulp build
```

serve development (also runs `build` task)
```bash
$ gulp serve
```

serve production (also runs `build` task)
```bash
$ gulp serve:dist
```

When you write HTML, Sass, JavaScript, and jQuery and save the code Gulp will re-bundle the code and reload the server. As soon as the reload is finished you will see the changes you made on your code on the UI.


## New Gulp Tasks

Developers can add other gulp tasks if they need to. I just advise that they familiarize themselves with current tasks to make sure new tasks are registered in the right order to not break the pipeline.




