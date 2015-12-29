'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');
var validator = require('../../lib/validator');
var filter = require('../../lib/filter');

module.exports = Fish.buildTask('mocha', ["gulp-mocha"],
  {
    defaultSrc: "./mocha/**/*.spec.coffee",
    defaultDst: "./lib",
    ignoreSrc: false,
    ignoreDst: true,
    supportSourceMap: false,
    questions: [
      {
        type: 'list',
        name: 'ui',
        message: 'UI',
        choices: ["bdd", "tdd", "qunit", "exports"],
        default: "bdd"
      },
      {
        type: 'input',
        name: 'reporter',
        message: 'Reporter',
        default: 'spec',
        validate: validator.nonEmpty
      },
      {
        type: 'input',
        name: 'globals',
        message: 'Globals',
        default: "",
        validate: validator.commaSeparatedList,
        filter: filter.commaSeparatedList
      },
      {
        type: 'input',
        name: 'require',
        message: 'Require custom modules',
        default: "",
        validate: validator.commaSeparatedList,
        filter: filter.commaSeparatedList
      },
      {
        type: 'input',
        name: 'timeout',
        message: 'Timeout',
        default: 2000,
        validate: validator.number
      },
      {
        type: 'comfirm',
        name: 'bail',
        message: 'Bail on the first fail',
        default: false
      },
      {
        type: 'comfirm',
        name: 'ignoreLeaks',
        message: 'Ignore global leaks',
        default: false
      }
    ]
  });
