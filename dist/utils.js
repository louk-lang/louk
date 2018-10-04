"use strict";
exports.__esModule = true;
exports["default"] = {
    clone: clone
};
function clone(input) {
    return JSON.parse(JSON.stringify(input));
}
