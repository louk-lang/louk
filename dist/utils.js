module.exports = {
    clone: clone,
    file: file,
    log: log,
    setDir: setDir,
    write: write
};
var logging = false;
var dir = "../dist";
function write(content) {
    if (logging === true) {
        console.log(content);
    }
}
function log(setting) {
    logging = setting;
}
function file(path) {
    return dir + path;
}
function setDir(path) {
    dir = path;
}
function clone(input) {
    return JSON.parse(JSON.stringify(input));
}
