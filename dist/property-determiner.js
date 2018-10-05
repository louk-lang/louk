"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    determineClassification: determineClassification,
    determineCrux: determineCrux,
    determineDirectiveType: determineDirectiveType,
    determineFill: determineFill,
    determineIndent: determineIndent,
    determineInterpretation: determineInterpretation,
    determineKey: determineKey,
    determineLineType: determineLineType,
    determinePrefix: determinePrefix,
    determineSelfClosing: determineSelfClosing,
    determineSuffix: determineSuffix,
    determineWhitespace: determineWhitespace,
};
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
    else {
        return "tag";
    }
}
function determinePrefix(line) {
    var prefix = "";
    if (line.lineType === "louk") {
        var matches = line.crux.match(patterns_1.default.prefix);
        if (matches) {
            prefix = matches[1];
        }
    }
    return prefix;
}
function determineSuffix(line) {
    var suffix = "";
    if (line.lineType === "louk") {
        var matches = "";
        if (line.crux) {
            matches = line.crux.match(patterns_1.default.suffix);
        }
        if (matches) {
            suffix = matches[1];
        }
    }
    return suffix;
}
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
function determineInterpretation(line) {
    if (line.lineType === "louk") {
        if (line.classification === "tag" && line.suffix.match(patterns_1.default.staticSuffix)) {
            return "static";
        }
        else if (line.crux.match(patterns_1.default.staticCrux)) {
            return "static";
        }
        else if (line.classification === "attribute" && line.prefix.match(patterns_1.default.staticPrefix)) {
            return "static";
        }
        else {
            return "dynamic";
        }
    }
    else {
        return "";
    }
}
function determineIndent(line) {
    var trimmed = line;
    var indent = 0;
    while (trimmed.match(patterns_1.default.initialSpace)) {
        trimmed = trimmed.substr(1);
        indent = indent + 1;
    }
    return [indent, trimmed];
}
function determineCrux(line) {
    if (line.lineType === "louk") {
        if (line.unindented.match(patterns_1.default.staticCrux)) {
            return line.unindented.match(patterns_1.default.staticCrux)[1];
        }
        else if (line.unindented.match(patterns_1.default.modifiedCrux)) {
            return line.unindented.match(patterns_1.default.modifiedCrux)[1];
        }
        else if (line.unindented.match(patterns_1.default.plainCrux)) {
            return line.unindented.match(patterns_1.default.plainCrux)[1];
        }
        else {
            return line.unindented;
        }
    }
    else {
        return "";
    }
}
function determineFill(line) {
    if (line.crux.match(patterns_1.default.staticFill)) {
        return line.unindented.match(patterns_1.default.staticFill)[1];
    }
    else if (line.unindented.match(patterns_1.default.fill)) {
        return line.unindented.match(patterns_1.default.fill)[1];
    }
    else if (line.lineType === "comment") {
        return line.unindented.match(patterns_1.default.comment)[1];
    }
}
function determineDirectiveType(line) {
    var directiveType = "";
    if (line.lineType === "louk") {
        if (line.prefix === "-" && line.fill === "") {
            directiveType = "boolean";
        }
        else if (line.prefix === "-" && line.fill !== "") {
            directiveType = "simple";
        }
        else if (line.prefix === "@") {
            directiveType = "action";
        }
        else if (line.prefix === ":") {
            directiveType = "bind";
        }
    }
    return directiveType;
}
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
        else if (line.unindented.match(patterns_1.default.key)) {
            return line.unindented.match(patterns_1.default.key)[1];
        }
        else {
            return "";
        }
    }
    else {
        return null;
    }
}
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
function determineWhitespace(line) {
    var whitespace = line.raw.match(patterns_1.default.whitespace)[1];
    return whitespace;
}
