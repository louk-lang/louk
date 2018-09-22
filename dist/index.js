var fs = require('fs');
require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var parser = require("./parser");
var logging = false;
module.exports = function (content, options) {
    var html = parser.parse(content, options, logging);
    return html;
};
