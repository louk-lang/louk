var fs = require('fs');
require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var parser = require("./parser");
module.exports = function (content) {
    return html = parser.parse(content);
};
