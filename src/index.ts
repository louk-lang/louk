const parser = require("./parser")

// Turn verbose logging on or off
let logging = false

module.exports = function(content, options){
    return parser.parse(content, options, logging);
}
