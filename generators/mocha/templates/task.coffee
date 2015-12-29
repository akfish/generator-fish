mocha = heap.require('gulp-mocha')

gulp.task config.mocha.taskName, mocha(config.mocha.src, config.mocha.dst, config.mocha.opts)
