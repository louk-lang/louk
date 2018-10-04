module.exports = {
    generateHTML,
};

const _ = require("underscore");

// Turns the completed array of element objects into raw HTML
function generateHTML(elements, options) {

    let html = "";

    let keepWhitespace = true;

    if (options && options.whitespace != null) {
        keepWhitespace = options.whitespace;
    }

    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];

        // HTML is passed straight through
        if (element.lineType === "html") {

            if (keepWhitespace) {
                html = html + element.raw;

                // Insert a newline as long as we're not at the last line.
                if (index < (elements.length - 1)) {
                    html = html + "\n";
                }
            } else {
                html = html + element.unindented;
            }
        } else if (element.lineType === "comment") {
            // Do nothing; comments are completely discarded
        } else if (element.passthrough === true) {

            const passthroughContentArray = element.lines;
            if (passthroughContentArray[passthroughContentArray.length - 1] === "") {
                passthroughContentArray.splice(-1, 1);
            }
            if (passthroughContentArray[0] === "") {
                passthroughContentArray.splice(0, 1);
            }
            const passthroughContentString = passthroughContentArray.join("\n");

            html = html + "\n" + passthroughContentString + "\n";

        } else {
            // Generate opening tags
            if (element.position === "opening" && element.key != null) {

                if (keepWhitespace && element.whitespace) {
                    html = html + element.whitespace;
                }

                html = html + "<";
                html = html + element.key;

                // Loop over all of the element's attributes
                _.each(element.attributes, (value, key) => {
                    let attribute = "";

                    // If the attribute should be interpretted dynamically...
                    if (value.interpretation === "dynamic") {
                        if (value.directiveType === "boolean") {
                            attribute = "v-" + key;
                        } else if (value.directiveType === "simple") {
                            attribute = "v-" + key;
                        } else if (value.directiveType === "action") {
                            attribute = "v-on:" + key;
                        } else if (value.directiveType === "bind") {
                            attribute = "v-bind:" + key;
                        }
                    } else if (value.interpretation === "static") {
                        attribute = key;
                    }

                    // Put the above defined attribute and value into the HTML
                    html = html + " " + attribute;

                    // If the attribute is boolean, no explicit value is needed
                    if (value.directiveType !== "boolean" && value.data) {
                        html = html + "=\"" + value.data + "\"";
                    }
                });

                if (element.selfClosing) {
                    html = html + " /";
                }
                html = html + ">";

                // If there's body content...
                if (element.fill) {

                    // If the body should be interpreted dynamically, we wrap it in Vue curly brackets
                    if (element.interpretation === "dynamic") {
                        html = html + "{{" + element.fill + "}}";
                    } else if (element.interpretation === "static") {
                        html = html + element.fill;
                    }
                } else {
                    if (keepWhitespace && element.containsElement) {
                        html = html +  "\n";
                    }
                }

            } else if (element.position === "closing" && element.key !== null) {

                if (keepWhitespace && element.containsElement && element.whitespace) {
                    html = html + element.whitespace;
                }

                html = html + "</" + element.key + ">";

                // Add a return if we're not at the last element.
                if (keepWhitespace && index < (elements.length - 1)) {
                    html = html +  "\n";
                }
            }
        }
    }
    return html;
}
