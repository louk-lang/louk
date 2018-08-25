module.exports = {
    write: write,
    log: log
};
var logging = false;
function write(content) {
    if (logging == true) {
        console.log(content);
    }
}
function log(setting) {
    logging = setting;
}
