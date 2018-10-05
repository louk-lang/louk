import * as htmlGenerator from "./html-generator";
import * as lineProcessor from "./line-processor";
import * as sectionProcessor from "./section-processor";

export function parse(input, options) {

    // Break the input by line
    const lines = lineProcessor.breakLines(input);

    // Identify file sections based on top-level markers
    const unprocessedSections = sectionProcessor.findSections(lines);

    // Process the information inside
    const sections = sectionProcessor.processSections(unprocessedSections, options);

    // Take the elements out of each section and make them a flat list
    const elements = sectionProcessor.flattenElements(sections);

    // Turn the elements list into HTML
    const html = htmlGenerator.generateHTML(elements, options);

    return html;

}
