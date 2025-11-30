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

function handleError(err){
    const chalk = require('chalk');
    console.log(chalk.red(err.message));
    if(debugEnable) throw err;
    process.exit(1);
}

module.exports = {
    debug,
    handleError
}