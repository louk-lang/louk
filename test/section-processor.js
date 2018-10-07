var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var sectionProcessor = require(file("section-processor"));

describe("Section processor", function(){
    it("should find a section marker", function(){
        assert.equal(sectionProcessor.findSections(["template,"]).length, 1);
    });
    it("should identify a louk template section", function(){
        assert.equal(sectionProcessor.findSections(["template,"])[0].isLouk, true);
    });
    it("should find a section marker attribute", function(){
        assert.equal(sectionProcessor.findSections(["layout,",'"lang louk'])[0].isLouk, true);
    });
    it("should identify a non-louk section", function(){
        assert.equal(sectionProcessor.findSections(["script,"])[0].isLouk, false);
    });
    it("should identify multiple sections", function(){
        assert.equal(sectionProcessor.findSections(["template,","script,"]).length, 2);
    });
    it("should identify the body of a section", function(){
        assert.equal(sectionProcessor.findSections(["template,",'\t"a'])[0].body.lines[0], '\t"a');
    });
});
