var gulp = require("gulp");
var mocha = require("gulp-mocha");

gulp.task("test", function() {
  return gulp.src("api/*test.js", {read: false})
    .pipe(mocha({reporter: "nyan"})); //reporters: dot, spec, tap, list, progress, json, HTMLCov, Doc...
});

// TODO: Automatizar la instalación con gulp
