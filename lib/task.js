'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('./base');
var _ = require('underscore');

function buildTask(name, devDeps, prompts, proto) {
  var defaultProto = {
    prompting: function () {
      var done = this.async();

      // Have Yeoman greet the user.
      this.log("Task: " + name + (this.standalone ? "(standalone)" : ""));

      // Generic questions
      var genericQuestions = [];

      // Task name
      genericQuestions.push({
        type: 'input',
        name: 'taskName',
        message: 'Gulp task name',
        default: name
      })

      // Source glob
      if (!prompts.ignoreSrc) {
        genericQuestions.push({
          type: 'input',
          name: 'src',
          message: 'Source glob',
          default: prompts.defaultSrc || ""
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

      var questions = genericQuestions.concat(prompts.questions);

      // Override defaults with stored values
      var config = this.gulpfile.getConfig(name, true);
      if (config) {
        questions.forEach(function(q) {
          q.default = config[q.name] || q.default;
        });
      }

      this.prompt(questions, function (props) {
        this.props = props;
        this.gulpfile.setConfig(name, props);

        done();
      }.bind(this));
    },
    writing: function() {
      Fish.prototype.writing.apply(this);
      this.fs.copy(
        this.templatePath('task.coffee'),
        this.destinationPath('gulp-task/' + name + '.coffee')
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
