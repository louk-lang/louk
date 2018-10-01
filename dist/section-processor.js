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
        isLouk: null,
        isMarked: null,
        elements: [],
        marker: {
            lines: [],
            elements: [],
            tag: ""
        },
        body: {
            lines: [],
            elements: []
        }
    };
    var section = clone(sectionDefault);
    for (var index = 0; index < content.length; index++) {
        var line = content[index];
        if (line.match(patterns.sectionCrux)) {
            if (section.marker.lines.length > 0 || section.body.lines.length > 0) {
                sections.push(section);
                section = clone(sectionDefault);
            }
            section.isMarked = true;
            section.marker.lines.push(line);
            section.marker.tag = line.match(patterns.sectionCrux)[1];
            if (section.marker.tag == "template") {
                section.isLouk = true;
            }
            else {
                section.isLouk = false;
            }
        }
        else if (line.match(patterns.unindentedElement)) {
            if (section.marker.lines.length > 0) {
                sections.push(section);
                section = clone(sectionDefault);
            }
            section.isMarked = false;
            section.isLouk = true;
            section.body.lines.push(line);
        }
        else if (line.match(patterns.unindented) && section.isMarked) {
            section.marker.lines.push(line);
            if (line.match(patterns.loukLangAttribute)) {
                section.isLouk = true;
            }
        }
        else if (section.isLouk) {
            section.body.lines.push(line);
        }
        else if (section.marker.tag != "") {
            section.body.lines.push(line);
        }
    }
    sections.push(section);
    return sections;
}
function processSections(input, options) {
    var content = input;
    var sections = content;
    for (var index = 0; index < sections.length; index++) {
        sections[index].marker.lines = lineProcessor.objectifyLines(sections[index].marker.lines);
        sections[index].marker.lines = lineProcessor.determineProperties(sections[index].marker.lines);
        sections[index].marker.lines = lineProcessor.deleteComments(sections[index].marker.lines);
        sections[index].marker.elements = elementProcessor.assignAttributes(sections[index].marker.lines);
        if (options && options.langs && !sections[index].marker.elements[0].attributes.lang) {
            var tag = sections[index].marker.tag;
            var lang = options.langs[tag];
            if (options.langs[tag]) {
                sections[index].marker.elements[0].attributes.lang = {
                    data: lang,
                    interpretation: "static"
                };
            }
        }
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
    return elements;
}
function clone(input) {
    return JSON.parse(JSON.stringify(input));
}
