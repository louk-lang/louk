module.exports = {
    assignAttributes: assignAttributes,
    assignMatches: assignMatches,
    insertMatches: insertMatches,
    clostingTag: closingTag
}

const _ = require("underscore")

function assignAttributes(content){
    let elements = []
    let currentTag = {}

    for(let index = 0; index < content.length; index++){
        let value = content[index]
        if(value.classification == "tag"){
            if(index > 0){
                elements.push(currentTag)
            }
            currentTag = value
            currentTag.position = "opening"
            currentTag.matched = false
            currentTag.attributes = {}
        }
        else if(value.classification == "attribute"){
            currentTag.attributes[value.key] = {
                data: value.fill,
                interpretation: value.interpretation,
                directiveType: value.directiveType
            }
        }
    }

    elements.push(currentTag)
    return elements
}

//Determines where matching closing tags need to be inserted
function assignMatches(content){
    let elements = content
    //Temporarily stores the elements we know we need to insert when we reach the right point
    let elementsForInsertion = {}
    let level = 0
    let maxLevel = 0

    for(let index = 0; index < content.length; index++){
        let value = content[index]
        let currentLevelElement = ""

        //The level of indentation we're currently working at
        level = value.indent

        //If the level we're working at goes up, then the max level of open tags goes up.
        //Note that it can jump up by more than 1 if indentation is improper
        if (level >= maxLevel){
            maxLevel = level
        }

        //If there's already an element for insertion at this level, that means there's a previous element to close.
        if(elementsForInsertion[level]){
            //We hold on to this element and push it into the preceding list later.
            currentLevelElement = elementsForInsertion[level]
            delete elementsForInsertion[level]
        }

        //For the element we're looking at, we remember we'll need to close it eventually.
        if(!value.selfClosing){
            elementsForInsertion[level] = {
                key: value.key,
            }
        }

        //If the current level is less than the maximum level, that means we've outdented, and therefore have multiple necessary closing elements
        while(level < maxLevel){
            //There might not be an element for insertion at this level, as some elements are self-closing
            if(elementsForInsertion[maxLevel]){
                elements[index].preceding.push(closingTag(elementsForInsertion[maxLevel]))
                delete elementsForInsertion[maxLevel]
            }
            maxLevel--
        }

        elements[index].preceding.push(closingTag(currentLevelElement))

    }
    //This is a special element we use to represent the end of the html
    let endElement = {
        system: "end",
        preceding: []
    }

    //After working through all the elements, we'll need to close any elements that are still open
    let remainingElements = []
    _.each(elementsForInsertion, function(value, key){
        remainingElements[key] = value
    })

    //We insert these elements in reverse
    remainingElements.reverse()

    for(let index = 0; index < remainingElements.length; index++){
        let value = remainingElements[index]
        if(value){
            endElement.preceding.push((closingTag(value)))
        }
    }

    //Add the special end element to the end
    elements.push(endElement)

    return elements
}

//Takes the matches temporarily stored in other elements and inserts them into the main array
function insertMatches(content){
    let elements = []

    for(let index = 0; index < content.length; index++){
        let value = content[index]

        for(let subindex = 0; subindex < value.preceding.length; subindex++){
            let element = value.preceding[subindex]
            elements.push(element)
        }

        //We don't want to insert temporary system elements into the final array
        if(!value.system){
            elements.push(value)
        }

    }

    return elements
}

//Adds property to indicate that the element is a closing tag
function closingTag(content){
    let element = content
    element.position = "closing"
    return element
}
