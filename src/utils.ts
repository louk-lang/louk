module.exports = {
    write: write,
    log: log
}

let logging = false

//Writing to console
function write(content){
    if (logging == true){
        console.log(content)
    }
}

function log(setting){
    logging = setting
}
