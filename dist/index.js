var parser = require("./parser");
var logging = false;
module.exports = function (content, options) {
    return parser.parse(content, options, logging);
};
