coffee = heap.require('gulp-coffee')

module.exports = (profile = "default") ->
  cfg = config["coffee:" + profile]
  gulp.task cfg.taskName,
    coffee(cfg.src, cfg.dst, cfg.opts)
      .with(heap.sourcemaps()).if(cfg.sourceMap)
