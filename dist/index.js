"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser = require("./parser");
module.exports = function (content, options) {
    return parser.parse(content, options);
};
