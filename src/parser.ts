module.exports = {
    parse: parse
}

const _ = require("underscore")

const patterns = require("./patterns")
const lineProcessor = require("./line-processor")
const sectionProcessor = require("./section-processor")
const elementProcessor = require("./element-processor")
const htmlGenerator = require("./html-generator")
const utils = require("./utils")
const write = utils.write

function parse(input, options, logging){

    utils.log(logging)

    let raw = ""
    let lines = []
    let sections = []
    let elements = []
    let html = ""

    raw = input

    lines = lineProcessor.breakLines(raw)

    sections = sectionProcessor.findSections(lines)

    lines = lineProcessor.objectifyLines(lines)

    lines = lineProcessor.determineProperties(lines)

    lines = lineProcessor.deleteComments(lines)

    elements = elementProcessor.assignAttributes(lines)

    elements = elementProcessor.assignMatches(elements)

    elements = elementProcessor.insertMatches(elements)

    html = htmlGenerator.generateHTML(elements, options)

    return html

}
