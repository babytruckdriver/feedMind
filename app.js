"use strict";

var koa = require("koa");
var logging = require("./helpers/log.js");
var app = koa();

// Logging config
var logObj = new logging(true);
var log = logObj.log.bind(logObj);

app.use(function* () {
    this.body = {note: "Am I really here?"};
    log("asdf");
});

app.listen("3000");
log("Server ready to play at http://localhost:3000");
