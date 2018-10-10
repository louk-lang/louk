var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var patterns = require(file("patterns")).default;

describe("Patterns", function(){
    it("should be defined", function(){
        assert.equal(typeof(patterns), "object");
        assert.notEqual(patterns, {});
    });
    it("should consist only of regular expression values", function(){
        Object.keys(patterns).forEach(function(key) {
            assert.equal(patterns[key] instanceof RegExp, true);
        });
    });
});
