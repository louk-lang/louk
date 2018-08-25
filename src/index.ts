const _ = require("underscore")
const fs = require('fs');
let log = false

require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const patterns = require("./patterns")

module.exports = function(content){
    return html = parse(content);
}

//Writing to console
function write(content){
    if (log == true){
        console.log(content)
    }
}

function parse(input){
    //Raw holds the raw input
    let raw = ""
    //Lines holds each line of the document broken down into its own object, which we progressively add metadata to
    let lines = []
    //Out of all the lines, we create a new array with only those that represent elements, and then attach attributes to them
    let elements = []
    //Finally, we translate the elements into raw HTML
    let html = ""

    raw = input
    write("Raw content:")
    write(raw)

    lines = breakLines(raw)
    write("After breaking lines:")
    write(lines)

    lines = objectifyLines(lines)
    write("After pushing into object:")
    write(lines)

    lines = determineProperties(lines)
    write("After determining properties:")
    write(lines)

    lines = deleteComments(lines)
    write("After deleting comments:")
    write(lines)

    elements = assignAttributes(lines)
    write("After structuring as elements:")
    write(elements)

    elements = assignMatches(elements)
    write("After assigning matches:")
    write(elements)

    elements = insertMatches(elements)
    write("After adding closing tags:")
    write(elements)

    html = generateHTML(elements)
    write("After generating HTML:")
    write(html)

    return html

}

function breakLines(content){
    let lines = content
    lines = content.split("\n")
    return lines
}

function deleteComments(content){

    //Lines with comments
    let lines = content

    //Lines without comments
    let prunedLines = []

    for(let index = 0; index < content.length; index++){

        let value = content[index]

        if(value.lineType != "comment"){
            prunedLines.push(value)
        }

    }
    return prunedLines
}

function objectifyLines(content){
    let objectifiedLines = []

    for(let index = 0; index < content.length; index++){
        let value = content[index]
        if(value != ""){
            objectifiedLines.push({
                "raw":value
            })
        }
    }

    return objectifiedLines
}

function determineProperties(content){
    let lines = content

    for(let index = 0; index < content.length; index++){
        let value = content[index]
        lines[index].line = index
        let indentInfo = determineIndent(value.raw)
        lines[index].index = index
        lines[index].indent = indentInfo[0]
        lines[index].unindented = indentInfo[1]
        lines[index].lineType = determineLineType(lines[index])
        lines[index].crux = determineCrux(lines[index])
        lines[index].prefix = determinePrefix(lines[index])
        lines[index].suffix = determineSuffix(lines[index])
        lines[index].selfClosing = determineSelfClosing(lines[index])
        lines[index].classification = determineClassification(lines[index])
        lines[index].key = determineKey(lines[index])
        lines[index].interpretation = determineInterpretation(lines[index])
        lines[index].fill = determineFill(lines[index])
        lines[index].directiveType = determineDirectiveType(lines[index])
        lines[index].preceding = []
    }

    return lines
}

function determineLineType(content){
    let type = ""
    if(content.unindented.match(patterns.comment)){
        type = "comment"
    }
    else if(content.unindented.match(patterns.html)){
        type = "html"
    }
    else{
        type = "louk"
    }
    return type
}

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

//Turns the completed array of element objects into raw HTML
function generateHTML(content){
    let html = ""

    for(let index = 0; index < content.length; index++){
        let value = content[index]

        //HTML is passed straight through
        if(value.lineType == "html"){
            html = html + value.unindented
        }

        //Comments are discarded
        else if(value.lineType == "comment"){
            html = html
        }

        //Louk notation goes through additional processing
        else{
            //Generate opening tags
            if(value.position == "opening" && value.key != null){

                html = html + "<"
                html = html + value.key

                //Loop over all of the element's attributes
                _.each(value.attributes, function(value, key){
                    let attribute = ""

                    //If the attribute should be interpretted dynamically...
                    if(value.interpretation == "dynamic"){
                        if(value.directiveType == "boolean"){
                            attribute = "v-" + key
                        }
                        else if(value.directiveType == "simple"){
                            attribute = "v-" + key
                        }
                        else if(value.directiveType == "action"){
                            attribute = "v-on:" + key
                        }
                        else if(value.directiveType == "bind"){
                            attribute = "v-bind:" + key
                        }
                    }

                    //If the attribute should be interpretted statically...
                    else if(value.interpretation == "static"){
                        attribute = key
                    }

                    //Put the above defined attribute and value into the HTML
                    html = html + " " + attribute

                    //If the directive is boolean, no explicit value is needed
                    if(value.directiveType != "boolean"){
                        html = html + "=\"" + value.data + "\""
                    }
                })

                if(value.selfClosing){
                    html = html + " /"
                }
                html = html + ">"

                //If there's body content...
                if(value.fill){

                        //If the body should be interpreted dynamically, we wrap it in Vue curly brackets
                        if(value.interpretation == "dynamic"){
                            html = html + "{{" + value.fill + "}}"
                        }

                        //Otherwise we just include it straight.
                        else if(value.interpretation == "static"){
                            html = html + value.fill
                        }
                    }

            }

            //Generate closing tags
            else if(value.position == "closing" && value.key != null){
                html = html + "</" + value.key + ">"
            }
        }
    }
    return html
}

//Determines whether each line represents an attribute or a tag
function determineClassification(content){
    let classification = ""

    if(content.crux == "#"){
        classification = "attribute"
    }
    else if(content.crux == "."){
        classification = "attribute"
    }
    else if(content.crux == ">"){
        classification = "attribute"
    }
    else if(content.prefix == "~"){
        classification = "attribute"
    }
    else if(content.prefix == "-"){
        classification = "attribute"
    }
    else if(content.prefix == "@"){
        classification = "attribute"
    }
    else if(content.prefix == ":"){
        classification = "attribute"
    }
    else{
        classification = "tag"
    }

    return classification;
}

function determinePrefix(content){
    let prefix = ""

    if(content.lineType == "louk"){

        let matches = content.crux.match(patterns.prefix)
        if(matches){
            prefix = matches[1]
        }
    }

    return prefix
}

function determineSuffix(content){
    let suffix = ""

    if(content.lineType == "louk"){
        let matches = ""

        if(content.crux){
            matches = content.crux.match(patterns.suffix)
        }

        if(matches){
            suffix = matches[1]
        }
    }

    return suffix
}

function determineSelfClosing(content){
    let selfClosing = false
    if(content.suffix == "/"){
        selfClosing = true
    }
    else if(content.lineType == "html"){
        selfClosing = true
    }
    else if(content.lineType == "comment"){
        selfClosing = true
    }
    else {
        selfClosing = false
    }
    return selfClosing
}


//Determines whether something should be interpretted dynamically (that is, as JavaScript in Vue) or statically (as plain HTML)
function determineInterpretation(content){
    let interpretation = ""

    if(content.lineType == "louk"){
        if(content.classification == "tag" && content.suffix.match(patterns.staticSuffix)){
            interpretation = "static"
        }
        else if(content.crux.match(patterns.staticCrux)){
            interpretation = "static"

        }
        else if(content.classification == "attribute" && content.prefix.match(patterns.staticPrefix)){
            interpretation = "static"
        }
        else{
            interpretation = "dynamic"
        }
    }
    return interpretation
}

//Determines how far a line is indented
function determineIndent(content){
    let indent = 0
    let content = content
    while(content.match(patterns.initialSpace)){
        content = content.substr(1)
        indent = indent + 1
    }
    return [indent, content]
}


function determineCrux(content){
    let crux = ""

    if(content.lineType == "louk"){

        if(content.unindented.match(patterns.staticCrux)){
            crux = content.unindented.match(patterns.staticCrux)[1]
        }

        else if(content.unindented.match(patterns.modifiedCrux)){
            crux = content.unindented.match(patterns.modifiedCrux)[1]
        }

        else if(content.unindented.match(patterns.plainCrux)){
            crux = content.unindented.match(patterns.plainCrux)[1]
        }
        //If none of those match, then the crux is simply the undindented content.
        //In practice, this final block should never be hit.
        else{
            crux = content.unindented
        }
    }

    return crux
}

//Figures out what tag a tag is and what attribute an attribute is
function determineFill(content){
    let fill = ""

    //Handles static attribute shorthands (> . #)
    if(content.crux.match(patterns.staticFill)){
        fill = content.unindented.match(patterns.staticFill)[1]
    }

    //Handles elements and attributes
    else if(content.unindented.match(patterns.fill)){
        fill = content.unindented.match(patterns.fill)[1]
    }

    //Handles comments
    else if(content.lineType == "comment"){
        fill = content.unindented.match(patterns.comment)[1]
    }
    return fill
}

function determineDirectiveType(content){
    let directiveType = ""

    if(content.lineType == "louk"){

        if(content.prefix == "-" && content.fill == ""){
            directiveType = "boolean"
        }
        else if(content.prefix == "-" && content.fill != ""){
            directiveType = "simple"
        }
        else if(content.prefix == "@"){
            directiveType = "action"
        }
        else if(content.prefix == ":"){
            directiveType = "bind"
        }
    }

    return directiveType
}

//Expands key shorthands
//For example, converts "#" to "id"
function determineKey(content){
    let key = ""

    if(content.lineType == "louk"){

        if(content.crux == "."){
            key = "class"
        }
        else if(content.crux == "#"){
            key = "id"
        }
        else if(content.crux == ">"){
            key = "href"
        }
        else if(content.unindented.match(patterns.key)){
            key = content.unindented.match(patterns.key)[1]
        }
        else{
            key = null
        }
    }

    return key
}

//Adds property to indicate that the element is a closing tag
function closingTag(content){
    let element = content
    element.position = "closing"
    return element
}
