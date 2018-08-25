module.exports = {
    write: write,
    log: log,
    file: file,
    setDir: setDir
};
var logging = false;
var dir = "../dist";
function write(content) {
    if (logging == true) {
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
