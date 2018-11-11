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

    it.skip("should match a plain crux", function(){
        assert.equal("abc".match(patterns.plainCrux)[0], "abc");
        assert.equal("abc def".match(patterns.plainCrux), null);
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

    it("should match a staticfill", function(){
        assert.equal("#def".match(patterns.staticFill)[1], "def");
        assert.equal("abc def".match(patterns.staticFill), null);
    });

    it("should match a key", function(){
        assert.equal(":abc".match(patterns.key)[0], ":abc");
        assert.equal("&abc".match(patterns.key), null);
    });

    // Louk attribute, for use while parsing sections
    // loukLangAttribute: /"lang louk/,

    it.skip("should match a Louk language attribute", function(){
        assert.equal(" \t  ".match(patterns.loukLangAttribute)[0], " \t  ");
        assert.equal("   a".match(patterns.loukLangAttribute), null);
    });

    // Used to recognize that something is an unindented Vue section marker, HTML tag, or HTML comment
    // unindentedElement: /^[\w<]/,

    it.skip("should match an unindented element", function(){
        assert.equal(" \t  ".match(patterns.unindentedElement)[0], " \t  ");
        assert.equal("   a".match(patterns.unindentedElement), null);
    });

    // Characters that indicate the line should be interpretted as a comment.
    // The capture group captures the comment.
    // comment: /^\/\/(.*)/,

    it.skip("should match a comment", function(){
        assert.equal(" \t  ".match(patterns.comment)[0], " \t  ");
        assert.equal("   a".match(patterns.comment), null);
    });

    // Lines that consist only of whitespace characters. The capture group captures the full content.
    // emptyLine: /^(\s+)$/,

    it("should match an empty line", function(){
        assert.equal(" \t  ".match(patterns.emptyLine)[0], " \t  ");
        assert.equal("   a".match(patterns.emptyLine), null);
    });

    // Characters that indicate the line should be interpretted as HTML
    // html: /^([<])/,

    it.skip("should match an html line", function(){
        assert.equal(" \t  ".match(patterns.html)[0], " \t  ");
        assert.equal("   a".match(patterns.html), null);
    });

    // Used to identify whether we've hit the first non-space character of a line yet.
    // initialSpace: /^(\s)/,

    //initialSpace
    it.skip("should match an initial space", function(){
        assert.equal(" \t  ".match(patterns.initialSpace)[0], " \t  ");
        assert.equal("   a".match(patterns.initialSpace), null);
    });

    // Used to capture leading whitespace.
    // whitespace: /^(\s*)/,

    //whitespace
    it.skip("should match whitespace", function(){
        assert.equal(" \t  ".match(patterns.whitespace)[0], " \t  ");
        assert.equal("   a".match(patterns.whitespace), null);
    });

    // Shows that the line is not indented.
    // unindented: /^\S/,

    //unindented
    it.skip("should match an unindented line", function(){
        assert.equal(" \t  ".match(patterns.unindented)[0], " \t  ");
        assert.equal("   a".match(patterns.unindented), null);
    });
});
