var _ = require('underscore');
var GF = {
  Name: 'gulpfile.coffee',
  Config: 'gulpconfig.json',
  GENERIC_CONFIG_KEYS: ['taskName', 'src', 'dst', 'sourceMap'],
  SECTION_REGEX: /^#<\s(\w+)([\s\S]*?)^#>/gmi,
  DEP_REGEX: /(GLOBAL\.)?([\w\d_$]+)\s=\srequire\('(.*)'\)/gmi,
  TASK_REGEX: /require\('.\/gulp-task\/(.*)'\)\('(.*)'\)/gmi
};

function GulpFile(fs, logger) {
  this.fs = fs;
  GulpFile.log = this.log = logger;
  this.content = fs.exists(GF.Name)  ?
    GulpFile.parse(fs.read(GF.Name)) :
    GulpFile.buildDefault();
  this.config = fs.exists(GF.Config) ?
    fs.readJSON(GF.Config)           :
    {};
}

GulpFile.formatSection = function(name, items, itemFormatter) {
  return ["#< " + name]
    .concat(itemFormatter ? items.map(itemFormatter, this) : items)
    .concat(["#>"]);
};

GulpFile.formatDependency = function(dep) {
  return (dep.isGlobal ? "GLOBAL." : "")
    + dep.variable
    + " = require('"
    + dep.module
    + "')";
};

GulpFile.formatTask = function(task) {
  var profile = task.profile ?  "('" + task.profile + "')" : "()"
  return "require('./gulp-task/" + task.name + "')" + profile;
}

GulpFile.buildDefault = function() {
  var content = {
    deps: [
      {variable: 'gulp', module: 'gulp', isGlobal: true},
      {variable: 'heap', module: 'gulp-heap', isGlobal: true},
      {variable: 'config', module: './gulpconfig.json', isGlobal: true}
    ],
    tasks: [],
    contents: []
  };
  return content;
};

GulpFile.parseSections = function(src) {
  var m, sections = {};
  while (m = GF.SECTION_REGEX.exec(src)) {
    sections[m[1]] = m[2];
  }
  return sections;
};

GulpFile.tryParse = function(content, key, r, mapper) {
  var m, matches = [];
  if (!content[key]) {
    this.log("No '" + key + "' section in gulpfile.coffee");
  } else {
    while (m = r.exec(content[key])) {
      matches.push(mapper(m));
    }
  }
  content[key] = matches;
};

GulpFile.parseDependencies = function(content) {
  GulpFile.tryParse(content, 'deps', GF.DEP_REGEX, function(m) {
    return {
      isGlobal: m[1] != null,
      variable: m[2],
      module: m[3]
    }
  });
};

GulpFile.parseTasks = function(content) {
  GulpFile.tryParse(content, 'tasks', GF.TASK_REGEX, function(m) {
    return {
      name: m[1],
      profile: m[2]
    };
  });
};

GulpFile.parseContents = function(content) {
  content.contents = content.contents
    .split("\n")
    .map(function(s) { return s.trim(); })
    .filter(function(s) { return s.length > 0; });
}

GulpFile.parse = function(src) {
  var content = GulpFile.parseSections(src);

  GulpFile.parseDependencies(content);
  GulpFile.parseTasks(content);
  GulpFile.parseContents(content);

  return content;
};


GulpFile.prototype.toString = function() {
  var content = this.content,
    formatter = {
      deps: GulpFile.formatDependency,
      tasks: GulpFile.formatTask,
      contents: null
    };

  return ['deps', 'tasks', 'contents']
    .map(function(section) {
      return GulpFile.formatSection(section, content[section], formatter[section]);
    })
    .reduce(function(a, s) { return a.concat(s); }, [])
    .join("\n");
};

GulpFile.prototype.write = function() {
  this.fs.write(GF.Name, this.toString());
  this.fs.writeJSON(GF.Config, this.config);
};

GulpFile.prototype.addDependency = function(variable, m, isGlobal) {
  var deps = this.content.deps;
  if (deps.find(function(d) { return d.module === m; })) {
    this.log("Dependency '" + m + "' already exists");
    return;
  }

  deps.push({
    variable: variable,
    module: m,
    isGlobal: isGlobal
  });
  return this;
};

GulpFile.prototype.addTask = function(task, profile) {
  this.log("Add task " + task + ":" + profile);
  profile = profile || 'default';
  var tasks = this.content.tasks;
  if (tasks.find(function(t) { return t.name === task && t.profile === profile; })) {
    this.log("Task '" + task + "' already exists");
    return;
  }
  // TODO: handle priorities properly
  if (task === 'cli') {
    // CLI must run first
    tasks.unshift({name: task, profile: profile})
  } else {
    tasks.push({name: task, profile: profile});
  }
  return this;
};

GulpFile.prototype.clearTasks = function() {
  this.content.tasks = [];
};

GulpFile.prototype.setConfig = function(name, profile, value) {
  var key = name + ":" + profile;
  // Treat key with prefix _ as generic configs
  var privateKeys = _.keys(value).filter(function(k) { return k[0] === '_' }),
    ignoreKeys = GF.GENERIC_CONFIG_KEYS.concat(privateKeys);
  var v = _.pick(value, ignoreKeys);
  v.opts = _.omit(value, ignoreKeys);
  this.config[key] = v;
}

GulpFile.prototype.getConfig = function(name, profile, flatten) {
  var key = name + ":" + profile;
  var value = this.config[key];
  if (value && flatten) {
    var v = _.omit(value, ['opts']);
    value = _.extend(v, value.opts);
  }
  return value;
}

module.exports = GulpFile;
module.exports.GF = GF;
