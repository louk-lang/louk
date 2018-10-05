var config = require("./config.json");
var dir = config.testTarget;

function file(path) { return dir + path;}

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
