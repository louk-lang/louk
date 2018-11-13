var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));
var elementProcessor = require(file("element-processor"));

var fs = require('fs');

describe("Multiline", function(){
    it("should return a two-line element", function(){
        assert.equal(louk('a b\n| c',{whitespace:false}),'<a>{{b}}{{c}}</a>');
    });
    it("should return a two-line element and single-line element", function(){
        assert.equal(louk('a b\n| c\nd e',{whitespace:false}),'<a>{{b}}{{c}}</a><d>{{e}}</d>');
    });
    it("should return a three-line element", function(){
        assert.equal(louk('a b\n| c\n| d',{whitespace:false}),'<a>{{b}}{{c}}{{d}}</a>');
    });
    it("should return two two-line elements", function(){
        assert.equal(louk('a b\n| c\nd e\n| f',{whitespace:false}),'<a>{{b}}{{c}}</a><d>{{e}}{{f}}</d>');
    });
    it("should disregard attributes following continuations", function(){
        assert.equal(louk('a\n| c\n#id',{whitespace:false}),'<a>{{c}}</a>');
    });
    it("should return a multiline element with a nested element", function(){
        assert.equal(louk('a b\n\tc d\n| e',{whitespace:false}),'<a>{{b}}<c>{{d}}</c>{{e}}</a>');
    });
    it("should return a multiline element with a multiline nested element", function(){
        assert.equal(louk('a b\n\tc d\n\t| e\n| f',{whitespace:false}),'<a>{{b}}<c>{{d}}{{e}}</c>{{f}}</a>');
    });
    it("should return a multiline element with two nested elements", function(){
        assert.equal(louk('a b\n\tc d\n\t| e\n\tf g\n| h',{whitespace:false}),'<a>{{b}}<c>{{d}}{{e}}</c><f>{{g}}</f>{{h}}</a>');
    });
});
