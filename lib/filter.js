var validator = require('./validator');

module.exports = {
  commaSeparatedList: function(l) {
    if (typeof l != 'string') return [];
    return l.split(",")
      .map(function(t) { return t.trim(); })
      .filter(validator.nonEmpty)
  }
}
