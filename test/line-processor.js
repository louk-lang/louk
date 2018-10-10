var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var lineProcessor = require(file("line-processor"));

describe("Line Processor", function(){
    it("should delete comments", function(){
        var input = [
            { raw: '//a', lineType: 'comment' },
            { raw: 'b', lineType: 'louk' }
        ];
        assert.equal(lineProcessor.deleteComments(input).length, 1);
    });
    it("should break lines", function(){
        assert.deepEqual(lineProcessor.breakLines("a\n\tb c"), ['a','\tb c']);
    });
    it("should objectify lines", function(){
        assert.deepEqual(lineProcessor.objectifyLines(["a","\tb"]),[ { raw: "a" }, { raw: "\tb" } ]);
    });
    it("should determine properties", function(){
        var lines = lineProcessor.determineProperties([ { raw: "a" }, { raw: "\tb" } ]);
        assert.equal(lines[0].crux, "a");
        assert.equal(lines[1].indent, 1);
    });
});
