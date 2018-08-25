module.exports = {
    breakLines: breakLines,
    deleteComments: deleteComments,
    objectifyLines: objectifyLines,
    determineProperties: determineProperties
};
var patterns = require("./patterns");
var propertyDeterminer = require("./property-determiner");
function breakLines(input) {
    var content = input;
    var lines = content;
    lines = content.split("\n");
    return lines;
}
function deleteComments(input) {
    var content = input;
    var lines = content;
    var prunedLines = [];
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        if (value.lineType != "comment") {
            prunedLines.push(value);
        }
    }
    return prunedLines;
}
function objectifyLines(input) {
    var content = input;
    var objectifiedLines = [];
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        if (value != "") {
            objectifiedLines.push({
                "raw": value
            });
        }
    }
    return objectifiedLines;
}
function determineProperties(input) {
    var content = input;
    var lines = content;
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        lines[index].line = index;
        var indentInfo = propertyDeterminer.determineIndent(value.raw);
        lines[index].index = index;
        lines[index].indent = indentInfo[0];
        lines[index].unindented = indentInfo[1];
        lines[index].lineType = propertyDeterminer.determineLineType(lines[index]);
        lines[index].crux = propertyDeterminer.determineCrux(lines[index]);
        lines[index].prefix = propertyDeterminer.determinePrefix(lines[index]);
        lines[index].suffix = propertyDeterminer.determineSuffix(lines[index]);
        lines[index].selfClosing = propertyDeterminer.determineSelfClosing(lines[index]);
        lines[index].classification = propertyDeterminer.determineClassification(lines[index]);
        lines[index].key = propertyDeterminer.determineKey(lines[index]);
        lines[index].interpretation = propertyDeterminer.determineInterpretation(lines[index]);
        lines[index].fill = propertyDeterminer.determineFill(lines[index]);
        lines[index].directiveType = propertyDeterminer.determineDirectiveType(lines[index]);
        lines[index].preceding = [];
    }
    return lines;
}
