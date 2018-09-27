module.exports = {
    findSections: findSections,
    processSections: processSections,
    flattenElements: flattenElements
}

const patterns = require("./patterns")
const lineProcessor = require("./line-processor")
const elementProcessor = require("./element-processor")

function findSections(input){

    const content = input
    let sections = []

    const sectionDefault = {
        isLouk: false,
        elements: [],
        marker: {
            lines: [],
            elements: [],
            tag: ""
        },
        body:{
            raw: "",
            lines:[],
            elements: []
        }
    }

    let section = JSON.parse(JSON.stringify(sectionDefault))

    for(let index = 0; index < content.length; index++){

        let line = content[index]
        if (line.match(patterns.sectionCrux)){
            //As long as this isn't our first iteration through this loop
            if (section.marker.lines.length > 0){

                //Push the current section and reset
                sections.push(section)
                section = JSON.parse(JSON.stringify(sectionDefault))
            }
            section.marker.lines.push(line)

            //Pull out the section type
            section.marker.tag = line.match(patterns.sectionCrux)[1]
            if(section.marker.tag == "template"){
                section.isLouk = true
            }

        }

        //If the line isn't indented, add it to the marker object
        else if(line.match(patterns.unindented)){
            section.marker.lines.push(line)
            if (line.match(patterns.loukLangAttribute)){
                section.isLouk = true
            }
        }

        //If the line is part of a Louk section, push it into an array
        else if(section.isLouk){
            section.body.lines.push(line)
            section.body.raw = section.body.raw + line
        }

        //Otherwise, just add it to a string, as we won't be parsing it
        else{
            section.body.raw = section.body.raw + line
        }
    }

    sections.push(section)
    return sections
}

function processSections(input){

    const content = input
    let sections = content

    for(var index = 0; index < sections.length; index++){

        //For each section, process the lines
        sections[index].marker.lines = lineProcessor.objectifyLines(sections[index].marker.lines)

        sections[index].marker.lines = lineProcessor.determineProperties(sections[index].marker.lines)
        sections[index].marker.lines = lineProcessor.deleteComments(sections[index].marker.lines)

        //Then turn those lines into element objects and begin to process them
        sections[index].marker.elements = elementProcessor.assignAttributes(sections[index].marker.lines)

        //Then push the marker elements up into the section elements
        sections[index].elements = sections[index].elements.concat(sections[index].marker.elements)

        //If the section is Louk content, process the body as well.
        if(sections[index].isLouk){

            sections[index].body.lines = lineProcessor.objectifyLines(sections[index].body.lines)
            sections[index].body.lines = lineProcessor.determineProperties(sections[index].body.lines)
            sections[index].body.lines = lineProcessor.deleteComments(sections[index].body.lines)

            sections[index].body.elements = elementProcessor.assignAttributes(sections[index].body.lines)
            sections[index].elements = sections[index].elements.concat(sections[index].body.elements)

        }
        //If the section is not Louk content, pass the body through
        else{
            sections[index].elements.push({
                raw: sections[index].body.raw,
                passthrough: true,
            })
        }

        sections[index].elements = elementProcessor.assignMatches(sections[index].elements)
        sections[index].elements = elementProcessor.insertMatches(sections[index].elements)

    }
    return sections
}

function flattenElements(input){

    const content = input
    let elements = []

    for(var index = 0; index < content.length; index++){
        elements = elements.concat(content[index].elements)
    }

    return elements
}
