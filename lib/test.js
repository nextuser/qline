const sqlite3 = require('sqlite3').verbose();
const {dbPath } = require('./config');
//1. 打开原数据库
const oldDb = new sqlite3.Database(dbPath, (err) => {
    if (err) throw err;
    console.log('已连接原数据库',dbPath);
});

const selectSql = `select * from cdict limit 5`;
oldDb.all(selectSql, (err, rows) => {
    rows.forEach((row)=>{
        console.log(row.word);
    })
});