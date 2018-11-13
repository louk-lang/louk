var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));
var elementProcessor = require(file("element-processor"));

var fs = require('fs');

describe("Multiline", function(){
    it("should return a two-line element with whitespace", function(){
        assert.equal(louk('a b\n| c',{whitespace:true}),'<a>{{b}}{{c}}</a>');
    });
    it("should return a two-line element without whitespace", function(){
        assert.equal(louk('a b\n| c',{whitespace:false}),'<a>{{b}}{{c}}</a>');
    });
    it("should return a two-line element and single-line element with whitespace", function(){
        assert.equal(louk('a b\n| c\nd e',{whitespace:true}),'<a>{{b}}{{c}}</a>\n<d>{{e}}</d>');
    });
    it("should return a two-line element and single-line element without whitespace", function(){
        assert.equal(louk('a b\n| c\nd e',{whitespace:false}),'<a>{{b}}{{c}}</a><d>{{e}}</d>');
    });
    it.only("should return a three-line element with whitespace", function(){
        // console.log("<a>{{b}}{{c}}{{d}}</a>")
        assert.equal(louk('a b\n| c\n| d',{whitespace:true}),'<a>{{b}}{{c}}{{d}}</a>');
    });
    it("should return a three-line element without whitespace", function(){
        assert.equal(louk('a b\n| c\n| d',{whitespace:false}),'<a>{{b}}{{c}}{{d}}</a>');
    });
    it("should return two two-line elements with whitespace", function(){
        // console.log("<a>{{b}}{{c}}</a>\n<d>{{e}}{{f}}</d>")
        assert.equal(louk('a b\n| c\nd e\n| f',{whitespace:true}),'<a>{{b}}{{c}}</a>\n<d>{{e}}{{f}}</d>');
    });
    it("should return two two-line elements without whitespace", function(){
        assert.equal(louk('a b\n| c\nd e\n| f',{whitespace:false}),'<a>{{b}}{{c}}</a><d>{{e}}{{f}}</d>');
    });
    it("should disregard attributes following continuations with whitespace", function(){
        // console.log("<a>{{c}}</a>");
        assert.equal(louk('a\n| c\n#id',{whitespace:true}),'<a>{{c}}</a>');
    });
    it("should disregard attributes following continuations without whitespace", function(){
        assert.equal(louk('a\n| c\n#id',{whitespace:false}),'<a>{{c}}</a>');
    });
    it("should return a multiline element with a nested element with whitespace", function(){
        // console.log("<a>\n\t{{b}}\n\t<c>{{d}}</c>\n\t{{e}}\n</a>");
        assert.equal(louk('a b\n\tc d\n| e',{whitespace:true}),'<a>\n\t{{b}}\n\t<c>{{d}}</c>\n\t{{e}}\n</a>');
    });
    it("should return a multiline element with a nested element without whitespace", function(){
        assert.equal(louk('a b\n\tc d\n| e',{whitespace:false}),'<a>{{b}}<c>{{d}}</c>{{e}}</a>');
    });
    it("should return a multiline element with a multiline nested element with whitespace", function(){
        // console.log("<a>\n\t{{b}}\n\t<c>{{d}}{{e}}</c>\n\t{{f}}\n</a>")
        assert.equal(louk('a b\n\tc d\n\t| e\n| f',{whitespace:true}),'<a>\n\t{{b}}\n\t<c>{{d}}{{e}}</c>\n\t{{f}}\n</a>');
    });
    it("should return a multiline element with a multiline nested element without whitespace", function(){
        assert.equal(louk('a b\n\tc d\n\t| e\n| f',{whitespace:false}),'<a>{{b}}<c>{{d}}{{e}}</c>{{f}}</a>');
    });
    it("should return a multiline element with two nested elements with whitespace", function(){
        // console.log("<a>\n\t{{b}}\n\t<c>{{d}}{{e}}</c>\n\t<f>{{g}}</f>\n\t{{h}}\n</a>")
        assert.equal(louk('a b\n\tc d\n\t| e\n\tf g\n| h',{whitespace:true}),'<a>\n\t{{b}}\n\t<c>{{d}}{{e}}</c>\n\t<f>{{g}}</f>\n\t{{h}}\n</a>');
    });
    it("should return a multiline element with two nested elements without whitespace", function(){
        assert.equal(louk('a b\n\tc d\n\t| e\n\tf g\n| h',{whitespace:false}),'<a>{{b}}<c>{{d}}{{e}}</c><f>{{g}}</f>{{h}}</a>');
    });
    it("should handle multiline with multiple outdents with whitespace", function(){
        // console.log("<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n\t{{d}}\n</a>");
        assert.equal(louk('a\n\tb\n\t\tc\n| d',{whitespace:true}),'<a>\n\t<b>\n\t\t<c></c>\n\t</b>\n\t{{d}}\n</a>');
    });
    it("should handle multiline with multiple outdents without whitespace", function(){
        assert.equal(louk('a\n\tb\n\t\tc\n| d',{whitespace:false}),'<a><b><c></c></b>{{d}}</a>');
    });
});
