const parser = require("./parser")

module.exports = function(content, options){
    return parser.parse(content, options, logging);
}
