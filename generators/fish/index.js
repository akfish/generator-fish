'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var validator = require('../../lib/validator');
var filter = require('../../lib/filter');

function checkFish(fs) {
  if (!fs.exists('package.json')) {
    return false;
  }
  var p = fs.readJSON('package.json');
  return p.name === 'generator-fish';
}

module.exports = yeoman.generators.Base.extend({
  constructor: function(args, opts) {
    yeoman.generators.Base.apply(this, arguments);
    if (!checkFish(this.fs)) {
      throw new Error("Not in generator-fish project folder. fish:fish is reserved for internal usage only.")
    }
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log("Making a new fish");

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Name',
        default: "",
        validate: validator.nonEmpty
      },
      {
        type: 'input',
        name: 'ext',
        message: 'File extension',
        default: "*",
        validate: validator.nonEmpty
      },
      {
        type: 'input',
        name: 'deps',
        message: 'List of devDependencies',
        default: "",
        validate: validator.commaSeparatedList,
        filter: filter.commaSeparatedList
      },
      {
        type: 'confirm',
        name: 'ignoreSrc',
        message: 'Ignore source',
        default: false
      },
      {
        type: 'confirm',
        name: 'ignoreDst',
        message: 'Ignore destination',
        default: false
      },
      {
        type: 'confirm',
        name: 'supportSourceMap',
        message: 'Support source map',
        default: true
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      console.log(props);

      done();
    }.bind(this));
  },

  writing: function () {
    var genPath = "generators/" + this.props.name + "/";
    this.fs.copyTpl(
      this.templatePath('templates/task.coffee'),
      this.destinationPath(genPath + 'templates/task.coffee'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('gen.js'),
      this.destinationPath(genPath + 'index.js'),
      this.props
    );
  },

  install: function () {
  }
});
