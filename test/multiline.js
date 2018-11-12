var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var fs = require('fs');

describe("Multiline", function(){
    it("should return a two-line element", function(){
        assert.equal(louk('a b\n| c'),'<a>{{b}}{{c}}</a>');
    });
    it.skip("should return a three-line element", function(){
        assert.equal(louk('a b\n| c\n| d'),'<a>{{b}}{{c}}{{d}}</a>');
    });
    it.skip("should return two two-line elements", function(){
        assert.equal(louk('a b\n| c\nd e\n| f'),'<a>{{b}}{{c}}</a><d>{{e}}{{f}}</d>');
    });
});
