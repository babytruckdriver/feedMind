// TODO importar y utilizar feedparser

"use strict";

var monk = require("monk");
var wrap = require("co-monk");
var FeedParser = require("co-feedparser");
var request = require("koa-request");

var db = monk("localhost/mydb");
var words = wrap(db.get("words"));

/**
 * GET all the results.
 */
exports.all = function* () {
  if (this.request.query.word) {
    var res = yield words.find({word: this.request.query.word});
    this.body = res;
  } else {
    this.response.status = 404;
  }
};

/**
 * GET a single result.
 */
exports.single = function* () {

  if (this.request.query.word) {

    // Have I to compress the response?. Default = true
    this.compress = true;

    var res = yield words.findOne({word: this.request.query.word});
    this.body = res;
  } else {
    this.response.status = 404;
  }
};

var feedsDB = {
  tutsplus: "http://codeX.tutsplus.com/categories/javascript.atom",
  echojs: "http://www.echojs.com/rss"
}

exports.feed = function* () {
  var feedSource = this.request.query.source
    , feed
    , feedparser
    , res;

  if(feedSource && feedsDB[feedSource]) {

    try {
      feed = yield request(feedsDB[feedSource]);
    } catch (err){
      console.log("*Error*> " + err.message);
      throw err;
    }

    if(feed.statusCode === 200) {
      console.log("Todo bien: " + feed.body.substring(0,40));
      //TODO parsear la respuesta
    } else {
      console.log("*Error. statusCode*> " + feed.statusCode);
      throw new Error("The feed you request responds with a " + feed.statusCode + " code.");
    }

  } else {
    throw new Error("I can't get a working source..");
  }
};
