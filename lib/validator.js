var validator = {
  nonEmpty: function(s) { return s && s.length > 0; },
  commaSeparatedList: function(s) {
    if (s == null) return false;
    if (typeof s != 'string') return false;
    try {
      var list = s.split(",")
      .map(function(t) { return t.trim(); })
      .filter(validator.nonEmpty);
    } catch (e) {
      this.log(e);
      return false;
    } finally {
      return true;
    }
  },
  number: function(s) {
    return typeof s === 'number';
  }
};

module.exports = validator;
