"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    parse: parse,
};
var htmlGenerator = require("./html-generator");
var lineProcessor = require("./line-processor");
var sectionProcessor = require("./section-processor");
function parse(input, options) {
    var raw = "";
    var lines = [];
    var sections = [];
    var elements = [];
    var html = "";
    raw = input;
    lines = lineProcessor.breakLines(raw);
    sections = sectionProcessor.findSections(lines);
    sections = sectionProcessor.processSections(sections, options);
    elements = sectionProcessor.flattenElements(sections);
    html = htmlGenerator.generateHTML(elements, options);
    return html;
}
