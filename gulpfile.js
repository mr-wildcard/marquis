var gulp = require("gulp");
var less = require("gulp-less");
var combiner = require('stream-combiner2');
var postcss = require('gulp-postcss');
var inject = require('gulp-inject');

gulp.task("dev-css", function () {

    // https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md
    var combined = combiner.obj([
        gulp.src( "assets/css/app.less" ),
        less(),
        postcss([
            require('autoprefixer-core')({ browsers: ['last 2 versions'] }),
        ]),
        gulp.dest("public/css")
    ]);

    // any errors in the above streams will get caught
    // by this listener, instead of being thrown:
    combined.on('error', console.error.bind(console));

    return combined;
});

gulp.task("watch", function () {
    gulp.watch( "assets/css/**/*.less", ["dev-css"] );
});

gulp.task('dev', function() {
    gulp.start('dev-css', 'watch');
});
