'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');
var Rx = require('rx-lite');
var _ = require('underscore');
var validator = require('../../lib/validator');
var filter = require('../../lib/filter');

module.exports = Fish.buildTask('watch', [],
  {
    defaultSrc: "./watch/**/*.*",
    defaultDst: "./lib",
    ignoreSrc: true,
    ignoreDst: true,
    supportSourceMap: false,
    questions: []
  },
  {
    _promptWatchEntry: function(cb) {
      var watchPrompt = [
        {
          type: 'input',
          name: 'targets',
          message: 'Targets',
          validate: validator.commaSeparatedList,
          filter: filter.commaSeparatedList
        },
        {
          type: 'input',
          name: 'actions',
          message: 'Actions',
          validate: validator.commaSeparatedList,
          filter: filter.commaSeparatedList
        },
        {
          type: 'confirm',
          name: 'finished',
          message: 'Finished?',
          default: false
        }
      ];
      this.prompt(watchPrompt, cb);
    },
    _doPrompt: function(done) {
      this.props.watchEntries = [];
      function onWatchEntry(answers) {
        this.props.watchEntries.push(_.omit(answers, ['finished']));
        if (answers.finished) {
          this.log('done');
          this.log(this.props);
          done();
        } else {
          this._promptWatchEntry(onWatchEntry.bind(this));
        }
      }

      this._promptWatchEntry(onWatchEntry.bind(this));
    }
  }
  );
