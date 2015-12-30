'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.buildTask('copy', [],
  {
    defaultSrc: "",
    defaultDst: "",
    ignoreSrc: false,
    ignoreDst: false,
    supportSourceMap: false,
    questions: []
  });
