'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.buildTask('coffee', ['gulp-coffee'],
  {
    defaultSrc: "./coffee/**/*.coffee",
    defaultDst: "./lib",
    ignoreSrc: false,
    ignoreDst: false,
    questions: [{
      type: 'confirm',
      name: 'bare',
      message: '--bare',
      default: true
    }]
  });
