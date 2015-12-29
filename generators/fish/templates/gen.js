'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.buildTask('<%= name %>', <%- JSON.stringify(deps) %>,
  {
    defaultSrc: "./<%= name %>/**/*.<%= ext %>",
    defaultDst: "./lib",
    ignoreSrc: <%= ignoreSrc %>,
    ignoreDst: <%= ignoreDst %>,
    questions: []
  });
