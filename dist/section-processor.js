module.exports = {
    findSections: findSections,
    processSections: processSections,
    flattenElements: flattenElements
};
var patterns = require("./patterns");
var lineProcessor = require("./line-processor");
var elementProcessor = require("./element-processor");
function findSections(input) {
    var content = input;
    var sections = [];
    var sectionDefault = {
        isLouk: false,
        contained: false,
        elements: [],
        marker: {
            lines: [],
            elements: [],
            tag: ""
        },
        body: {
            raw: "",
            lines: [],
            elements: []
        }
    };
    var section = JSON.parse(JSON.stringify(sectionDefault));
    for (var index = 0; index < content.length; index++) {
        var line = content[index];
        if (line.match(patterns.sectionCrux)) {
            if (section.marker.lines.length > 0) {
                sections.push(section);
                section = JSON.parse(JSON.stringify(sectionDefault));
            }
            section.marker.lines.push(line);
            section.marker.tag = line.match(patterns.sectionCrux)[1];
            if (section.marker.tag == "template") {
                section.isLouk = true;
            }
        }
        else if (line.match(patterns.unindented)) {
            section.marker.lines.push(line);
            if (line.match(patterns.loukLangAttribute)) {
                section.isLouk = true;
            }
        }
        else if (section.isLouk) {
            section.body.lines.push(line);
            section.body.raw = section.body.raw + line;
        }
        else if (section.marker.tag != "") {
            section.body.lines.push(line);
        }
    }
    sections.push(section);
    return sections;
}
function processSections(input) {
    var content = input;
    var sections = content;
    for (var index = 0; index < sections.length; index++) {
        sections[index].marker.lines = lineProcessor.objectifyLines(sections[index].marker.lines);
        sections[index].marker.lines = lineProcessor.determineProperties(sections[index].marker.lines);
        sections[index].marker.lines = lineProcessor.deleteComments(sections[index].marker.lines);
        sections[index].marker.elements = elementProcessor.assignAttributes(sections[index].marker.lines);
        sections[index].elements = sections[index].elements.concat(sections[index].marker.elements);
        if (sections[index].isLouk) {
            sections[index].body.lines = lineProcessor.objectifyLines(sections[index].body.lines);
            sections[index].body.lines = lineProcessor.determineProperties(sections[index].body.lines);
            sections[index].body.lines = lineProcessor.deleteComments(sections[index].body.lines);
            sections[index].body.elements = elementProcessor.assignAttributes(sections[index].body.lines);
            sections[index].elements = sections[index].elements.concat(sections[index].body.elements);
        }
        else {
            sections[index].elements.push({
                lines: sections[index].body.lines,
                passthrough: true
            });
        }
        sections[index].elements = elementProcessor.assignMatches(sections[index].elements);
        sections[index].elements = elementProcessor.insertMatches(sections[index].elements);
    }
    return sections;
}
function flattenElements(input) {
    var content = input;
    var elements = [];
    for (var index = 0; index < content.length; index++) {
        elements = elements.concat(content[index].elements);
    }
    elements;
    return elements;
}
