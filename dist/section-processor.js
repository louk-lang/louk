"use strict";
exports.__esModule = true;
module.exports = {
    findSections: findSections,
    flattenElements: flattenElements,
    processSections: processSections
};
var patterns_1 = require("./patterns");
var lineProcessor = require("./line-processor");
var elementProcessor = require("./element-processor");
var utils_1 = require("./utils");
function findSections(lines) {
    var sections = [];
    var sectionDefault = {
        body: {
            elements: [],
            lines: []
        },
        elements: [],
        isLouk: null,
        isMarked: null,
        marker: {
            elements: [],
            lines: [],
            tag: ""
        }
    };
    var section = utils_1["default"].clone(sectionDefault);
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.match(patterns_1["default"].sectionCrux)) {
            if (section.marker.lines.length > 0 || section.body.lines.length > 0) {
                sections.push(section);
                section = utils_1["default"].clone(sectionDefault);
            }
            section.isMarked = true;
            section.marker.lines.push(line);
            section.marker.tag = line.match(patterns_1["default"].sectionCrux)[1];
            if (section.marker.tag === "template") {
                section.isLouk = true;
            }
            else {
                section.isLouk = false;
            }
        }
        else if (line.match(patterns_1["default"].unindentedElement)) {
            if (section.marker.lines.length > 0) {
                sections.push(section);
                section = clone(sectionDefault);
            }
            section.isMarked = false;
            section.isLouk = true;
            section.body.lines.push(line);
        }
        else if (line.match(patterns_1["default"].unindented) && section.isMarked) {
            section.marker.lines.push(line);
            if (line.match(patterns_1["default"].loukLangAttribute)) {
                section.isLouk = true;
            }
        }
        else if (section.isLouk) {
            section.body.lines.push(line);
        }
        else if (section.marker.tag !== "") {
            section.body.lines.push(line);
        }
    }
    sections.push(section);
    return sections;
}
function processSections(sections, options) {
    for (var _i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
        var section = sections_1[_i];
        section.marker.lines = lineProcessor.objectifyLines(section.marker.lines);
        section.marker.lines = lineProcessor.determineProperties(section.marker.lines);
        section.marker.lines = lineProcessor.deleteComments(section.marker.lines);
        section.marker.elements = elementProcessor.assignAttributes(section.marker.lines);
        if (options && options.langs && !section.marker.elements[0].attributes.lang) {
            var tag = section.marker.tag;
            var lang = options.langs[tag];
            if (options.langs[tag]) {
                section.marker.elements[0].attributes.lang = {
                    data: lang,
                    interpretation: "static"
                };
            }
        }
        section.elements = section.elements.concat(section.marker.elements);
        if (section.isLouk) {
            section.body.lines = lineProcessor.objectifyLines(section.body.lines);
            section.body.lines = lineProcessor.determineProperties(section.body.lines);
            section.body.lines = lineProcessor.deleteComments(section.body.lines);
            section.body.elements = elementProcessor.assignAttributes(section.body.lines);
            section.elements = section.elements.concat(section.body.elements);
        }
        else {
            section.elements.push({
                lines: section.body.lines,
                passthrough: true
            });
        }
        section.elements = elementProcessor.assignMatches(section.elements);
        section.elements = elementProcessor.insertMatches(section.elements);
    }
    return sections;
}
function flattenElements(sections) {
    var elements = [];
    for (var _i = 0, sections_2 = sections; _i < sections_2.length; _i++) {
        var section = sections_2[_i];
        elements = elements.concat(section.elements);
    }
    return elements;
}
