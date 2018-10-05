import patterns from "./patterns";

// Determines whether each line represents an attribute or a tag
export function determineClassification(line) {
    if (line.crux === "#") {
        return "attribute";
    } else if (line.crux === ".") {
        return "attribute";
    } else if (line.crux === ">") {
        return "attribute";
    } else if (line.prefix === '"') {
        return  "attribute";
    } else if (line.prefix === "-") {
        return  "attribute";
    } else if (line.prefix === "@") {
        return "attribute";
    } else if (line.prefix === ":") {
        return  "attribute";
    } else {
        return  "tag";
    }
}

export function determinePrefix(line) {

    if (line.lineType === "louk") {

        const matches = line.crux.match(patterns.prefix);
        if (matches) {
            return matches[1];
        }
    } else {
        return null
    }

}

export function determineSuffix(line) {

    if (line.lineType === "louk") {
        let matches = "";

        if (line.crux) {
            matches = line.crux.match(patterns.suffix);
        }

        if (matches) {
            return matches[1];
        }
    } else {
        return null
    }
}

export function determineSelfClosing(line) {

    if (line.suffix === "/") {
        return true;
    } else if (line.lineType === "html") {
        return true;
    } else if (line.lineType === "comment") {
        return true;
    } else {
        return false;
    }
}

/* Determines whether something should be interpretted dynamically (that is, as JavaScript in Vue)
or statically (as plain HTML) */
export function determineInterpretation(line) {

    if (line.lineType === "louk") {
        if (line.classification === "tag" && line.suffix && line.suffix.match(patterns.staticSuffix)) {
            return "static";
        } else if (line.crux.match(patterns.staticCrux)) {
            return "static";
        } else if (line.classification === "attribute" && line.prefix.match(patterns.staticPrefix)) {
            return "static";
        } else {
            return "dynamic";
        }
    } else {
        return null;
    }
}

// Determines how far a line is indented
export function determineIndent(line) {

    let trimmed = line;
    let indent = 0;

    while (trimmed.match(patterns.initialSpace)) {
        trimmed = trimmed.substr(1);
        indent = indent + 1;
    }
    return [indent, trimmed];
}

export function determineCrux(line) {

    if (line.lineType === "louk") {
        if (line.unindented.match(patterns.staticCrux)) {
            return line.unindented.match(patterns.staticCrux)[1];
        } else if (line.unindented.match(patterns.modifiedCrux)) {
            return line.unindented.match(patterns.modifiedCrux)[1];
        } else if (line.unindented.match(patterns.plainCrux)) {
            return line.unindented.match(patterns.plainCrux)[1];
        } else {
            return line.unindented;
        }
    } else {
        return null;
    }

}

// Figures out what tag a tag is and what attribute an attribute is
export function determineFill(line) {

    // Handles static attribute shorthands (> . #)
    if (line.crux && line.crux.match(patterns.staticFill)) {
        return line.unindented.match(patterns.staticFill)[1];
    } else if (line.unindented.match(patterns.fill)) {
        return line.unindented.match(patterns.fill)[1];
    } else if (line.lineType === "comment") {
        return line.unindented.match(patterns.comment)[1];
    }
}

export function determineDirectiveType(line) {

    if (line.lineType === "louk") {

        if (line.prefix === "-" && line.fill === "") {
            return "boolean";
        } else if (line.prefix === "-" && line.fill !== "") {
            return "simple";
        } else if (line.prefix === "@") {
            return "action";
        } else if (line.prefix === ":") {
            return "bind";
        }

    } else {
        return null;
    }
}

// Expands key shorthands
// For example, converts "#" to "id"
export function determineKey(line) {

    if (line.lineType === "louk") {

        if (line.crux === ".") {
            return "class";
        } else if (line.crux === "#") {
            return "id";
        } else if (line.crux === ">") {
            return "href";
        } else if (line.unindented.match(patterns.key)) {
            return line.unindented.match(patterns.key)[1];
        } else {
            return "";
        }
    } else {
        return null;
    }
}

export function determineLineType(line) {
    if (line.unindented.match(patterns.comment)) {
        return "comment";
    } else if (line.unindented.match(patterns.html)) {
        return "html";
    } else {
        return "louk";
    }
}

export function determineWhitespace(line) {
    const whitespace = line.raw.match(patterns.whitespace)[1];
    return whitespace;
}
