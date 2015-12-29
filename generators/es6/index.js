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
    questions: [{
      type: 'checkbox',
      name: 'presets',
      message: "Presets",
      choices: [
        "es2015",
        "stage-0",
        "stage-1",
        "stage-2",
        "stage-3",
        "react"
      ],
      default: ["es2015"]
    }]
  },
  {
    _doInstall: function() {
      var deps = this.props.presets.map(function(s) { return "babel-preset-" + s});
      this.npmInstall(deps, { saveDev: true });
    }
  });
