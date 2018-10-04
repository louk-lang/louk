module.exports = {
    generateHTML: generateHTML
};
var _ = require("underscore");
function generateHTML(elements, options) {
    var html = "";
    var keepWhitespace = true;
    if (options && options.whitespace != null) {
        keepWhitespace = options.whitespace;
    }
    for (var index = 0; index < elements.length; index++) {
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
                _.each(element.attributes, function (value, key) {
                    var attribute = "";
                    if (value.interpretation === "dynamic") {
                        if (value.directiveType === "boolean") {
                            attribute = "v-" + key;
                        }
                        else if (value.directiveType === "simple") {
                            attribute = "v-" + key;
                        }
                        else if (value.directiveType === "action") {
                            attribute = "v-on:" + key;
                        }
                        else if (value.directiveType === "bind") {
                            attribute = "v-bind:" + key;
                        }
                    }
                    else if (value.interpretation === "static") {
                        attribute = key;
                    }
                    html = html + " " + attribute;
                    if (value.directiveType !== "boolean" && value.data) {
                        html = html + "=\"" + value.data + "\"";
                    }
                });
                if (element.selfClosing) {
                    html = html + " /";
                }
                html = html + ">";
                if (element.fill) {
                    if (element.interpretation === "dynamic") {
                        html = html + "{{" + element.fill + "}}";
                    }
                    else if (element.interpretation === "static") {
                        html = html + element.fill;
                    }
                }
                else {
                    if (keepWhitespace && element.containsElement) {
                        html = html + "\n";
                    }
                }
            }
            else if (element.position === "closing" && element.key !== null) {
                if (keepWhitespace && element.containsElement && element.whitespace) {
                    html = html + element.whitespace;
                }
                html = html + "</" + element.key + ">";
                if (keepWhitespace && index < (elements.length - 1)) {
                    html = html + "\n";
                }
            }
        }
    }
    return html;
}
