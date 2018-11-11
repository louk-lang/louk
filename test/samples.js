var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var markunit = require("markunit");
var fs = require('fs');

var sample1 = fs.readFileSync("./test/samples/sample1.louk", "utf8");
var sample2 = fs.readFileSync("./test/samples/sample2.louk", "utf8");
var sample3 = fs.readFileSync("./test/samples/sample3.louk", "utf8");

describe("Louk", function(){
    it("should not error on a real Louk file", function(){
        assert.notEqual(louk(sample1),'null');
        assert.notEqual(louk(sample2),'null');
        assert.notEqual(louk(sample3),'null');
    });
});
