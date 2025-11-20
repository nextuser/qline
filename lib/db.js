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
        
        await  this.initTables();
        resolve();
      });
    });
  }


  // 初始化表结构（stardict 主表 + vocab 生词本）
  initTables() {
    return new Promise((resolve, reject) => {
      const createSql = `
        -- 生词本表格
        CREATE TABLE IF NOT EXISTS "vocab" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
          "word" VARCHAR(64) COLLATE NOCASE NOT NULL UNIQUE,
          "record_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      this.db.run(createSql, (err) => {
        if (err) return reject(err);
        debug(chalk.gray('vocab表结构初始化完成'));
        resolve();
      });
    });
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
          resolve(row); // 找到返回对象，未找到返回 null
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
