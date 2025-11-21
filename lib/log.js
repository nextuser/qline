//const {config}= require('dotenv');
//config({debug:false});

let debugEnable = false;
if(process.env.DEBUG){
    console.log("enable debug logging");
    debugEnable = true;
}
function debug(...args ){
    if(!debugEnable) return;

    console.log(... args )
}

module.exports = {
    debug
}