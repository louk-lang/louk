"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    prefix: /^([":@-])/,
    staticPrefix: /^(["])/,
    suffix: /(["/,])$/,
    staticSuffix: /(["/,])$/,
    plainCrux: /^(.+)/,
    modifiedCrux: /^(.+?)\s/,
    staticCrux: /^([>#\.]).*/,
    sectionCrux: /^(\w+),/,
    continuationCrux: /^(\|"?).*/,
    fill: /^.+?\s(.+)/,
    staticFill: /^[>#\.](.*)/,
    key: /^[":@-]*([\w\.-]+)/,
    loukLangAttribute: /"lang louk/,
    unindentedElement: /^[\w<]/,
    comment: /^\/\/(.*)/,
    emptyLine: /^(\s+)$/,
    html: /^([<])/,
    initialSpace: /^(\s)/,
    whitespace: /^(\s*)/,
    unindented: /^\S/,
};
