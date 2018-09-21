module.exports = {
    breakLines: breakLines,
    deleteComments: deleteComments,
    objectifyLines: objectifyLines,
    determineProperties: determineProperties
}

const patterns = require("./patterns")
const propertyDeterminer = require("./property-determiner")

function breakLines(input){

    const content = input
    let lines = content

    lines = content.split("\n")

    return lines

}

function deleteComments(input){

    const content = input
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

function objectifyLines(input){

    const content = input
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

function determineProperties(input){

    const content = input
    let lines = content

    for(let index = 0; index < content.length; index++){
        let value = content[index]
        lines[index].line = index
        let indentInfo = propertyDeterminer.determineIndent(value.raw)
        lines[index].index = index
        lines[index].indent = indentInfo[0]
        lines[index].unindented = indentInfo[1]
        lines[index].lineType = propertyDeterminer.determineLineType(lines[index])
        lines[index].crux = propertyDeterminer.determineCrux(lines[index])
        lines[index].prefix = propertyDeterminer.determinePrefix(lines[index])
        lines[index].suffix = propertyDeterminer.determineSuffix(lines[index])
        lines[index].selfClosing = propertyDeterminer.determineSelfClosing(lines[index])
        lines[index].classification = propertyDeterminer.determineClassification(lines[index])
        lines[index].key = propertyDeterminer.determineKey(lines[index])
        lines[index].interpretation = propertyDeterminer.determineInterpretation(lines[index])
        lines[index].fill = propertyDeterminer.determineFill(lines[index])
        lines[index].directiveType = propertyDeterminer.determineDirectiveType(lines[index])
        lines[index].preceding = []
    }

    return lines
}
