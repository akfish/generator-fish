babel = heap.require('gulp-babel')

gulp.task config.es6.taskName,
  babel(config.es6.src, config.es6.dst)
    .with(heap.sourcemaps()).if(config.es6.sourceMap)
