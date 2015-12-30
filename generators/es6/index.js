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
    supportSourceMap: true,
    questions: [
      {
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
      },
      {
        type: 'confirm',
        name: '_useBabelRc',
        message: 'Use .babelrc file',
        default: true
      }
    ]
  },
  {
    _doWriting: function() {
      if (this.props._useBabelRc) {
        var babelOpts = this.gulpfile.getConfig('es6', this.profile, false).opts
        this.fs.writeJSON(this.destinationPath('.babelrc'), babelOpts);
      }
    },
    _doInstall: function() {
      var deps = this.props.presets.map(function(s) { return "babel-preset-" + s});
      this.npmInstall(deps, { saveDev: true });
    }
  });
