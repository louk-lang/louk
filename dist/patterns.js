module.exports = {
    prefix: /^([~:@-])/,
    staticPrefix: /^([~])/,
    suffix: /([~/])$/,
    staticSuffix: /([~/])$/,
    plainCrux: /^(.+)/,
    modifiedCrux: /^(.+?)\s/,
    staticCrux: /^([>#\.]).*/,
    fill: /^.+?\s(.+)/,
    staticFill: /^[>#\.](.*)/,
    key: /^[~:@-]*([\w\.-]+)/,
    comment: /^\/\/(.*)/,
    html: /^([<])/,
    initialSpace: /^(\s)/
};
