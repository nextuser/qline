const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const {newWordsDbPath,lastQueryPath } = require('./config')
const {debug} = require('./log')
const chalk = require('chalk');


class VocabBook {
  constructor() {
    debug('db path : newWordsDbPath',newWordsDbPath)
    this.db = null;
    
  }

    async connect() {
    return new Promise((resolve, reject) => {
      debug("connect db", newWordsDbPath);
      // 连接数据库（不存在则自动创建）
      this.db = new sqlite3.Database(newWordsDbPath, async (err) => {
        if (err) return reject(err);
        debug(chalk.gray(`已连接数据库：${newWordsDbPath}`));
        
        await  this.initTables();
        resolve();
      });
    });
  }

  async ensureDbConected(){
    if(!this.db){
      await this.connect();

    }
    
  }

  // 记录生词（去重，验证单词是否存在于 cdict）
  async recordWord(word) {
    await this.ensureDbConected();

    // 2. 插入生词本（忽略重复）
    return new Promise((resolve) => {
      this.db.run(
        'INSERT OR IGNORE INTO vocab (word) VALUES (?)',
        [word.toLowerCase()],
        (result ,err) => {
          if (err) return resolve({ success: false, msg: err.message });

          debug("result if insert into vocab is", result);
          // 判断是否插入成功（changes 为 1 表示新增，0 表示已存在）
          resolve({ success: true, msg: `已记录生词：${word}` });
        }
      );
    });
  }

  async deleteWord(word){
    await this.ensureDbConected();
    this.db.run('DELETE FROM vocab WHERE word = ?', [word.toLowerCase()],(result,err)=>{
      if(err) throw err;
      debug("delete result:",result)
    });
  }

  // 随机获取一个生词（用于复习）
  async getRandomWord() {
    await this.ensureDbConected();


    // const row = await this.db.all(
    //   'SELECT word, record_time from vocab ORDER BY RANDOM() LIMIT ?',[1]
    // );
    // return row.word;


    return new Promise((resolve) => {
      this.db.all(
        'SELECT word,record_time from vocab ORDER BY RANDOM() LIMIT ?',
        [1],
        (err, rows) => {
          if (err ) throw err;
          const w = rows[0].word;
          debug('find random word',w)
          resolve(w);
        }
      );
    });
  }

  // 初始化表结构（stardict 主表 + vocab 生词本）
  async initTables() {
     await this.ensureDbConected();
  
    const createSql = `
      -- 生词本表格
      CREATE TABLE IF NOT EXISTS "vocab" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
        "word" VARCHAR(64) COLLATE NOCASE NOT NULL UNIQUE,
        "record_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const result = await this.db.run(createSql);
    debug(chalk.gray('vocab表结构初始化完成'));
  
  }

  // 查看生词列表（支持指定数量，默认 10 个，按记录时间倒序）
  async getVocabList(limit = 10) {
    await this.ensureDbConected();
    return new Promise((resolve) => {
      this.db.all(
        'SELECT word, record_time FROM vocab ORDER BY record_time DESC LIMIT ?',
        [limit],
        (err, rows) => {
          if (err || !rows.length) resolve([]);
          resolve(rows);
        }
      );
    });
  }

  // 保存上次查询的单词
  saveLastQuery(word) {
    fse.writeJsonSync(lastQueryPath, { word, time: new Date().toISOString() });
  }

  // 获取上次查询的单词
  getLastQuery() {
    if (!fse.existsSync(lastQueryPath)) return null;
    try {
      const data = fse.readJsonSync(lastQueryPath);
      return data.word || null;
    } catch (e) {
      return null;
    }
  }

  // 关闭连接
  close() {
    if(!this.db) return;
    this.db.close((err) => {
      if (err) console.warn('生词本数据库关闭失败：', err.message);
    });
  }
}

module.exports = new VocabBook();

