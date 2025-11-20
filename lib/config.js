const path = require('path');
const dbPath = path.resolve(__dirname, '../', 'db', 'cdict2w.db')
const os = require('os');
const fs = require('fs')

const baseDir = path.resolve(os.homedir(),'.cdict')
if(!fs.existsSync(baseDir)){
  fs.mkdirSync(baseDir,{recursive:true})
}
const  lastQueryPath  = path.resolve(baseDir,"lastQuery.json")

module.exports ={
    dbPath,
    lastQueryPath
}