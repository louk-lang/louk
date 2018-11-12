export function assignAttributes(content) {
    const elements = [];
    let current = {
        attributes: {},
        classification: null,
        matched: false,
        position: null,
    };

    for (let index = 0; index < content.length; index++) {

        const element = content[index];

        if (element.classification === "tag") {
            if (index > 0) {
                elements.push(current);
            }
            current = element;
            current.position = "opening";
            current.matched = false;
            current.attributes = {};

        } else if (element.classification === "attribute") {

            // If attribute already exists, don't overwrite it
            if (!current.attributes[element.key]) {
                current.attributes[element.key] = {
                    data: element.fill,
                    directiveType: element.directiveType,
                    interpretation: element.interpretation,
                };
            }
        } else if (element.classification === "continuation") {
            if (current.classification === "tag") {
                elements.push(current);
            } else if (current.classification === "tag") {
                elements.push(current);
            }
            current = element;
        }
    }

    // Don't push the current tag if it's just the placeholder.
    if (current.classification !== null) {
        elements.push(current);
    }
    // console.log(elements)
    return elements;
}

// Determines where matching closing tags need to be inserted
export function assignMatches(elements) {

    // Temporarily stores the elements we know we need to insert when we reach the right point
    const elementsForInsertion = {};
    let level = 0;
    let maxLevel = 0;

    for (const element of elements) {

        let currentLevelElement = "";

        // The level of indentation we're currently working at
        level = element.indent;

        // If the level we're working at goes up, then the max level of open tags goes up.
        // Note that it can jump up by more than 1 if indentation is improper
        if (level >= maxLevel) {
            maxLevel = level;
        }

        // If there's already an element for insertion at this level, that means there's a previous element to close.
        if (elementsForInsertion[level]) {
            // We hold on to this element and push it into the preceding list later.
            currentLevelElement = elementsForInsertion[level];
            delete elementsForInsertion[level];
        }

        // For the element we're looking at, we remember we'll need to close it eventually.
        if (!element.selfClosing) {
            elementsForInsertion[level] = {
                indent: element.indent,
                key: element.key,
                whitespace: element.whitespace,
            };

            // Look for the next level of element (since levels can be skipped)
            for (let subindex = (level - 1); subindex >= 0; subindex--) {
                if (elementsForInsertion[subindex]) {
                    // Mark the closing tag one level up as containing an element.
                    elementsForInsertion[subindex].containsElement = true;
                    break;
                }
            }
        }

        /* If the current level is less than the maximum level, that means we've outdented,
        and therefore have multiple necessary closing elements */
        while (level < maxLevel) {
            // There might not be an element for insertion at this level, as some elements are self-closing
            if (elementsForInsertion[maxLevel]) {
                element.preceding.push(closingTag(elementsForInsertion[maxLevel]));
                delete elementsForInsertion[maxLevel];
            }
            maxLevel--;
        }

        // Just in case it doesn't exist for some elements
        if (!element.preceding) {
            element.preceding = [];
        }

        if (currentLevelElement) {
            element.preceding.push(closingTag(currentLevelElement));
        }

    }
    // This is a special element we use to represent the end of the html
    const endElement = {
        preceding: [],
        system: "end",
    };

    // After working through all the elements, we'll need to close any elements that are still open
    const remainingElements = [];

    Object.keys(elementsForInsertion).forEach((key) => {
        remainingElements[key] = elementsForInsertion[key];
    });

    // We insert these elements in reverse
    remainingElements.reverse();

    for (const element of remainingElements) {

        // Some levels will be undefined. (This is expected.)
        if (element) {
            endElement.preceding.push((closingTag(element)));
        }
    }

    // Add the special end element to the end
    elements.push(endElement);

    for (let index = 0; index < elements.length; index++) {

            // If we're not at the last element
            if (index < (elements.length - 1)) {
                // If the element following the current one is indented farther than the current one
                if (elements[index + 1].indent > elements[index].indent) {
                    // Then the current element contains an element.
                    elements[index].containsElement = true;
                }
            } else {
                elements[index].containsElement = false;
            }
    }
    return elements;
}

// Takes the matches temporarily stored in other elements and inserts them into the main array
export function insertMatches(nestedElements) {
    const elements = [];

    for (const element of nestedElements) {
        for (const precedingElement of element.preceding) {
            if (precedingElement !== "") {
                elements.push(precedingElement);
            }
        }

        // We don't want to insert temporary system elements into the final array
        if (!element.system) {
            elements.push(element);
        }

    }

    return elements;
}

// Adds property to indicate that the element is a closing tag
export function closingTag(element) {
    element.position = "closing";
    return element;
}
