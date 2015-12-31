'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');
var validator = require('../../lib/validator');
var filter = require('../../lib/filter');

module.exports = Fish.buildTask('browserify', ["browserify","vinyl-source-stream","vinyl-buffer","gulp-uglify"],
  {
    defaultSrc: "./browserify/**/*.*",
    defaultDst: "./dist",
    ignoreSrc: true,
    ignoreDst: false,
    supportSourceMap: true,
    questions: [
      {
        type: 'input',
        name: '_bundleName',
        message: 'Bundle name',
        validate: validator.nonEmpty,
        default: 'app'
      },
      {
        type: 'input',
        name: 'entries',
        message: 'Entries',
        default: "",
        validate: validator.commaSeparatedList,
        filter: filter.commaSeparatedList
      },
      {
        type: 'input',
        name: 'extensions',
        message: 'Extensions',
        default: ".js",
        validate: validator.commaSeparatedList,
        filter: filter.commaSeparatedList
      },
      {
        type: 'input',
        name: 'transform',
        message: 'Transform',
        default: "",
        validate: validator.commaSeparatedList,
        filter: filter.commaSeparatedList
      },
      {
        type: 'confirm',
        name: '_uglify',
        message: 'Uglify',
        default: true
      }
    ]
  },
  {
    _doPrompt: function(done) {
      // Set debug flag to get source map
      this.props.debug = this.props.sourceMap;
      done();
    },
    _doInstall: function() {
      // Install transforms
      this.npmInstall(this.props.transforms, { saveDev: true } );
    }
  });
