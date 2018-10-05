"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlGenerator = require("./html-generator");
var lineProcessor = require("./line-processor");
var sectionProcessor = require("./section-processor");
function parse(input, options) {
    var raw = input;
    var lines = lineProcessor.breakLines(raw);
    var unprocessedSections = sectionProcessor.findSections(lines);
    var sections = sectionProcessor.processSections(unprocessedSections, options);
    var elements = sectionProcessor.flattenElements(sections);
    var html = htmlGenerator.generateHTML(elements, options);
    return html;
}
exports.parse = parse;
