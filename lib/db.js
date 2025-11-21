const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const ProgressBar = require('progress');
const chalk = require('chalk');
const {dbPath} = require('./config');
const { debug} = require('./log')

class DictDB {
  constructor() {
    this.db = null;
  }

  // 连接数据库（首次连接时初始化表和数据）
  async connect() {
    return new Promise((resolve, reject) => {
      debug("connect db", dbPath);
      // 连接数据库（不存在则自动创建）
      this.db = new sqlite3.Database(dbPath, async (err) => {
        if (err) return reject(err);
        debug(chalk.gray(`已连接数据库：${dbPath}`));
        
        //await  this.initTables();
        resolve();
      });
    });
  }

//SELECT * FROM cdict WHERE exchange like '%:had/%' limit 1;
  queryExchange(word) {
    const match = `%:${word.toLowerCase()}/%`;
    debug("match:",match);
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM cdict WHERE exchange like  ? LIMIT 1';
      debug("sql ",sql, "word:", match);
      this.db.get(
        sql,
        [match], // 统一转为小写查询（兼容大小写输入）
        (err, row) => {
          if (err) return reject(err);
          if(row){
            resolve(row); // 找到返回对象，未找到返回 null
          }else{
            console.log(chalk.red(`未找到 "${word}" 的记录`));
          }
        }
      )
    })
  }


  // 查询单词（参数化查询，防 SQL 注入）
  queryWord(word) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM cdict WHERE word like  ? LIMIT 1';
      debug("sql ",sql, "word:", word);
      this.db.get(
        sql,
        [word.toLowerCase()], // 统一转为小写查询（兼容大小写输入）
        (err, row) => {
          if (err) return reject(err);
          if(row){
            resolve(row); // 找到返回对象，未找到返回 null
          }else{
             this.queryExchange(word).then(resolve).catch((err) => reject(err));
          }
        }
      );
    });
  }

  // 关闭数据库连接
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) console.warn(chalk.yellow('关闭数据库失败：'), err.message);
      });
    }
  }
}

module.exports = new DictDB();
