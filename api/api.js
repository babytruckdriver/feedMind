// TODO importar y utilizar feedparser

"use strict";

var monk = require("monk");
var wrap = require("co-monk");
var FeedParser = require("feedparser");
var request = require("request");

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
  tutsplus: "http://code.tutsplus.com/categories/javascript.atom"
}

exports.feed = function* () {
  var feedSource = this.request.query.source
    , feed
    , feedparser;

  if(feedSource && feedsDB[feedSource]) {
    feed = request({"url": feedsDB[feedSource],
                    "proxy": ""});
    feedparser = new FeedParser();

    feed.on("error", function (error) {
      throw new Error("Error getting the feed. " + error);
    });
    feed.on("response", function (res) {
      var stream = this;
      console.log(">>>> " + res.statusCode);
      if (res.statusCode != 200) {
        return this.emit('error', new Error('Bad status code'));
      }

      stream.pipe(feedparser);
    });

    feedparser.on('error', function(error) {
      throw new Error("Error parsing the feed. " + error);
    });

    feedparser.on("readable", function() {
      var stream = this
        , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        , item
        , res;

      while (item = stream.read()) {
        res += item;
      }

      this.body = res;
    });

  } else {
    throw new Error("I can't get a working source..")
  }
};
