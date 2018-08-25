module.exports = {
    determineClassification: determineClassification,
    determinePrefix: determinePrefix,
    determineSuffix: determineSuffix,
    determineSelfClosing: determineSelfClosing,
    determineInterpretation: determineInterpretation,
    determineIndent: determineIndent,
    determineCrux: determineCrux,
    determineDirectiveType: determineDirectiveType,
    determineFill: determineFill,
    determineKey: determineKey,
    determineLineType: determineLineType
};
var patterns = require("./patterns");
function determineClassification(content) {
    var classification = "";
    if (content.crux == "#") {
        classification = "attribute";
    }
    else if (content.crux == ".") {
        classification = "attribute";
    }
    else if (content.crux == ">") {
        classification = "attribute";
    }
    else if (content.prefix == "~") {
        classification = "attribute";
    }
    else if (content.prefix == "-") {
        classification = "attribute";
    }
    else if (content.prefix == "@") {
        classification = "attribute";
    }
    else if (content.prefix == ":") {
        classification = "attribute";
    }
    else {
        classification = "tag";
    }
    return classification;
}
function determinePrefix(content) {
    var prefix = "";
    if (content.lineType == "louk") {
        var matches = content.crux.match(patterns.prefix);
        if (matches) {
            prefix = matches[1];
        }
    }
    return prefix;
}
function determineSuffix(content) {
    var suffix = "";
    if (content.lineType == "louk") {
        var matches = "";
        if (content.crux) {
            matches = content.crux.match(patterns.suffix);
        }
        if (matches) {
            suffix = matches[1];
        }
    }
    return suffix;
}
function determineSelfClosing(content) {
    var selfClosing = false;
    if (content.suffix == "/") {
        selfClosing = true;
    }
    else if (content.lineType == "html") {
        selfClosing = true;
    }
    else if (content.lineType == "comment") {
        selfClosing = true;
    }
    else {
        selfClosing = false;
    }
    return selfClosing;
}
function determineInterpretation(content) {
    var interpretation = "";
    if (content.lineType == "louk") {
        if (content.classification == "tag" && content.suffix.match(patterns.staticSuffix)) {
            interpretation = "static";
        }
        else if (content.crux.match(patterns.staticCrux)) {
            interpretation = "static";
        }
        else if (content.classification == "attribute" && content.prefix.match(patterns.staticPrefix)) {
            interpretation = "static";
        }
        else {
            interpretation = "dynamic";
        }
    }
    return interpretation;
}
function determineIndent(content) {
    var indent = 0;
    var content = content;
    while (content.match(patterns.initialSpace)) {
        content = content.substr(1);
        indent = indent + 1;
    }
    return [indent, content];
}
function determineCrux(content) {
    var crux = "";
    if (content.lineType == "louk") {
        if (content.unindented.match(patterns.staticCrux)) {
            crux = content.unindented.match(patterns.staticCrux)[1];
        }
        else if (content.unindented.match(patterns.modifiedCrux)) {
            crux = content.unindented.match(patterns.modifiedCrux)[1];
        }
        else if (content.unindented.match(patterns.plainCrux)) {
            crux = content.unindented.match(patterns.plainCrux)[1];
        }
        else {
            crux = content.unindented;
        }
    }
    return crux;
}
function determineFill(content) {
    var fill = "";
    if (content.crux.match(patterns.staticFill)) {
        fill = content.unindented.match(patterns.staticFill)[1];
    }
    else if (content.unindented.match(patterns.fill)) {
        fill = content.unindented.match(patterns.fill)[1];
    }
    else if (content.lineType == "comment") {
        fill = content.unindented.match(patterns.comment)[1];
    }
    return fill;
}
function determineDirectiveType(content) {
    var directiveType = "";
    if (content.lineType == "louk") {
        if (content.prefix == "-" && content.fill == "") {
            directiveType = "boolean";
        }
        else if (content.prefix == "-" && content.fill != "") {
            directiveType = "simple";
        }
        else if (content.prefix == "@") {
            directiveType = "action";
        }
        else if (content.prefix == ":") {
            directiveType = "bind";
        }
    }
    return directiveType;
}
function determineKey(content) {
    var key = "";
    if (content.lineType == "louk") {
        if (content.crux == ".") {
            key = "class";
        }
        else if (content.crux == "#") {
            key = "id";
        }
        else if (content.crux == ">") {
            key = "href";
        }
        else if (content.unindented.match(patterns.key)) {
            key = content.unindented.match(patterns.key)[1];
        }
        else {
            key = null;
        }
    }
    return key;
}
function determineLineType(content) {
    var type = "";
    if (content.unindented.match(patterns.comment)) {
        type = "comment";
    }
    else if (content.unindented.match(patterns.html)) {
        type = "html";
    }
    else {
        type = "louk";
    }
    return type;
}
