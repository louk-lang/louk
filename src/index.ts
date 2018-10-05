import * as parser from "./parser";

module.exports = (content, options) => {
    return parser.parse(content, options);
};
