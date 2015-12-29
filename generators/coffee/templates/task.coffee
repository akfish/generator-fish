coffee = heap.require('gulp-coffee')

gulp.task config.coffee.taskName,
  coffee(config.coffee.src, config.coffee.dst, config.coffee.opts)
    .with(heap.sourcemaps()).if(config.coffee.sourceMap)
