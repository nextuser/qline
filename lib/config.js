const path = require('path');
const dbPath = path.resolve(__dirname, '../', 'db', 'cdict2w.db')
 
const os = require('os');
const fs = require('fs')
const {debug} = require('./log')
const baseDir = path.resolve(os.homedir(),'.qline')
if(!fs.existsSync(baseDir)){
  fs.mkdirSync(baseDir,{recursive:true})
}

//将生词本保存到 $HOME/.qline/new_words.db
const  newWordsDbPath = path.resolve(baseDir,"new_words.db")
const  lastQueryPath  = path.resolve(baseDir,"lastQuery.json")

debug('newWordsDbPath',newWordsDbPath);
module.exports ={
    dbPath,
    newWordsDbPath,
    lastQueryPath
}