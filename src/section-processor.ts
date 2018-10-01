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
        isLouk: null,
        isMarked: null,
        elements: [],
        marker: {
            lines: [],
            elements: [],
            tag: ""
        },
        body:{
            lines:[],
            elements: []
        }
    }

    let section = clone(sectionDefault)

    for(let index = 0; index < content.length; index++){

        let line = content[index]

        if (line.match(patterns.sectionCrux)){

            //As long as this isn't our first iteration through this loop
            if (section.marker.lines.length > 0 || section.body.lines.length > 0){
                //Push the current section and reset
                sections.push(section)
                section = clone(sectionDefault)
            }

            section.isMarked = true

            section.marker.lines.push(line)

            //Pull out the section type
            section.marker.tag = line.match(patterns.sectionCrux)[1]

            if(section.marker.tag == "template"){
                section.isLouk = true
            }
            else{
                section.isLouk = false
            }


        }

        else if(line.match(patterns.unindentedElement)){

            //As long as this isn't our first iteration through this loop
            if (section.marker.lines.length > 0){
                //Push the current section and reset
                sections.push(section)
                section = clone(sectionDefault)
            }

            section.isMarked = false
            section.isLouk = true

            section.body.lines.push(line)
        }

        //If the line isn't indented, and the section is marked, add the line to the marker object
        else if(line.match(patterns.unindented) && section.isMarked){

            section.marker.lines.push(line)
            if (line.match(patterns.loukLangAttribute)){
                section.isLouk = true
            }
        }

        //If the line is part of a Louk section, push it into an array
        else if(section.isLouk){
            section.body.lines.push(line)
        }

        //Otherwise, we won't be parsing it
        else if(section.marker.tag != ""){
            section.body.lines.push(line)
        }

    }

    sections.push(section)
    return sections
}

function processSections(input, options){

    const content = input
    let sections = content

    for(var index = 0; index < sections.length; index++){

        //For each section, process the lines
        sections[index].marker.lines = lineProcessor.objectifyLines(sections[index].marker.lines)

        sections[index].marker.lines = lineProcessor.determineProperties(sections[index].marker.lines)
        sections[index].marker.lines = lineProcessor.deleteComments(sections[index].marker.lines)

        //Then turn those lines into element objects and begin to process them
        sections[index].marker.elements = elementProcessor.assignAttributes(sections[index].marker.lines)

        //If there are language options, and the section's marker tag doesn't have a language explicitly set
        if(options && options.langs && !sections[index].marker.elements[0].attributes.lang){
            const tag = sections[index].marker.tag
            const lang = options.langs[tag]
            //If there is a language setting for this specific section
            if (options.langs[tag]){
                //Then set the lang attribute
                sections[index].marker.elements[0].attributes.lang = {
                    data: lang,
                    interpretation: "static"
                }
            }
        }

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
        else {
            sections[index].elements.push({
                lines: sections[index].body.lines,
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

function clone(input){
    return JSON.parse(JSON.stringify(input))
}
