import * as propertyDeterminer from "./property-determiner";
// const propertyDeterminer = require("./property-determiner");

export function breakLines(content) {

    return content.split("\n");

}

export function deleteComments(lines) {

    // Lines without comments
    const prunedLines = [];

    for (const line of lines) {

        if (line.lineType !== "comment") {
            prunedLines.push(line);
        }

    }
    return prunedLines;
}

export function objectifyLines(lines) {

    const objectifiedLines = [];

    for (const line of lines) {
        if (line !== "") {
            objectifiedLines.push({
                raw: line,
            });
        }
    }

    return objectifiedLines;
}

export function determineProperties(lines) {

    for (let index = 0; index < lines.length; index++) {
        const value = lines[index];
        lines[index].line = index;
        const indentInfo = propertyDeterminer.determineIndent(value.raw);
        lines[index].index = index;
        lines[index].whitespace = propertyDeterminer.determineWhitespace(lines[index]);
        lines[index].indent = indentInfo[0];
        lines[index].unindented = indentInfo[1];
        lines[index].lineType = propertyDeterminer.determineLineType(lines[index]);
        lines[index].crux = propertyDeterminer.determineCrux(lines[index]);
        lines[index].prefix = propertyDeterminer.determinePrefix(lines[index]);
        lines[index].suffix = propertyDeterminer.determineSuffix(lines[index]);
        lines[index].selfClosing = propertyDeterminer.determineSelfClosing(lines[index]);
        lines[index].classification = propertyDeterminer.determineClassification(lines[index]);
        lines[index].key = propertyDeterminer.determineKey(lines[index]);
        lines[index].interpretation = propertyDeterminer.determineInterpretation(lines[index]);
        lines[index].fill = propertyDeterminer.determineFill(lines[index]);
        lines[index].directiveType = propertyDeterminer.determineDirectiveType(lines[index]);
        lines[index].preceding = [];
    }

    return lines;
}
