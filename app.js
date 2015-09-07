"use strict";

var koa = require("koa");
var router = require("koa-router");
var mount = require("koa-mount");
var logger = require("koa-logger");
var limit = require("koa-better-ratelimit");
var compress = require("koa-compress");
var api = require("./api/api.js");

var app = koa();
var compressOpts = {
  filter: function(content_type) {
    return /text/i.test(content_type); // what things compress
  },
  threshold: 0.2 // minimum size to compress (in kb)
}


var APIv1 = new router();
APIv1.get("/all", api.all);
APIv1.get("/single", api.single);

// Middleware for displaying the working time
// Al usar el middleware koa-logger este ya no es necesario y por eso lo comento
/*app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  //this.set("X-Response-Time", ms + "ms");
  console.log("%s %s - %sms", this.method, this.url, ms);
});*/

// Middleware for catch all errors
app.use(function *(next) {
  try{
    yield next;
  } catch (err) {
    this.type = "json";
    this.status = err.status || 500;
    this.body = {"error" : "The application just went bonkers, hopefully NSA has all the logs :)"};

    //NOTE No sé qué hace hace esta instrucción. Sin ella la respuesta parece idéntica
    this.app.emit("error", err, this);
  }
});

// Middleware for limmit the number of requests from a given user (10 in 3 minuts)
app.use(limit({duration: 1000*60*3, //3 min
               max: 10, balcklist: []}));

// Middleware for add logging capabilities. Ej: <-- GET /v1/single?word=od 200 339ms 40b
app.use(logger());

// Middleware for compress the responses
app.use(compress(compressOpts));

// Middleware for handle the request and generate a response
app.use(mount("/v1", APIv1.middleware()));

module.exports = app;

if(!module.parent) app.listen(3000);
console.log("ioTest is running on http://localhost:3000");
