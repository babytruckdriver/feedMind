"use strict";

//var monk = require("monk");
//var wrap = require("co-monk");
var feedParser = require("co-feedparser");
//var request = require("koa-request");
var request = require("request");
var Readable = require("stream").Readable;
var log = require("../helper/logger.js");

//var db = monk("localhost/mydb");
//var words = wrap(db.get("words"));

/**
 * GET all the results.
 */
/*exports.all = function* () {
  if (this.request.query.word) {
    var res = yield words.find({word: this.request.query.word});
    this.body = res;
  } else {
    this.response.status = 404;
  }
};*/

/**
 * GET a single result.
 */
/*exports.single = function* () {

  if (this.request.query.word) {

    // Have I to compress the response?. Default = true
    this.compress = true;

    var res = yield words.findOne({word: this.request.query.word});
    this.body = res;
  } else {
    this.response.status = 404;
  }
};*/

var feedsDB = {
  tutsplus: "http://codeX.tutsplus.com/categories/javascript.atom",
  echojs: "http://www.echojs.com/rss",
  barrapunto: "http://barrapunto.com/index.rss"
}

exports.feed = function* () {
  let feedSource = this.request.query.source
    , feed
    , bodyParsed = [];

  if(feedSource && feedsDB[feedSource]) {

    // NOTE: I create my own thunk :) just for practice
    // Koa convert this in an Promise
    function myRequest(url) {
      return function (cb) {
        request(url, function(err, res, body) {
          if (res && res.statusCode === 200) {
            cb(null, body);
          } else {
            cb(err, null);
          }
        });
      };
    }

    try {
      feed = yield myRequest(feedsDB[feedSource]);
    } catch (err){
      throw err;
    }

    if(feed) {
      log.debug("Everything seems ok: " + feed.substring(0, 30));

      // Convierto el objeto response devuelto por request() en un stream, que es lo que necesita koa-feedParser.
      // koa-feedparser puede tomar como entrada una URL, pero no gestiona bien los errores en caso de que, por ejemplo, la URL no exista.
      let stream = new Readable();
      stream.push(feed);
      stream.push(null);

      let meta = yield feedParser(stream);
      let articles = meta.articles;

      for (let item of articles) {
        bodyParsed.push({url: item.guid, title: item.title});
      }

      this.body = bodyParsed;

    } else {
      throw new Error("The feed you request responds with a " + feed.statusCode + " code.");
    }

  } else {
    throw new Error("I can't get a working source..");
  }
};
