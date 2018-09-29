module.exports = {
    determineClassification: determineClassification,
    determinePrefix: determinePrefix,
    determineSuffix: determineSuffix,
    determineSelfClosing: determineSelfClosing,
    determineInterpretation: determineInterpretation,
    determineIndent: determineIndent,
    determineCrux: determineCrux,
    determineDirectiveType: determineDirectiveType,
    determineFill: determineFill,
    determineKey: determineKey,
    determineLineType: determineLineType,
    determineWhitespace: determineWhitespace
}

const patterns = require("./patterns")

//Determines whether each line represents an attribute or a tag
function determineClassification(input){

    const content = input
    let classification = ""

    if(content.crux == '#'){
        classification = "attribute"
    }
    else if(content.crux == '.'){
        classification = "attribute"
    }
    else if(content.crux == '>'){
        classification = "attribute"
    }
    else if(content.prefix == '"'){
        classification = "attribute"
    }
    else if(content.prefix == '-'){
        classification = "attribute"
    }
    else if(content.prefix == '@'){
        classification = "attribute"
    }
    else if(content.prefix == ':'){
        classification = "attribute"
    }
    else{
        classification = "tag"
    }

    return classification;
}

function determinePrefix(input){

    const content = input
    let prefix = ""

    if(content.lineType == "louk"){

        let matches = content.crux.match(patterns.prefix)
        if(matches){
            prefix = matches[1]
        }
    }

    return prefix
}

function determineSuffix(input){

    const content = input
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

function determineSelfClosing(input){

    const content = input
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
function determineInterpretation(input){

    const content = input
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
function determineIndent(input){

    const content = input
    let trimmed = content
    let indent = 0

    while(trimmed.match(patterns.initialSpace)){
        trimmed = trimmed.substr(1)
        indent = indent + 1
    }
    return [indent, trimmed]
}


function determineCrux(input){

    const content = input
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
function determineFill(input){

    const content = input
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

function determineDirectiveType(input){

    const content = input
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
function determineKey(input){

    const content = input
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

function determineLineType(input){

    const content = input
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

function determineWhitespace(input){

    const content = input
    const whitespace = content.raw.match(patterns.whitespace)[1]

    return whitespace
}
