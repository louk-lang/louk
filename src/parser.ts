module.exports = {
    parse: parse
}

const _ = require("underscore")

const patterns = require("./patterns")
const lineProcessor = require("./line-processor")
const elementProcessor = require("./element-processor")
const htmlGenerator = require("./html-generator")
const utils = require("./utils")
const write = utils.write

function parse(input, logging){

    utils.log(logging)

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

    lines = lineProcessor.breakLines(raw)
    write("After breaking lines:")
    write(lines)

    lines = lineProcessor.objectifyLines(lines)
    write("After pushing into object:")
    write(lines)

    lines = lineProcessor.determineProperties(lines)
    write("After determining properties:")
    write(lines)

    lines = lineProcessor.deleteComments(lines)
    write("After deleting comments:")
    write(lines)

    elements = elementProcessor.assignAttributes(lines)
    write("After structuring as elements:")
    write(elements)

    elements = elementProcessor.assignMatches(elements)
    write("After assigning matches:")
    write(elements)

    elements = elementProcessor.insertMatches(elements)
    write("After adding closing tags:")
    write(elements)

    html = htmlGenerator.generateHTML(elements)
    write("After generating HTML:")
    write(html)

    return html

}
