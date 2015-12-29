# require something

gulp.task config.<%= name %>.taskName,
  <%= name %>(config.<%= name %>.src, config.<%= name %>.dst, config.<%= name %>.opts)<% if (supportSourceMap) { %>
    .with(heap.sourcemaps()).if(config.<%= name %>.sourceMap)
  <% } %>
