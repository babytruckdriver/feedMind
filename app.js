"use strict";

var koa = require("koa");
var mount = require("koa-mount");
var logger = require("koa-logger");
var limit = require("koa-better-ratelimit");
var compress = require("koa-compress");
var router = require("koa-router");
var api = require("./api/api.js");

var app = koa();

var compressOpts = {
  filter: function(content_type) {
    return /text/i.test(content_type); // what things compress
  },
  threshold: 0.2 // minimum size to compress (in kb)
}

var routerAPIv1 = new router();
routerAPIv1.get("/all", api.all);
routerAPIv1.get("/single", api.single);
routerAPIv1.get("/feed", api.feed);

// Middleware for catch all errors
app.use(function *(next) {
  try{
    yield next;

    if(this.status !== 200) {
      this.body = {"error": "Something very wrong happens here :/ " +  this.status};
    }

  } catch (err) {
    this.type = "json";
    this.status = err.status || 500;
    this.body = {"error" : err.message};

    //NOTE "emit" emite una señal que puede ser recogida por un manejador (handler) ".on('error',...)
    this.app.emit("error", err, this);
  }
});

// Middleware for limmit the number of requests from a given user (10 in 3 minuts)
app.use(limit({duration: 1000*60*3, //3 mins
               max: 10, balcklist: []}));

// Middleware for add logging capabilities. Ej: <-- GET /v1/single?word=od 200 339ms 40b
app.use(logger());

// Middleware for compress the responses
app.use(compress(compressOpts));

// Middleware for handle the request and generate a response
app.use(mount("/v1", routerAPIv1.middleware()));

// This exports is for the mocha tests
module.exports = app;

if(!module.parent) app.listen(3000);
console.log("**feedMind** is running on http://localhost:3000. Enjoy using my API.");
