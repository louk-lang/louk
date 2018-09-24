module.exports = {
    assignAttributes: assignAttributes,
    assignMatches: assignMatches,
    insertMatches: insertMatches,
    clostingTag: closingTag
};
var _ = require("underscore");
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
                key: value.key,
                indent: value.indent,
                whitespace: value.whitespace
            };
            for (var subindex = (level - 1); subindex >= 0; subindex--) {
                if (elementsForInsertion[subindex]) {
                    elementsForInsertion[subindex].containsElement = true;
                    break;
                }
            }
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
    for (var index = 0; index < elements.length; index++) {
        if (index < (content.length - 1)) {
            if (elements[index + 1].indent > elements[index].indent) {
                elements[index].containsElement = true;
            }
        }
        else {
            elements[index].containsElement = false;
        }
    }
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
function closingTag(content) {
    var element = content;
    element.position = "closing";
    return element;
}
