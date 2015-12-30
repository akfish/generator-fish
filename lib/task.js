'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('./base');
var _ = require('underscore');
var validator = require('./validator');
var filter = require('./filter');

function buildTask(name, devDeps, prompts, proto) {
  var defaultProto = {
    _promptTask: function(profile, done) {
      // Generic questions
      var genericQuestions = [];

      // Task name
      genericQuestions.push({
        type: 'input',
        name: 'taskName',
        message: 'Gulp task name',
        default: name + (profile === 'default' ? "" : ":" + profile)
      })

      // Source glob
      if (!prompts.ignoreSrc) {
        genericQuestions.push({
          type: 'input',
          name: 'src',
          message: 'Source globs',
          default: prompts.defaultSrc || "",
          validate: validator.commaSeparatedList,
          filter: filter.commaSeparatedList
        });
      }

      // Destination
      if (!prompts.ignoreDst) {
        genericQuestions.push({
          type: 'input',
          name: 'dst',
          message: "Destination",
          default: prompts.defaultDst || ""
        });
      }

      // Source map
      if (prompts.supportSourceMap) {
        genericQuestions.push({
          type: 'comfirm',
          name: 'sourceMap',
          message: 'Generate source map',
          default: true
        });
      }

      var questions = genericQuestions.concat(prompts.questions);

      // Override defaults with stored values
      var config = this.gulpfile.getConfig(name, this.profile, true);
      function toSafeStr(type, v) {
        if (type === 'input' && _.isArray(v)) {
          return v.join(",");
        }
        return v;
      }
      if (config) {
        questions.forEach(function(q) {
          q.default = toSafeStr(q.type, config[q.name] || q.default);
        });
      }

      this.prompt(questions, function (props) {
        this.props = props;
        if (this._doPrompt) this._doPrompt();
        this.gulpfile.setConfig(name, this.profile, props);

        done();
      }.bind(this));
    },
    prompting: function () {
      var done = this.async();

      // Have Yeoman greet the user.
      this.log("Task: " + name + (this.isStandalone ? " (standalone)" : ""));


      // Profile name
      this.prompt([{
        type: 'input',
        name: 'profile',
        message: 'Profile',
        default: 'default'
      }], function (answers) {
        var profile = answers.profile;
        if (!profile || profile === "") profile = "default";
        this.profile = profile;
        this._promptTask(profile, done);
      }.bind(this));

    },
    writing: function() {
      this.gulpfile.addTask(name, this.profile);
      Fish.prototype.writing.apply(this);
      this.fs.copyTpl(
        this.templatePath('task.coffee'),
        this.destinationPath('gulp-task/' + name + '.coffee'),
        this.props
      );
      if (this._doWriting) this._doWriting();
    },

    install: function () {
      this.npmInstall(devDeps, { saveDev: true });
      if (this._doInstall) this._doInstall();
    }
  };
  return Fish.extend(_.extend(defaultProto, proto));
}

module.exports = buildTask;
