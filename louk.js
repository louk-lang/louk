const _ = require("underscore")
const fs = require('fs');
var log = true

require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

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
    var raw = ""
    //Lines holds each line of the document broken down into its own object, which we progressively add metadata to
    var lines = []
    //Out of all the lines, we create a new array with only those that represent elements, and then attach attributes to them
    var elements = []
    //Finally, we translate the elements into raw HTML
    var html = ""

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

    elements = assignAttributes(lines)
    write("After structuring as elements")
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
    var lines = content
    lines = content.split("\n")
    return lines
}

function objectifyLines(content){
    var objectifiedLines = []

    for(var index = 0; index < content.length; index++){
        var value = content[index]
        if(value != ""){
            objectifiedLines.push({
                "raw":value
            })
        }
    }

    return objectifiedLines
}

function determineProperties(content){
    var lines = content

    for(var index = 0; index < content.length; index++){
        var value = content[index]
        lines[index].line = index
        var indentInfo = determineIndent(value.raw)
        lines[index].index = index
        lines[index].indent = indentInfo[0]
        lines[index].unindented = indentInfo[1]
        lines[index].crux = determineCrux(lines[index])
        lines[index].prefix = determinePrefix(lines[index])
        lines[index].suffix = determineSuffix(lines[index])
        lines[index].selfClosing = determineSelfClosing(lines[index])
        lines[index].classification = determineClassification(lines[index])
        lines[index].key = determineKey(lines[index])
        lines[index].interpretation = determineInterpretation(lines[index])
        lines[index].fill = determineFill(lines[index])
        lines[index].preceding = []
    }

    return lines
}

function assignAttributes(content){
    var elements = []
    var currentTag = {}

    for(var index = 0; index < content.length; index++){
        var value = content[index]
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
                interpretation: value.interpretation
            }
        }
    }

    elements.push(currentTag)
    return elements
}

//Determines where matching closing tags need to be inserted
function assignMatches(content){
    var elements = content
    //Temporarily stores the elements we know we need to insert when we reach the right point
    var elementsForInsertion = {}
    var level = 0
    var maxLevel = 0

    for(var index = 0; index < content.length; index++){
        var value = content[index]
        var currentLevelElement = ""

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
    var endElement = {
        system: "end",
        preceding: []
    }

    //After working through all the elements, we'll need to close any elements that are still open
    var remainingElements = []
    _.each(elementsForInsertion, function(value, key){
        remainingElements[key] = value
    })

    //We insert these elements in reverse
    remainingElements.reverse()

    for(var index = 0; index < remainingElements.length; index++){
        var value = remainingElements[index]
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
    var elements = []

    for(var index = 0; index < content.length; index++){
        var value = content[index]

        for(var subindex = 0; subindex < value.preceding.length; subindex++){
            var element = value.preceding[subindex]
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
    var html = ""

    //TODO: Allow extended handlers like specific keyboard shortcuts
    var shorthand = {
        for: "v-for",
        if: "v-if",
        click: "v-on:click",
        submit: "v-on:submit"
    }

    for(var index = 0; index < content.length; index++){
    var value = content[index]

        //Generate opening tags
        if(value.position == "opening" && value.key != null){

            html = html + "<"
            html = html + value.key

            //Loop over all of the element's attributes
            _.each(value.attributes, function(value, key){
                var attribute = ""

                //If the attribute should be interpretted dynamically...
                if(value.interpretation == "dynamic"){

                    //Some cruxes have special mappings to Vue, which are handled here
                    if(key == "for"){
                        attribute = "v-for"
                    }
                    else if(key == "if"){
                        attribute = "v-for"
                    }
                    else if(key.match(/^click/)){
                        attribute = "v-on:" + key
                    }
                    else if(shorthand[key]){
                        attribute = shorthand[key]
                    }

                    //v-bind is the default Vue translation for any attributes that don't have special handling
                    else{
                        attribute = "v-bind:" + key
                    }
                }

                //If the attribute should be interpretted statically...
                else if(value.interpretation == "static"){
                    attribute = key
                }

                //Put the above defined attribute and value into the HTML
                html = html + " " + attribute + "=\""
                html = html + value.data
                html = html + "\""

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
    return html
}

//Determines whether each line represents an attribute or a tag
function determineClassification(content){
    var classification = ""
    if(content.crux.match(/#/)){
        classification = "attribute"
    }
    else if(content.crux.match(/\./)){
        classification = "attribute"
    }
    else if(content.crux.match(/@/)){
        classification = "attribute"
    }
    else if(content.crux.match(/:/)){
        classification = "attribute"
    }
    // This match applies only to the old grammar.
    // else if(content.crux.match(/:$/)){
    //     classification = "attribute"
    // }
    else{
        classification = "tag"

    }
    return classification;
}

//Checks whether there is a special character like a ~, which affects parsing of the line
function determinePrefix(content){
    var prefix = ""
    var matches = content.unindented.match(/([~\.#|]*)\w+/)
    if(matches){
        prefix = matches[1]
    }
    return prefix
}

function determineSuffix(content){
    var suffix = ""
    var matches = ""
    var suffixPattern = /([~|])$/

    console.log(content.crux)
    if(content.crux){
        matches = content.crux.match(suffixPattern)
    }

    console.log(matches)
    if(matches){
        console.log(matches[1])
        suffix = matches[1]
    }
    console.log(suffix)
    return suffix
}

function determineSelfClosing(content){
    var selfClosing = false
    console.log(content.suffix)
    if(content.suffix == "|"){
        selfClosing = true
    }
    else {
        selfClosing = false
    }
    console.log(selfClosing)
    return selfClosing
}

var staticSuffixPattern = /[~|]/
var staticPrefixPattern = /[@#.]/
//Determines whether something should be interpretted dynamically (that is, as JavaScript in Vue) or statically (as plain HTML)
function determineInterpretation(content){
    var interpretation
    if(content.suffix.match(staticSuffixPattern)){
        interpretation = "static"
    }
    else if(content.prefix.match(staticPrefixPattern)){
        interpretation = "static"
    }
    else{
        interpretation = "dynamic"
    }
    return interpretation
}

//Determines how far a line is indented
function determineIndent(content){
    var indent = 0
    var content = content
    while(content.match(/^\s/)){
        content = content.substr(1)
        indent = indent + 1
    }
    return [indent, content]
}

//Figures out the crux, which is the indicator of what a line represents.
//The crux potentially includes an element tag, a prefix, a suffix, and/or a key shorthand.
//Crucially, the crux is always what is explicitly present in the source, regardless of what is eventually inferred.
//It is nearly the same as any content before the first space, with the exception of shorthands like "#".
//For example, these are all valid cruxes:     div     ~div     ~class:     #     .
function determineCrux(content){
    var crux = ""
    console.log(content.unindented)
    var processed = []

    var shorthandCruxPattern = /^([\.#@])/
    var modifiedCruxPattern = /^(.+) /
    var plainCruxPattern = /^(.+)/

    //Looks for shorthands such as ".", "#", and "@".
    //If any of those are at the beginning of the line, we conclusively know what the line represents.
    //This pattern should NOT include colons, since a colon must be associated with additional characters to form a crux.
    if(content.unindented.match(shorthandCruxPattern)){
        crux = content.unindented.match(shorthandCruxPattern)[1]
        console.log(crux)
    }

    else if(content.unindented.match(modifiedCruxPattern)){
        console.log(content.unindented)
        crux = content.unindented.match(modifiedCruxPattern)[1]
        console.log(crux)
    }

    else if(content.unindented.match(plainCruxPattern)){
        console.log(content.unindented)
        crux = content.unindented.match(plainCruxPattern)[1]
        console.log(crux)
    }

    //If none of those match, then the crux is simply the undindented content.
    //In practice, this final block should never be hit.
    else{
        crux = content.unindented
        console.log(crux)
    }

    console.log(crux)
    return crux
}

//Figures out what tag a tag is and what attribute an attribute is
function determineFill(content){
    var fill = ""
    if(content.prefix.match(/[\.#]/)){
        fill = content.unindented.match(/^[#\.](.*)/)[1]
    }
    else if(content.unindented.match(/^.+?\s.+/)){
        fill = content.unindented.match(/^.+?\s(.+)/)[1]
    }
    return fill
}

//Expands key shorthands
//For example, converts "#" to "id"
function determineKey(content){
    var key = ""
    console.log(content.crux)
    console.log(content.prefix)
    if(content.crux == "."){
        key = "class"
    }
    else if(content.crux == "#"){
        key = "id"
    }
    else if(content.crux == "@"){
        key = "href"
    }
    else if(content.unindented.match(/[~]*(\w+)/)){
        key = content.unindented.match(/[~]*(\w+)/)[1]
    }
    else{
        key = null
    }
    console.log(key)
    return key
}

//Adds property to indicate that the element is a closing tag
function closingTag(content){
    var element = content
    element.position = "closing"
    return element
}



//Looks for ":" as well as strings that would represent elements/attributes.
// else if(content.unindented.match(/^[:\.#]?\w+?:?\s.+/)){
//     crux = content.unindented.match(/^([:\.#]?\w+?:?)\s.+/)[1]
//     console.log(crux)
// }
