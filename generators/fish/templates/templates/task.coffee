# require something

module.exports = (profile = "default") ->
  cfg = config["<%= name %>:" + profile]
  gulp.task cfg.taskName,
    <%= name %>(cfg.src, cfg.dst, cfg.opts)<% if (supportSourceMap) { %>
      .with(heap.sourcemaps()).if(cfg.sourceMap)
    <% } %>
