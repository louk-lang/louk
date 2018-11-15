"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateHTML(elements, options) {
    var html = "";
    var keepWhitespace = true;
    if (options && options.whitespace != null) {
        keepWhitespace = options.whitespace;
    }
    var _loop_1 = function (index) {
        var element = elements[index];
        if (element.lineType === "html") {
            if (keepWhitespace) {
                html = html + element.raw;
                if (index < (elements.length - 1)) {
                    html = html + "\n";
                }
            }
            else {
                html = html + element.unindented;
            }
        }
        else if (element.lineType === "comment") {
        }
        else if (element.passthrough === true) {
            var passthroughContentArray = element.lines;
            if (passthroughContentArray[passthroughContentArray.length - 1] === "") {
                passthroughContentArray.splice(-1, 1);
            }
            if (passthroughContentArray[0] === "") {
                passthroughContentArray.splice(0, 1);
            }
            var passthroughContentString = passthroughContentArray.join("\n");
            html = html + "\n" + passthroughContentString + "\n";
        }
        else {
            if (element.position === "opening" && element.key != null) {
                if (keepWhitespace && element.whitespace) {
                    html = html + element.whitespace;
                }
                html = html + "<";
                html = html + element.key;
                Object.keys(element.attributes).forEach(function (key) {
                    var attributeInfo = element.attributes[key];
                    var attribute = "";
                    if (attributeInfo.interpretation === "dynamic") {
                        if (attributeInfo.directiveType === "simple") {
                            attribute = "v-" + key;
                        }
                        else if (attributeInfo.directiveType === "action") {
                            attribute = "v-on:" + key;
                        }
                        else if (attributeInfo.directiveType === "bind") {
                            attribute = "v-bind:" + key;
                        }
                    }
                    else if (attributeInfo.interpretation === "static") {
                        attribute = key;
                    }
                    html = html + " " + attribute;
                    if (attributeInfo.data) {
                        html = html + "=\"" + attributeInfo.data + "\"";
                    }
                });
                if (element.selfClosing) {
                    html = html + " /";
                }
                html = html + ">";
                if (element.fill) {
                    if (keepWhitespace && element.containsTag) {
                        html = html + "\n" +
                            element.indentationUnit +
                            renderFill(element.fill, element.interpretation) +
                            "\n";
                    }
                    else {
                        html = html + renderFill(element.fill, element.interpretation);
                    }
                }
                else {
                    if (keepWhitespace && element.containsTag) {
                        html = html + "\n";
                    }
                }
            }
            else if (element.classification === "continuation") {
                if (element.fill && element.anchored) {
                    if (keepWhitespace && element.peerWithTag) {
                        html = html +
                            element.indentationUnit +
                            renderFill(element.fill, element.interpretation) +
                            "\n";
                    }
                    else {
                        html = html + renderFill(element.fill, element.interpretation);
                    }
                }
            }
            else if (element.position === "closing" && element.key !== null) {
                if (keepWhitespace && element.containsTag && element.whitespace) {
                    html = html + element.whitespace;
                }
                html = html + "</" + element.key + ">";
                if (keepWhitespace && index < (elements.length - 1)) {
                    html = html + "\n";
                }
            }
        }
    };
    for (var index = 0; index < elements.length; index++) {
        _loop_1(index);
    }
    return html;
}
exports.generateHTML = generateHTML;
function renderFill(fill, interpretation) {
    if (interpretation === "dynamic") {
        return "{{" + fill + "}}";
    }
    else if (interpretation === "static") {
        return fill;
    }
}
exports.renderFill = renderFill;
