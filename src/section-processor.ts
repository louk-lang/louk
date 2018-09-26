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

    let section = sectionDefault

    for(let index = 0; index < content.length; index++){

        const line = content[index]

        if (line.match(patterns.sectionCrux)){

            //If we know anything about this section (using marker tag as a proxy)
            if (section.marker.tag){
                //Push the current section and reset
                sections.push(section)
                section = sectionDefault
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
    console.log(section)
    sections.push(section)
    console.log(sections.length)
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

        sections[index].elements = elementProcessor.assignMatches(sections[index].elements)
        sections[index].elements = elementProcessor.insertMatches(sections[index].elements)

    }

    return sections
}

function flattenElements(input){

    const content = input
    let elements = content

    for(var index = 0; index < content.length; index++){
        elements = elements.concat(content[index].elements)
    }

    return elements
}
