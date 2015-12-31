'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.extend({
  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'selectedSubGens',
      message: 'Select gulp tasks: ',
      choices: this.subGens,
      default: this.selectedSubGens
    }];

    this.prompt(prompts, function (props) {
      this.selectedSubGens = props.selectedSubGens;
      this.props = props;
      this.log(this.selectedSubGens);

      done();
    }.bind(this));
  },
  runAll: function() {
    // Prepare stuff
    var opts = {
      gulpfile: this.gulpfile,
      asSubGenerator: true
    };

    // Run sub generators
    this.selectedSubGens.forEach(function(name) {
      this.composeWith("fish:" + name, {options: opts});
    }, this);
  },
  writing: function() {
    Fish.prototype.writing.apply(this);
  },

  install: function () {
    this.npmInstall(['gulp', 'gulp-heap@latest', 'coffee-script'], { 'saveDev': true });
  }
});
