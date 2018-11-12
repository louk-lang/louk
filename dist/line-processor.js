"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var patterns_1 = require("./patterns");
var propertyDeterminer = require("./property-determiner");
function breakLines(content) {
    return content.split("\n");
}
exports.breakLines = breakLines;
function deleteComments(lines) {
    var prunedLines = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.lineType !== "comment") {
            prunedLines.push(line);
        }
    }
    return prunedLines;
}
exports.deleteComments = deleteComments;
function deleteEmptyLines(lines) {
    var prunedLines = [];
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        if (line.raw !== "" && !line.raw.match(patterns_1.default.emptyLine)) {
            prunedLines.push(line);
        }
    }
    return prunedLines;
}
exports.deleteEmptyLines = deleteEmptyLines;
function objectifyLines(lines) {
    var objectifiedLines = [];
    for (var _i = 0, lines_3 = lines; _i < lines_3.length; _i++) {
        var line = lines_3[_i];
        if (line !== "") {
            objectifiedLines.push({
                raw: line,
            });
        }
    }
    return objectifiedLines;
}
exports.objectifyLines = objectifyLines;
function determineProperties(lines) {
    for (var index = 0; index < lines.length; index++) {
        lines[index].line = index;
        var indentInfo = propertyDeterminer.determineIndent(lines[index].raw);
        lines[index].whitespace = propertyDeterminer.determineWhitespace(lines[index]);
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
exports.determineProperties = determineProperties;
