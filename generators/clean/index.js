'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.buildTask('clean', ["del"],
  {
    defaultSrc: "./clean/**/*.*",
    defaultDst: "./lib",
    ignoreSrc: false,
    ignoreDst: true,
    supportSourceMap: false,
    questions: [
      {
        type: 'confirm',
        name: 'force',
        message: 'Force',
        default: false,
      },
      {
        type: 'confirm',
        name: 'dryRun',
        message: 'Dry run',
        default: false
      }
    ]
  });
