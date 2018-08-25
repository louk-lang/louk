var _ = require("underscore");
var fs = require('fs');
var log = false;
require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var patterns = require("./patterns");
module.exports = function (content) {
    return html = parse(content);
};
function write(content) {
    if (log == true) {
        console.log(content);
    }
}
function parse(input) {
    var raw = "";
    var lines = [];
    var elements = [];
    var html = "";
    raw = input;
    write("Raw content:");
    write(raw);
    lines = breakLines(raw);
    write("After breaking lines:");
    write(lines);
    lines = objectifyLines(lines);
    write("After pushing into object:");
    write(lines);
    lines = determineProperties(lines);
    write("After determining properties:");
    write(lines);
    lines = deleteComments(lines);
    write("After deleting comments:");
    write(lines);
    elements = assignAttributes(lines);
    write("After structuring as elements:");
    write(elements);
    elements = assignMatches(elements);
    write("After assigning matches:");
    write(elements);
    elements = insertMatches(elements);
    write("After adding closing tags:");
    write(elements);
    html = generateHTML(elements);
    write("After generating HTML:");
    write(html);
    return html;
}
function breakLines(content) {
    var lines = content;
    lines = content.split("\n");
    return lines;
}
function deleteComments(content) {
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
function objectifyLines(content) {
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
function determineProperties(content) {
    var lines = content;
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        lines[index].line = index;
        var indentInfo = determineIndent(value.raw);
        lines[index].index = index;
        lines[index].indent = indentInfo[0];
        lines[index].unindented = indentInfo[1];
        lines[index].lineType = determineLineType(lines[index]);
        lines[index].crux = determineCrux(lines[index]);
        lines[index].prefix = determinePrefix(lines[index]);
        lines[index].suffix = determineSuffix(lines[index]);
        lines[index].selfClosing = determineSelfClosing(lines[index]);
        lines[index].classification = determineClassification(lines[index]);
        lines[index].key = determineKey(lines[index]);
        lines[index].interpretation = determineInterpretation(lines[index]);
        lines[index].fill = determineFill(lines[index]);
        lines[index].directiveType = determineDirectiveType(lines[index]);
        lines[index].preceding = [];
    }
    return lines;
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
function assignAttributes(content) {
    var elements = [];
    var currentTag = {};
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        if (value.classification == "tag") {
            if (index > 0) {
                elements.push(currentTag);
            }
            currentTag = value;
            currentTag.position = "opening";
            currentTag.matched = false;
            currentTag.attributes = {};
        }
        else if (value.classification == "attribute") {
            currentTag.attributes[value.key] = {
                data: value.fill,
                interpretation: value.interpretation,
                directiveType: value.directiveType
            };
        }
    }
    elements.push(currentTag);
    return elements;
}
function assignMatches(content) {
    var elements = content;
    var elementsForInsertion = {};
    var level = 0;
    var maxLevel = 0;
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        var currentLevelElement = "";
        level = value.indent;
        if (level >= maxLevel) {
            maxLevel = level;
        }
        if (elementsForInsertion[level]) {
            currentLevelElement = elementsForInsertion[level];
            delete elementsForInsertion[level];
        }
        if (!value.selfClosing) {
            elementsForInsertion[level] = {
                key: value.key
            };
        }
        while (level < maxLevel) {
            if (elementsForInsertion[maxLevel]) {
                elements[index].preceding.push(closingTag(elementsForInsertion[maxLevel]));
                delete elementsForInsertion[maxLevel];
            }
            maxLevel--;
        }
        elements[index].preceding.push(closingTag(currentLevelElement));
    }
    var endElement = {
        system: "end",
        preceding: []
    };
    var remainingElements = [];
    _.each(elementsForInsertion, function (value, key) {
        remainingElements[key] = value;
    });
    remainingElements.reverse();
    for (var index = 0; index < remainingElements.length; index++) {
        var value = remainingElements[index];
        if (value) {
            endElement.preceding.push((closingTag(value)));
        }
    }
    elements.push(endElement);
    return elements;
}
function insertMatches(content) {
    var elements = [];
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        for (var subindex = 0; subindex < value.preceding.length; subindex++) {
            var element = value.preceding[subindex];
            elements.push(element);
        }
        if (!value.system) {
            elements.push(value);
        }
    }
    return elements;
}
function generateHTML(content) {
    var html = "";
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        if (value.lineType == "html") {
            html = html + value.unindented;
        }
        else if (value.lineType == "comment") {
            html = html;
        }
        else {
            if (value.position == "opening" && value.key != null) {
                html = html + "<";
                html = html + value.key;
                _.each(value.attributes, function (value, key) {
                    var attribute = "";
                    if (value.interpretation == "dynamic") {
                        if (value.directiveType == "boolean") {
                            attribute = "v-" + key;
                        }
                        else if (value.directiveType == "simple") {
                            attribute = "v-" + key;
                        }
                        else if (value.directiveType == "action") {
                            attribute = "v-on:" + key;
                        }
                        else if (value.directiveType == "bind") {
                            attribute = "v-bind:" + key;
                        }
                    }
                    else if (value.interpretation == "static") {
                        attribute = key;
                    }
                    html = html + " " + attribute;
                    if (value.directiveType != "boolean") {
                        html = html + "=\"" + value.data + "\"";
                    }
                });
                if (value.selfClosing) {
                    html = html + " /";
                }
                html = html + ">";
                if (value.fill) {
                    if (value.interpretation == "dynamic") {
                        html = html + "{{" + value.fill + "}}";
                    }
                    else if (value.interpretation == "static") {
                        html = html + value.fill;
                    }
                }
            }
            else if (value.position == "closing" && value.key != null) {
                html = html + "</" + value.key + ">";
            }
        }
    }
    return html;
}
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
function closingTag(content) {
    var element = content;
    element.position = "closing";
    return element;
}
