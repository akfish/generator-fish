# generator-fish [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> AKFish&#39;s generator

## Installation

First, install [Yeoman](http://yeoman.io) and generator-fish using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-fish
```

Then generate your new project:

```bash
yo fish
```

## Usage

In your project folder, run:
```bash
yo fish
```
Then follow the instructions.

Select tasks via CLI argument:
```bash
yo fish --coffee --mocha
```

Or run in standalone mode:
```bash
yo fish:coffee
```

Supported gulp tasks:
* coffee
* mocha
* es6(babel)
* browserify
* watch
* clean
* copy

(Optional) You can override configurations with CLI arguments passed to `gulp` command.

Run:
```bash
yo fish:cli
```
To configure CLI mapping.

## Getting To Know Yeoman

Yeoman has a heart of gold. He&#39;s a person with feelings and opinions, but he&#39;s very easy to work with. If you think he&#39;s too opinionated, he can be easily convinced. Feel free to [learn more about him](http://yeoman.io/).

## Development

### Add New Task

#### Run the internal `fish:fish` generator in `generator-fish` project folder:

```bash
yo fish:fish
```

#### Modify the generated `generators/#new#/index.js`
```js
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var Fish = require('../../lib/base');

module.exports = Fish.buildTask('coffee', ['gulp-coffee'],
  {
    defaultSrc: "./coffee/**/*.coffee",
    defaultDst: "./lib",
    ignoreSrc: false, // toggle `src` question
    ignoreDst: false, // toggle `dst` question
    supportSourceMap: true, // toggle `sourceMap` question
    questions: [
      {
        type: 'confirm',
        name: 'bare',
        message: '--bare',
        default: true
      },
    ]
  },
  {
    // TODO: custom prototype methods
  });
```

When running, the prompts will generate `props` in its 'flatten' form:
```js
{
  src: '',
  dst: '',
  // other fields
}
```

When stored to `gulpconfig.json` under the task's namespace, fields other than generic and private ones will be moved to `opts` field.
```js
{
  src: '',
  dst: '',
  // other fields
  opts: {
    // other fields
  }
}
```

The `opts` field will be used as gulp plugin options.

Notes:
* Generic questions will be asked before custom questions:
  - `taskName`
  - `src`, toggled by `ignoreSrc`
  - `dst`, toggled by `ignoreDst`
  - `sourceMap`, toggled by `supportSourceMap`
* Questions with `_` as prefix in their names are private.
* Special custom prototype methods:
  - `_doPrompt` - called right after `this.props` is set but before it's stored to `gulpconfig`
  - `_doWriting` - called after `gulpfile.coffee`, `gulpconfig.json` and task templates are written
  - `_doInstall` - called after `fish:app` and task's dependencies are installed

#### Modify the generated `generators/#new#/templates/task.coffee`

A typical `task.coffee` should be like this:

```coffee
# require dependencies
module.exports = (profile = 'default') ->
  cfg = config["name:#{profile}"]

  # gulp.task
```
* It's a template file with `this.props` as its parameters
* It should expose a function that takes `profile` name as the only option
* Following objects are exposed to global in `gulpfile.coffee`:
  - `gulp`
  - `heap` - `gulp-heap`
  - `config` - all configurations
* Task specific configurations are stored in `config[name:profile]`

## License

MIT © [akfish]()


[npm-image]: https://badge.fury.io/js/generator-fish.svg
[npm-url]: https://npmjs.org/package/generator-fish
[travis-image]: https://travis-ci.org/akfish/generator-fish.svg?branch=master
[travis-url]: https://travis-ci.org/akfish/generator-fish
[daviddm-image]: https://david-dm.org/akfish/generator-fish.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/akfish/generator-fish
