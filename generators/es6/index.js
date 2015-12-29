'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.buildTask('es6', ["gulp-babel"],
  {
    defaultSrc: "./es6/**/*.es6",
    defaultDst: "./lib",
    ignoreSrc: false,
    ignoreDst: false,
    questions: []
  });
