'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');
var _ = require('underscore');
var inquirer = require('inquirer');
var GF = require('../../lib/gulpfile-editor').GF;

module.exports = Fish.buildTask('cli', ['underscore'],
  {
    defaultSrc: "./cli/**/*.*",
    defaultDst: "./lib",
    ignoreSrc: true,
    ignoreDst: true,
    supportSourceMap: false,
    ignoreTaskName: true,
    questions: []
  }, {
    _selectTask: function(done) {
      this.prompt([
        {
          type: 'list',
          message: 'Select a task',
          name: 'task',
          choices: ['GLOBAL', new inquirer.Separator()].concat(_.keys(this.taskMap))
        }
      ], function(answers) {
        this.selTask = answers.task;
        if (this.selTask === 'GLOBAL') {
          this._selectFields(done);
        } else {
          this._selectProfile(done);
        }
      }.bind(this));
    },
    _selectProfile: function(done) {
      this.prompt([
        {
          type: 'list',
          message: 'Select a profile',
          name: 'profile',
          choices: this.taskMap[this.selTask]
        }
      ], function(answers) {
        this.selProfile = answers.profile;
        this._selectFields(done);
      }.bind(this));
    },
    __getSelKey: function() {
      return this.selTask === 'GLOBAL' ? 'GLOBAL' : (this.selTask + ":" + this.selProfile);
    },
    __buildFields: function() {
      var keys;
      if (this.selTask === 'GLOBAL') {
        keys = [
          'src',
          'dst',
          'sourceMap'
        ];
      } else {
        var selCfg = this.gulpfile.getConfig(this.selTask, this.selProfile, false);
        keys = _.keys(_.omit(selCfg, GF.GENERIC_CONFIG_KEYS, 'opts'));
        keys = keys.concat(_.keys(selCfg.opts).map(function(k) { return "opts." + k; }))
      }
      var selMapping = this.props.mapping[this.__getSelKey()] || {};
      keys = keys.map(function(k) {
        var m = selMapping[k];
        return {
          name: k + (m ? chalk.bold("->") + chalk.underline(m) : ""),
          value: k
        };
      }, this)
      return keys;
    },
    _selectFields: function(done) {
      var keys = this.__buildFields(),
        key = this.__getSelKey(),
        selMapping = this.props.mapping[key] || (this.props.mapping[key] = {});
      this.prompt([
        {
          type: 'checkbox',
          message: 'Select fields to be mapped to CLI argument',
          name: 'fields',
          choices: keys
        },
        {
          type: 'input',
          message: 'CLI argument (leave empty to delete)',
          name: 'arg',
          when: function(answers) { return answers.fields.length > 0; },
          default: function(answers) {
            // Only provide a default value if all selected fields have identical stored values
            var fields = answers.fields, current;
            if (fields.length == 0) return "";
            current = selMapping[fields[0]];
            if (!current || current === "") return "";
            for (var i = 1; i < fields.length; i++) {
              if (current != selMapping[fields[i]]) return "";
            }
            return current;
          }
        }
      ], function(answers) {
        if (answers.fields.length > 0) {
          // store mapping
          answers.fields.forEach(function(f) {
            if (answers.arg && answers.arg != "") {
              selMapping[f] = answers.arg
            } else {
              // Delete if empty
              delete selMapping[f];
            }
          });
        }
        this._selectNextAction(done);
      }.bind(this))
    },
    _selectNextAction: function(done) {
      var choices = [
          'Continue mapping ' + this.__getSelKey(),
          'Select another profile in ' + this.selTask,
          'Select another task',
          'Exit'
        ].map(function(m, i) { return { name: m, value: i }}),
        actions = [
          this._selectFields.bind(this, done),
          this._selectProfile.bind(this, done),
          this._selectTask.bind(this, done),
          done
        ];

      if (this.selTask === 'GLOBAL') {
        choices.splice(1, 1);
      }

      this.prompt([
        {
          type: 'list',
          message: 'Select an action',
          name: 'action',
          choices: choices
        }
      ], function(answers) {
        actions[answers.action]();
      }.bind(this))
    },
    _doPrompt: function(done) {
      var taskMap = this.taskMap = {};
      var cfg = this.gulpfile.getConfig('cli', this.profile, false);
      this.props.mapping = cfg ? cfg.opts.mapping : {};

      this.gulpfile.content.tasks.forEach(function(t) {
        if (!taskMap[t.name]) taskMap[t.name] = [];
        taskMap[t.name].push(t.profile);
      })

      this.log(taskMap);

      this._selectTask(done);
    }
  });
