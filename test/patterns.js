var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var patterns = require(file("patterns")).default;

describe("Patterns", function(){
    it("should be defined", function(){
        assert.equal(typeof(patterns), "object");
        assert.notEqual(patterns, {});
    });
    it("should consist only of regular expression values", function(){
        Object.keys(patterns).forEach(function(key) {
            assert.equal(patterns[key] instanceof RegExp, true);
        });
    });
    it("should match a prefix", function(){
        assert.equal(":abc".match(patterns.prefix)[1], ":");
        assert.equal("abc:".match(patterns.prefix), null);
    });
    it("should match a static prefix", function(){
        assert.equal("\"abc".match(patterns.staticPrefix)[1], "\"");
        assert.equal("\'abc".match(patterns.staticPrefix), null);
    });
    it("should match a suffix", function(){
        assert.equal("abc/".match(patterns.suffix)[1], "/");
        assert.equal("abc\\".match(patterns.suffix), null);
    });
    it("should match a static suffix", function(){
        assert.equal("abc,".match(patterns.staticSuffix)[1], ",");
        assert.equal("abc.".match(patterns.staticSuffix), null);
    });
    it("should match a plain crux", function(){
        assert.equal("abc".match(patterns.plainCrux)[1], "abc");
    });
    it("should match a modified crux", function(){
        assert.equal("abc def".match(patterns.modifiedCrux)[1], "abc");
        assert.equal("abc".match(patterns.modifiedCrux), null);
    });
    it("should match a static crux", function(){
        assert.equal(".abc".match(patterns.staticCrux)[1], ".");
        assert.equal("abc.".match(patterns.staticCrux), null);
    });
    it("should match a section crux", function(){
        assert.equal("abc,".match(patterns.sectionCrux)[0], "abc,");
        assert.equal("abc$".match(patterns.sectionCrux), null);
    });
    it("should match a fill", function(){
        assert.equal("abc def".match(patterns.fill)[1], "def");
        assert.equal("#def".match(patterns.fill), null);
    });
    it("should match a static fill", function(){
        assert.equal("#def".match(patterns.staticFill)[1], "def");
        assert.equal("abc def".match(patterns.staticFill), null);
    });
    it("should match a key", function(){
        assert.equal(":abc".match(patterns.key)[0], ":abc");
        assert.equal("&abc".match(patterns.key), null);
    });
    it("should match a Louk language attribute", function(){
        assert.equal("\"lang louk".match(patterns.loukLangAttribute)[0], "\"lang louk");
        assert.equal("\"lang stylus".match(patterns.loukLangAttribute), null);
    });
    it("should match an unindented element", function(){
        assert.equal("a".match(patterns.unindentedElement)[0], "a");
        assert.equal(" a".match(patterns.unindentedElement), null);
    });
    it("should match a comment", function(){
        assert.equal("//abc".match(patterns.comment)[1], "abc");
        assert.equal("/abc".match(patterns.comment), null);
    });
    it("should match an empty line", function(){
        assert.equal(" \t  ".match(patterns.emptyLine)[0], " \t  ");
        assert.equal("   a".match(patterns.emptyLine), null);
    });
    it("should match an html line", function(){
        assert.equal("<".match(patterns.html)[0], "<");
        assert.equal("> ".match(patterns.html), null);
    });
    it("should match an initial space", function(){
        assert.equal(" abc".match(patterns.initialSpace)[0], " ");
        assert.equal("abc".match(patterns.initialSpace), null);
    });
    it("should match whitespace", function(){
        assert.equal(" \ta".match(patterns.whitespace)[0], " \t");
    });
    it("should match an unindented line", function(){
        assert.equal("a".match(patterns.unindented)[0], "a");
        assert.equal(" a".match(patterns.unindented), null);
    });
});
