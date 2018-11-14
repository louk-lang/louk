"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assignAttributes(content) {
    var elements = [];
    var current = {
        attributes: {},
        classification: null,
        matched: false,
        position: null,
    };
    for (var index = 0; index < content.length; index++) {
        var element = content[index];
        if (element.classification === "tag") {
            if (index > 0) {
                elements.push(current);
            }
            current = element;
            current.position = "opening";
            current.matched = false;
            current.attributes = {};
        }
        else if (element.classification === "attribute") {
            if (current.classification === "tag") {
                if (!current.attributes[element.key]) {
                    current.attributes[element.key] = {
                        data: element.fill,
                        directiveType: element.directiveType,
                        interpretation: element.interpretation,
                    };
                }
            }
        }
        else if (element.classification === "continuation") {
            elements.push(current);
            current = element;
        }
    }
    if (current.classification !== null) {
        elements.push(current);
    }
    return elements;
}
exports.assignAttributes = assignAttributes;
function assignMatches(elements) {
    var elementsForInsertion = {};
    var level = 0;
    var maxLevel = 0;
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        element.preceding = [];
        level = element.indent;
        var previousElementAtLevel = null;
        if (level >= maxLevel) {
            maxLevel = level;
        }
        if (elementsForInsertion[level] && element.classification === "tag") {
            previousElementAtLevel = elementsForInsertion[level];
            delete elementsForInsertion[level];
        }
        if (element.classification === "continuation" && elementsForInsertion[level].containsTag) {
            element.peerWithTag = true;
        }
        if (!element.selfClosing && element.classification !== "continuation") {
            elementsForInsertion[level] = {
                indent: element.indent,
                key: element.key,
                whitespace: element.whitespace,
            };
            for (var subindex = (level - 1); subindex >= 0; subindex--) {
                if (elementsForInsertion[subindex]) {
                    elementsForInsertion[subindex].containsTag = true;
                    break;
                }
            }
        }
        while (level < maxLevel) {
            if (elementsForInsertion[maxLevel]) {
                element.preceding.push(closingTag(elementsForInsertion[maxLevel]));
                delete elementsForInsertion[maxLevel];
            }
            maxLevel--;
        }
        if (previousElementAtLevel && element.classification === "tag") {
            element.preceding.push(closingTag(previousElementAtLevel));
        }
    }
    var endElement = {
        preceding: [],
        system: "end",
    };
    var remainingElements = [];
    Object.keys(elementsForInsertion).forEach(function (key) {
        remainingElements[key] = elementsForInsertion[key];
    });
    remainingElements.reverse();
    for (var _a = 0, remainingElements_1 = remainingElements; _a < remainingElements_1.length; _a++) {
        var element = remainingElements_1[_a];
        if (element) {
            endElement.preceding.push((closingTag(element)));
        }
    }
    elements.push(endElement);
    for (var index = 0; index < elements.length; index++) {
        if (index < (elements.length - 1)) {
            for (var subindex = index + 1; subindex < elements.length; subindex++) {
                if (elements[subindex].classification === "tag"
                    && elements[subindex].indent > elements[index].indent) {
                    elements[index].containsTag = true;
                    break;
                }
                else if (elements[subindex].classification === "tag"
                    && elements[subindex].indent <= elements[index].indent) {
                    elements[index].containsTag = false;
                    break;
                }
            }
        }
        else {
            elements[index].containsTag = false;
        }
    }
    return elements;
}
exports.assignMatches = assignMatches;
function insertMatches(nestedElements) {
    var elements = [];
    for (var _i = 0, nestedElements_1 = nestedElements; _i < nestedElements_1.length; _i++) {
        var element = nestedElements_1[_i];
        for (var _a = 0, _b = element.preceding; _a < _b.length; _a++) {
            var precedingElement = _b[_a];
            if (precedingElement !== "") {
                elements.push(precedingElement);
            }
        }
        if (!element.system) {
            elements.push(element);
        }
    }
    return elements;
}
exports.insertMatches = insertMatches;
function closingTag(element) {
    element.position = "closing";
    return element;
}
exports.closingTag = closingTag;
