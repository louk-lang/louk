var config = require("./config.js");
var file = config.file;

var louk = require(file("index.js"));
var chai = require("chai");
var assert = chai.assert;

var propertyDeterminer = require(file("property-determiner"));

describe("Property Determiner", function(){
    it("should identify line types", function(){
        assert.equal(propertyDeterminer.determineLineType({ unindented: '<a>' }), 'html');
        assert.equal(propertyDeterminer.determineLineType({ unindented: '//b' }), 'comment');
        assert.equal(propertyDeterminer.determineLineType({ unindented: 'c' }), 'louk');
    });
});
