var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var propertyDeterminer = require(file("property-determiner"));

describe("Property Determiner", function(){
    it("should identify line types", function(){
        assert.equal(propertyDeterminer.determineLineType({ unindented: '<a>' }), 'html');
        assert.equal(propertyDeterminer.determineLineType({ unindented: '//b' }), 'comment');
        assert.equal(propertyDeterminer.determineLineType({ unindented: 'c' }), 'louk');
    });
    it("should determine whitespace", function(){
        assert.equal(propertyDeterminer.determineWhitespace({raw:'   a'}), '   ');
        assert.equal(propertyDeterminer.determineWhitespace({raw:'\t\tb'}), '\t\t');
    });
    it("should determine classifications", function(){
        assert.equal(propertyDeterminer.determineClassification({prefix:'@'}), 'attribute');
        assert.equal(propertyDeterminer.determineClassification({crux:'.'}), 'attribute');
        assert.equal(propertyDeterminer.determineClassification({raw: 'a'}), 'tag');
    });
    it("should determine prefixes", function(){
        assert.equal(propertyDeterminer.determinePrefix({lineType:'comment'}), null);
        assert.equal(propertyDeterminer.determinePrefix({lineType:'louk',crux:'@click'}), '@');
    });
    it("should determine suffixes", function(){
        assert.equal(propertyDeterminer.determineSuffix({lineType:'comment'}), null);
        assert.equal(propertyDeterminer.determineSuffix({lineType:'louk',crux:'br/'}), '/');
        assert.equal(propertyDeterminer.determineSuffix({lineType:'louk',crux:'a'}), null);
    });
    it("should identify self-closing elements", function(){
        assert.equal(propertyDeterminer.determineSelfClosing({suffix:'/'}), true);
        assert.equal(propertyDeterminer.determineSelfClosing({lineType:'louk'}), false);
        assert.equal(propertyDeterminer.determineSelfClosing({lineType:'html'}), true);
        assert.equal(propertyDeterminer.determineSelfClosing({lineType:'comment'}), true);
    });
    it("should determine indentation", function(){
        assert.equal(propertyDeterminer.determineIndent('a')[0], 0);
        assert.equal(propertyDeterminer.determineIndent('\t\t\t')[0], 3);
        assert.equal(propertyDeterminer.determineIndent('  ')[0], 2);
    });
    it("should determine fills", function(){
        assert.equal(propertyDeterminer.determineFill({crux:"a", unindented:"a"}), null);
        assert.equal(propertyDeterminer.determineFill({crux:"a", unindented:"a b"}), "b");
        assert.equal(propertyDeterminer.determineFill({crux:'"a c', unindented:'"a c'}), "c");
    });
    it("should determine interpretation", function(){
        assert.equal(propertyDeterminer.determineInterpretation({lineType:'comment'}), null);
        assert.equal(propertyDeterminer.determineInterpretation({lineType:'louk',classification:'tag',suffix:'"'}), "static");
        assert.equal(propertyDeterminer.determineInterpretation({lineType:'louk',crux:'.a'}), "static");
        assert.equal(propertyDeterminer.determineInterpretation({lineType:'louk',classification:'attribute',crux:'#a'}), "static");
        assert.equal(propertyDeterminer.determineInterpretation({lineType:'louk'}), "dynamic");
    });
    it("should determine cruxes", function(){
        assert.equal(propertyDeterminer.determineCrux({lineType:'comment'}), null);
        assert.equal(propertyDeterminer.determineCrux({lineType:'louk',unindented:'.a'}), ".");
        assert.equal(propertyDeterminer.determineCrux({lineType:'louk',unindented:'a b'}), "a");
        assert.equal(propertyDeterminer.determineCrux({lineType:'louk',unindented:'c'}), "c");
    });
    it("should determine directive types", function(){
        assert.equal(propertyDeterminer.determineDirectiveType({lineType:'comment'}), null);
        assert.equal(propertyDeterminer.determineDirectiveType({lineType:'louk',prefix:"-",fill:"for"}), "simple");
        assert.equal(propertyDeterminer.determineDirectiveType({lineType:'louk',prefix:"@",fill:"click"}), "action");
        assert.equal(propertyDeterminer.determineDirectiveType({lineType:'louk',prefix:":",fill:"class"}), "bind");
    });
    it("should determine keys", function(){
        assert.equal(propertyDeterminer.determineKey({lineType:'comment'}), null);
        assert.equal(propertyDeterminer.determineKey({lineType:'louk',crux:'.'}), "class");
        assert.equal(propertyDeterminer.determineKey({lineType:'louk',crux:'#'}), "id");
        assert.equal(propertyDeterminer.determineKey({lineType:'louk',crux:'>'}), "href");
        assert.equal(propertyDeterminer.determineKey({lineType:'louk',crux:'a',unindented:'a'}), "a");
    });
});
