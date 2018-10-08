import * as elementProcessor from "./element-processor";
import * as lineProcessor from "./line-processor";
import patterns from "./patterns";
import * as utils from "./utils";

export function findSections(lines) {

    const sections = [];

    const sectionDefault = {
        body: {
            elements: [],
            lines: [],
        },
        elements: [],
        isLouk: null,
        isMarked: null,
        marker: {
            elements: [],
            lines: [],
            tag: null,
        },
    };

    let section = utils.clone(sectionDefault);

    for (const line of lines) {

        if (line.match(patterns.sectionCrux)) {

            // As long as this isn't our first iteration through this loop
            if (section.marker.lines.length > 0 || section.body.lines.length > 0) {
                // Push the current section and reset
                sections.push(section);
                section = utils.clone(sectionDefault);
            }

            section.isMarked = true;

            section.marker.lines.push(line);

            // Pull out the section type
            section.marker.tag = line.match(patterns.sectionCrux)[1];

            if (section.marker.tag === "template") {
                section.isLouk = true;
            } else {
                section.isLouk = false;
            }

        } else if (line.match(patterns.unindentedElement)) {

            // As long as this isn't our first iteration through this loop
            if (section.marker.lines.length > 0) {
                // Push the current section and reset
                sections.push(section);
                section = utils.clone(sectionDefault);
            }

            section.isMarked = false;
            section.isLouk = true;

            section.body.lines.push(line);
        } else if (line.match(patterns.unindented) && section.isMarked) {

            section.marker.lines.push(line);
            if (line.match(patterns.loukLangAttribute)) {
                section.isLouk = true;
            }
        } else if (section.isLouk) {
            section.body.lines.push(line);
        } else if (section.marker.tag !== "") {
            section.body.lines.push(line);
        }

    }

    sections.push(section);
    return sections;
}

export function processSections(sections, options) {

    for (const section of sections) {

        // For each section, process the lines
        section.marker.lines = lineProcessor.objectifyLines(section.marker.lines);

        section.marker.lines = lineProcessor.determineProperties(section.marker.lines);
        section.marker.lines = lineProcessor.deleteComments(section.marker.lines);

        // Then turn those lines into element objects and begin to process them
        section.marker.elements = elementProcessor.assignAttributes(section.marker.lines);

        // If there are language options, and the section's marker tag doesn't have a language explicitly set
        if (options && options.langs && !section.marker.elements[0].attributes.lang) {
            const tag = section.marker.tag;
            const lang = options.langs[tag];
            // If there is a language setting for this specific section
            if (options.langs[tag]) {
                // Then set the lang attribute
                section.marker.elements[0].attributes.lang = {
                    data: lang,
                    interpretation: "static",
                };
            }
        }

        // Then push the marker elements up into the section elements
        section.elements = section.elements.concat(section.marker.elements);

        // If the section is Louk content, process the body as well.
        if (section.isLouk) {

            section.body.lines = lineProcessor.objectifyLines(section.body.lines);
            section.body.lines = lineProcessor.determineProperties(section.body.lines);
            section.body.lines = lineProcessor.deleteComments(section.body.lines);

            section.body.elements = elementProcessor.assignAttributes(section.body.lines);
            section.elements = section.elements.concat(section.body.elements);

        } else {
            section.elements.push({
                lines: section.body.lines,
                passthrough: true,
            });
        }

        section.elements = elementProcessor.assignMatches(section.elements);
        section.elements = elementProcessor.insertMatches(section.elements);

    }

    return sections;
}

export function flattenElements(sections) {

    let elements = [];

    for (const section of sections) {
        elements = elements.concat(section.elements);
    }

    return elements;
}
