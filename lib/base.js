'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var GulpFile = require('./gulpfile-editor');

var Fish = yeoman.generators.Base.extend({
  constructor: function(args, opts) {
    yeoman.generators.Base.apply(this, arguments);
    var ns = opts.namespace.split(':')[1];
    this.isApp = ns === 'app';
    this.isStandalone = !opts.asSubGenerator || this.isApp;
    if (this.isStandalone) {
      var gf = new GulpFile(this.fs, this.log);
      // Optional app name arguments
      this.argument('_appname', {
        type: String,
        required: false
      });
      this.appname = this._appname || this.appname;
      // Select sub generators with options
      this.subGens = Fish.getSubGeneratorNames();
      this.selectedSubGens = [];
      if (this.isApp) {
        this.subGens.forEach(function(s) {
          this.option(s);
          // Added by options
          // or
          // Added in gulpfile previousely
          if (this.options[s] || gf.content.tasks.find(function (t) { return t.name === s; })) {
            this.selectedSubGens.push(s);
          }
        }, this);
        // Clean tasks in gulpfile for modification
        // gf.clearTasks();
      } else {
        // Sub-generators in standalone mode will only insert their own tasks
        this.selectedSubGens.push(ns);
      }
      this.gulpfile = gf;
    } else {
      this.gulpfile = opts.gulpfile;
    }
  },

  writing: function () {
    if (this.isStandalone) {
      var gf = this.gulpfile;
      // this.selectedSubGens.forEach(gf.addTask, gf);
      this.log('Writing gulpfile.coffee');
      this.gulpfile.write();
    }
  },

  install: function () {
    // this.installDependencies();
  }
});

Fish.getSubGeneratorNames = function() {
  var genDir = path.resolve(__dirname, '../generators');
  var subGens = fs.readdirSync(genDir).filter(function(s) {
    return ['app', 'fish'].indexOf(s) < 0;
  });
  return subGens;
}


module.exports = Fish;
module.exports.buildTask = require('./task');
