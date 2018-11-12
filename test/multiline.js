var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var fs = require('fs');

describe("Multiline", function(){
    // it("should return a two-line element", function(){
    //     assert.equal(louk('a b\n| c'),'<a>{{b}}{{c}}</a>');
    // });
    // it("should return a three-line element", function(){
    //     assert.equal(louk('a b\n| c\n| d'),'<a>{{b}}{{c}}{{d}}</a>');
    // });
    // it("should return two two-line elements", function(){
    //     assert.equal(louk('a b\n| c\nd e\n| f'),'<a>{{b}}{{c}}</a>\n<d>{{e}}{{f}}</d>');
    // });
    // it("should disregard attributes following continuations", function(){
    //     assert.equal(louk('a\n| c\n#id'),'<a>{{c}}</a>');
    // });
    // it("should return a multiline element with a nested element", function(){
    //     assert.equal(louk('a b\n\tc d\n| e',{whitespace:false}),'<a>{{b}}<c>{{d}}</c>{{e}}</a>');
    // });
});
