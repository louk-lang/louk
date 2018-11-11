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

    // prefix: /^([":@-])/,

    it.skip("should match a prefix", function(){
        assert.equal(" \t  ".match(patterns.prefix)[0], " \t  ");
        assert.equal("   a".match(patterns.prefix), null);
    });

    // Prefixes that can make an attribute static: "
    // staticPrefix: /^(["])/,

    it.skip("should match a static prefix", function(){
        assert.equal(" \t  ".match(patterns.staticPrefix)[0], " \t  ");
        assert.equal("   a".match(patterns.staticPrefix), null);
    });

    // All valid suffixes: " and / and ,
    // suffix: /(["/,])$/,

    it.skip("should match a suffix", function(){
        assert.equal(" \t  ".match(patterns.suffix)[0], " \t  ");
        assert.equal("   a".match(patterns.suffix), null);
    });

    // Suffixes that can make an element static: " and /
    // The forward slash makes an element self-closing, and therefore not capable of containing dynamic content.
    // staticSuffix: /(["/,])$/,

    it.skip("should match a static suffix", function(){
        assert.equal(" \t  ".match(patterns.staticSuffix)[0], " \t  ");
        assert.equal("   a".match(patterns.staticSuffix), null);
    });

    // Cruxes not followed by content, such as "a"
    // plainCrux: /^(.+)/,

    it.skip("should match a plain crux", function(){
        assert.equal(" \t  ".match(patterns.plainCrux)[0], " \t  ");
        assert.equal("   a".match(patterns.plainCrux), null);
    });

    // Cruxes that are followed by content, such as "a b"
    // modifiedCrux: /^(.+?)\s/,

    it.skip("should match a modified crux", function(){
        assert.equal(" \t  ".match(patterns.modifiedCrux)[0], " \t  ");
        assert.equal("   a".match(patterns.modifiedCrux), null);
    });

    // Shorthand cruxes that make their attribute static: > and # and .
    // The first capture group gets the shorthand crux, the second capture group gets the fill.
    // staticCrux: /^([>#\.]).*/,

    it.skip("should match a static crux", function(){
        assert.equal(" \t  ".match(patterns.staticCrux)[0], " \t  ");
        assert.equal("   a".match(patterns.staticCrux), null);
    });

    // Crux of a Vue single-file component section.
    // sectionCrux: /^(\w+),/,

    it.skip("should match a section crux", function(){
        assert.equal(" \t  ".match(patterns.sectionCrux)[0], " \t  ");
        assert.equal("   a".match(patterns.sectionCrux), null);
    });

    // A normal fill, preceded by a space
    // fill: /^.+?\s(.+)/,

    it.skip("should match a fill", function(){
        assert.equal(" \t  ".match(patterns.fill)[0], " \t  ");
        assert.equal("   a".match(patterns.fill), null);
    });

    // A fill prepended by a static crux
    // staticFill: /^[>#\.](.*)/,

    it.skip("should match a staticfill", function(){
        assert.equal(" \t  ".match(patterns.staticFill)[0], " \t  ");
        assert.equal("   a".match(patterns.staticFill), null);
    });

    // A key is semantically what a line of Louk ultimately represents: A specific tag or a specific attribute.
    // A key might be implied or it might have a shorthand. For example, "." is a crux, and "class" is its key.
    // key: /^[":@-]*([\w\.-]+)/,

    it.skip("should match a key", function(){
        assert.equal(" \t  ".match(patterns.key)[0], " \t  ");
        assert.equal("   a".match(patterns.key), null);
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
