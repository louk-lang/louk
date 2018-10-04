module.exports = {
    parse,
};

const _ = require("underscore");

const lineProcessor = require("./line-processor");
const sectionProcessor = require("./section-processor");
const elementProcessor = require("./element-processor");
const htmlGenerator = require("./html-generator");

function parse(input, options) {

    let raw = "";
    let lines = [];
    let sections = [];
    let elements = [];
    let html = "";

    // Start with the raw input
    raw = input;

    // Break the input by line
    lines = lineProcessor.breakLines(raw);

    // Identify file sections based on top-level markers
    sections = sectionProcessor.findSections(lines);

    // Process the information inside
    sections = sectionProcessor.processSections(sections, options);

    // Take the elements out of each section and make them a flat list
    elements = sectionProcessor.flattenElements(sections);

    // Turn the elements list into HTML
    html = htmlGenerator.generateHTML(elements, options);

    return html;

}
