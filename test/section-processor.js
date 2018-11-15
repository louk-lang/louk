var config = require("./config.js");
var file = config.file;
var assert = config.assert;

var louk = require(file("index.js"));

var sectionProcessor = require(file("section-processor"));

describe("Section Processor", function(){
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
    it("should process the lines in section markers and bodies", function(){
        var unprocessedSections = [{
            body: { elements: [], lines: ["\ta","\t\tb"] },
            elements: [],
            isLouk: true,
            isMarked: true,
            marker: { elements: [], lines: ["template,"], tag: 'template' }
        }];
        var processedSections = sectionProcessor.processSections(unprocessedSections);
        // There should be one element in the marker ("template)")
        assert.equal(processedSections[0].marker.elements.length, 1);
        // And two elements in the body ("a" and "b")
        assert.equal(processedSections[0].body.elements.length, 2);
    });
    it("should flatten nested elements", function(){
        assert.equal(sectionProcessor.flattenElements([{elements:[1,2]},{elements:[3,4]}]).length, 4);
    });
});
