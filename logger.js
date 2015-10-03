"use strict";

var bunyan = require("bunyan");
var log = bunyan.createLogger({name: "feedMind", level:"debug"});

module.exports = log;
