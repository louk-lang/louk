module.exports = {
    parse: parse
};
var _ = require("underscore");
var patterns = require("./patterns");
var lineProcessor = require("./line-processor");
var elementProcessor = require("./element-processor");
var htmlGenerator = require("./html-generator");
var utils = require("./utils");
var write = utils.write;
utils.log(false);
function parse(input) {
    var raw = "";
    var lines = [];
    var elements = [];
    var html = "";
    raw = input;
    write("Raw content:");
    write(raw);
    lines = lineProcessor.breakLines(raw);
    write("After breaking lines:");
    write(lines);
    lines = lineProcessor.objectifyLines(lines);
    write("After pushing into object:");
    write(lines);
    lines = lineProcessor.determineProperties(lines);
    write("After determining properties:");
    write(lines);
    lines = lineProcessor.deleteComments(lines);
    write("After deleting comments:");
    write(lines);
    elements = elementProcessor.assignAttributes(lines);
    write("After structuring as elements:");
    write(elements);
    elements = elementProcessor.assignMatches(elements);
    write("After assigning matches:");
    write(elements);
    elements = elementProcessor.insertMatches(elements);
    write("After adding closing tags:");
    write(elements);
    html = htmlGenerator.generateHTML(elements);
    write("After generating HTML:");
    write(html);
    return html;
}
