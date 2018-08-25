const fs = require('fs');

require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const parser = require("./parser")

module.exports = function(content){

    return html = parser.parse(content);
}
