"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var patterns_1 = require("./patterns");
function determineClassification(line) {
    if (line.crux === "#") {
        return "attribute";
    }
    else if (line.crux === ".") {
        return "attribute";
    }
    else if (line.crux === ">") {
        return "attribute";
    }
    else if (line.prefix === '"') {
        return "attribute";
    }
    else if (line.prefix === "-") {
        return "attribute";
    }
    else if (line.prefix === "@") {
        return "attribute";
    }
    else if (line.prefix === ":") {
        return "attribute";
    }
    else if (line.crux === "|" || line.crux === '|"') {
        return "continuation";
    }
    else {
        return "tag";
    }
}
exports.determineClassification = determineClassification;
function determinePrefix(line) {
    if (line.lineType === "louk") {
        var matches = line.crux.match(patterns_1.default.prefix);
        if (matches) {
            return matches[1];
        }
    }
    else {
        return null;
    }
}
exports.determinePrefix = determinePrefix;
function determineSuffix(line) {
    if (line.lineType === "louk" && line.crux) {
        var matches = line.crux.match(patterns_1.default.suffix);
        if (matches) {
            return matches[1];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}
exports.determineSuffix = determineSuffix;
function determineSelfClosing(line) {
    if (line.suffix === "/") {
        return true;
    }
    else if (line.lineType === "html") {
        return true;
    }
    else if (line.lineType === "comment") {
        return true;
    }
    else {
        return false;
    }
}
exports.determineSelfClosing = determineSelfClosing;
function determineInterpretation(line) {
    if (line.lineType === "louk") {
        if ((line.classification === "tag" || line.classification === "continuation")
            && line.suffix && line.suffix.match(patterns_1.default.staticSuffix)) {
            return "static";
        }
        else if (line.crux && line.crux.match(patterns_1.default.staticCrux)) {
            return "static";
        }
        else if (line.classification === "attribute" && line.prefix && line.prefix.match(patterns_1.default.staticPrefix)) {
            return "static";
        }
        else {
            return "dynamic";
        }
    }
    else {
        return null;
    }
}
exports.determineInterpretation = determineInterpretation;
function determineIndent(line) {
    var trimmed = line;
    var indent = 0;
    while (trimmed.match(patterns_1.default.initialSpace)) {
        trimmed = trimmed.substr(1);
        indent = indent + 1;
    }
    return [indent, trimmed];
}
exports.determineIndent = determineIndent;
function determineCrux(line) {
    if (line.lineType === "louk") {
        if (line.unindented.match(patterns_1.default.continuationCrux)) {
            return line.unindented.match(patterns_1.default.continuationCrux)[1];
        }
        else if (line.unindented.match(patterns_1.default.staticCrux)) {
            return line.unindented.match(patterns_1.default.staticCrux)[1];
        }
        else if (line.unindented.match(patterns_1.default.modifiedCrux)) {
            return line.unindented.match(patterns_1.default.modifiedCrux)[1];
        }
        else if (line.unindented.match(patterns_1.default.plainCrux)) {
            return line.unindented.match(patterns_1.default.plainCrux)[1];
        }
    }
    else {
        return null;
    }
}
exports.determineCrux = determineCrux;
function determineFill(line) {
    if (line.crux && line.crux.match(patterns_1.default.staticFill)) {
        return line.unindented.match(patterns_1.default.staticFill)[1];
    }
    else if (line.unindented.match(patterns_1.default.fill)) {
        return line.unindented.match(patterns_1.default.fill)[1];
    }
    else {
        return null;
    }
}
exports.determineFill = determineFill;
function determineDirectiveType(line) {
    if (line.lineType === "louk") {
        if (line.prefix === "-" && line.fill !== "") {
            return "simple";
        }
        else if (line.prefix === "@") {
            return "action";
        }
        else if (line.prefix === ":") {
            return "bind";
        }
    }
    else {
        return null;
    }
}
exports.determineDirectiveType = determineDirectiveType;
function determineKey(line) {
    if (line.lineType === "louk") {
        if (line.crux === ".") {
            return "class";
        }
        else if (line.crux === "#") {
            return "id";
        }
        else if (line.crux === ">") {
            return "href";
        }
        else if (line.crux === "|") {
            return "";
        }
        else if (line.unindented.match(patterns_1.default.key)) {
            return line.unindented.match(patterns_1.default.key)[1];
        }
    }
    else {
        return null;
    }
}
exports.determineKey = determineKey;
function determineLineType(line) {
    if (line.unindented.match(patterns_1.default.comment)) {
        return "comment";
    }
    else if (line.unindented.match(patterns_1.default.html)) {
        return "html";
    }
    else {
        return "louk";
    }
}
exports.determineLineType = determineLineType;
function determineIndentationUnit(line) {
    var whitespace = line.raw.match(patterns_1.default.whitespace)[1];
    if (whitespace.length > 0) {
        return whitespace[0];
    }
    else {
        return "\t";
    }
}
exports.determineIndentationUnit = determineIndentationUnit;
function determineWhitespace(line) {
    var whitespace = line.raw.match(patterns_1.default.whitespace)[1];
    return whitespace;
}
exports.determineWhitespace = determineWhitespace;
