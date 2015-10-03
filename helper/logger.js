"use strict";

var bunyan = require("bunyan");

var level = (process.env["NODE_ENV"] === "development") ? "debug" : "info";
var log = bunyan.createLogger({name: "feedMind", level: level});

module.exports = log;
