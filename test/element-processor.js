var config = require("./config.json");
var dir = config.testTarget;

function file(path) { return dir + path;}

var louk = require(file("index.js"));
var chai = require("chai");
var assert = chai.assert;

var elementProcessor = require(file("element-processor"));

describe("Element Processor", function(){
    it("should assign a closing tag", function(){
        var input = [
            {
                classification: 'tag',
                key: 'a',
                preceding: []
            }
        ];
        assert.equal(elementProcessor.assignMatches(input).length, 2);
    });
});
