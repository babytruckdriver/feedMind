var request = require("supertest");
var api = require("../app.js");

describe("GET /v1/feed", function() {
  it("should respond with an array of url/title pairs", function (done) {
    var app = api;

    request(app.listen())
      .get("/v1/feed")
      .query({source: "echojs"})
      .set("Accept.Encoding", "gzip")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        try {
          if(!("url" in res.body[0])) {
            throw new Error("missing url. The response don't seem to be a correct one.");
          }
          done();
        } catch(err) {
          done(err)
        }
      });
  })
})

describe("GET /v1/feed", function() {
  it("should respond with a JSON objet error", function (done) {
    var app = api;

    request(app.listen())
      .get("/v1/feed")
      .query({source: "xxxx"})
      .set("Accept.Encoding", "gzip")
      .expect("Content-Type", /json/)
      .expect(500)
      .end(function(err, res) {
        try {
          if (!("error" in res.body)) {
            throw new Error("missing error. The error don't seem to be a correct one.");
          }
          done();
        } catch(err){
          done(err);
        }
      });
  })
})

/*describe("GET /v1/all", function() {
  it("should respond with all the words", function (done) {
    var app = api;

    request(app.listen())
      .get("/v1/all")
      .query({ word: "new"})
      .set("Accept.Encoding", "gzip")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  })
})*/

/*describe('GET /v1/single', function () {
  it('should respond with a single result', function (done) {
    var app = api;

    request(app.listen())
      .get('/v1/single')
      .query({word: 'new'})
      .set('Accept-Encoding', 'gzip')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) throw err;
        else {
          if (!('_id' in res.body)) return "missing id";
          if (!('word' in res.body)) throw new Error("missing word");
          done();
        }
      });
  })
})*/
