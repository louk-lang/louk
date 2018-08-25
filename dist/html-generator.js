module.exports = {
    generateHTML: generateHTML
};
var _ = require("underscore");
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
