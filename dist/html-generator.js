module.exports = {
    generateHTML: generateHTML
};
var _ = require("underscore");
function generateHTML(input, options) {
    var content = input;
    var html = "";
    var keepWhitespace = true;
    if (options && options.whitespace != null) {
        keepWhitespace = options.whitespace;
    }
    for (var index = 0; index < content.length; index++) {
        var value = content[index];
        if (value.lineType == "html") {
            if (keepWhitespace) {
                html = html + value.raw;
                if (index < (content.length - 1)) {
                    html = html + "\n";
                }
            }
            else {
                html = html + value.unindented;
            }
        }
        else if (value.lineType == "comment") {
            html = html;
        }
        else if (value.passthrough == true) {
            var passthroughContentArray = value.lines;
            if (passthroughContentArray[passthroughContentArray.length - 1] == "") {
                passthroughContentArray.splice(-1, 1);
            }
            if (passthroughContentArray[0] == "") {
                passthroughContentArray.splice(0, 1);
            }
            var passthroughContentString = passthroughContentArray.join("\n");
            html = html + "\n" + passthroughContentString + "\n";
        }
        else {
            if (value.position == "opening" && value.key != null) {
                if (keepWhitespace && value.whitespace) {
                    html = html + value.whitespace;
                }
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
                    if (value.directiveType != "boolean" && value.data) {
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
                else {
                    if (keepWhitespace && value.containsElement) {
                        html = html + "\n";
                    }
                }
            }
            else if (value.position == "closing" && value.key != null) {
                if (keepWhitespace && value.containsElement && value.whitespace) {
                    html = html + value.whitespace;
                }
                html = html + "</" + value.key + ">";
                if (keepWhitespace && index < (content.length - 1)) {
                    html = html + "\n";
                }
            }
        }
    }
    return html;
}
function generateWhitespace(indent) {
    var indentation = "";
    for (var i = 0; i < indent; i++) {
        indentation = indentation + "\t";
    }
    return indentation;
}
