var gulp = require("gulp");
var mocha = require("gulp-mocha");
var eslint = require("gulp-eslint");

gulp.task("test", function() {
  return gulp.src("api/*test.js", {read: false})
    .pipe(mocha({reporter: "nyan"})); //reporters: dot, spec, tap, list, progress, json, HTMLCov, Doc...
});

gulp.task("lint", function () {
    return gulp.src("api/api.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// TODO: Automatizar la instalación con gulp
