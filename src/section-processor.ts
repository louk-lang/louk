module.exports = {
    findSections: findSections
}

const patterns = require("./patterns")

function findSections(input){

    const content = input
    input
    let sections = []

    const sectionDefault = {
        isLouk: false,
        marker: {
            lines: [],
            tag: ""
        },
        body:{
            raw: ""
        }
    }

    let section = sectionDefault

    for(let index = 0; index < content.length; index++){

        const line = content[index]

        if (line.match(patterns.sectionCrux)){

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
        //Otherwise, add it to the body object
        else{
            section.body.raw = section.body.raw + line
        }

    sections.push(section)
    section = sectionDefault

    }
    return sections
}
