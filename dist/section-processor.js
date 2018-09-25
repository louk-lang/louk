module.exports = {
    findSections: findSections
};
var patterns = require("./patterns");
function findSections(input) {
    var content = input;
    input;
    var sections = [];
    var sectionDefault = {
        isLouk: false,
        marker: {
            lines: [],
            tag: ""
        },
        body: {
            raw: ""
        }
    };
    var section = sectionDefault;
    for (var index = 0; index < content.length; index++) {
        var line = content[index];
        if (line.match(patterns.sectionCrux)) {
            section.marker.lines.push(line);
            section.marker.tag = line.match(patterns.sectionCrux)[1];
            if (section.marker.tag == "template") {
                section.isLouk = true;
            }
        }
        else if (line.match(patterns.unindented)) {
            section.marker.lines.push(line);
            if (line.match(patterns.loukLangAttribute)) {
                section.isLouk = true;
            }
        }
        else {
            section.body.raw = section.body.raw + line;
        }
        sections.push(section);
        section = sectionDefault;
    }
    return sections;
}
