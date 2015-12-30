# require something

module.exports = (profile = "default") ->
  cfg = config["copy:" + profile]
  gulp.task cfg.taskName, ->
    gulp.src(cfg.src)
      .pipe(gulp.dest(cfg.dst))
