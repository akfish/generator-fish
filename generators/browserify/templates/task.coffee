source = heap.require('vinyl-source-stream')
buffer = heap.require('vinyl-buffer')
uglify = heap.require('gulp-uglify')
browserify = heap.convert((opts) ->
  require('browserify')(opts).bundle()).toTask()

cfg = config.browserify
gulp.task cfg.taskName,
  browserify(cfg.opts)
    .then(source("#{cfg.opts.bundleName}.js"))
    .then(buffer()).dest(cfg.dst)<% if (uglify) { %>
    .next(uglify()).with(heap.sourcemaps()).if(cfg.sourceMap)
    .rename("#{cfg.opts.bundleName}.min.js")
    .write(cfg.dst)<% } %>
