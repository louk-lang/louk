const fs = require('fs');

require.extensions['.louk'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const parser = require("./parser")

//Turn verbose logging on or off
let logging = false

module.exports = function(content, options){
    let html = parser.parse(content, options, logging);
    return html
}
