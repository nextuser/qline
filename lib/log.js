const debugEnable = false;
function debug(...args ){
    if(!debugEnable) return;
    
    console.log(... args )
}

module.exports = {
    debug
}