module.exports = {
    parse: parse
};
var _ = require("underscore");
var patterns = require("./patterns");
var lineProcessor = require("./line-processor");
var sectionProcessor = require("./section-processor");
var elementProcessor = require("./element-processor");
var htmlGenerator = require("./html-generator");
var utils = require("./utils");
var write = utils.write;
function parse(input, options, logging) {
    utils.log(logging);
    var raw = "";
    var lines = [];
    var sections = [];
    var elements = [];
    var html = "";
    raw = input;
    lines = lineProcessor.breakLines(raw);
    sections = sectionProcessor.findSections(lines);
    lines = lineProcessor.objectifyLines(lines);
    lines = lineProcessor.determineProperties(lines);
    lines = lineProcessor.deleteComments(lines);
    elements = elementProcessor.assignAttributes(lines);
    elements = elementProcessor.assignMatches(elements);
    elements = elementProcessor.insertMatches(elements);
    html = htmlGenerator.generateHTML(elements, options);
    return html;
}
