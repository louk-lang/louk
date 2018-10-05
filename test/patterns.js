var config = require("./config.js");
var file = config.file;

var louk = require(file("index.js"));
var chai = require("chai");
var assert = chai.assert;

var patterns = require(file("patterns"));

describe("Patterns", function(){
    it("should be defined", function(){
        assert.equal(typeof(patterns), "object");
        assert.notEqual(patterns, {});
    });
});
