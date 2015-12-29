'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.buildTask('mocha', ["gulp-mocha"],
  {
    defaultSrc: "./mocha/**/*.spec.coffee",
    defaultDst: "./lib",
    ignoreSrc: false,
    ignoreDst: true,
    questions: []
  });
