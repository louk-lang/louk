module.exports = {
    write: write,
    log: log
}

var logging = true

//Writing to console
function write(content){
    if (logging == true){
        console.log(content)
    }
}

function log(setting){
    logging = setting
}
