const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const {dbPath,lastQueryPath } = require('./config')
const {debug} = require('./log')


class VocabBook {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
  }

  // 记录生词（去重，验证单词是否存在于 cdict）
  async recordWord(word) {
    if (!word) return { success: false, msg: '单词不能为空' };

    // 1. 验证单词是否存在于主词典
    const existsInDict = await new Promise((resolve) => {
      this.db.get(
        'SELECT word FROM cdict WHERE word = ? LIMIT 1',
        [word.toLowerCase()],
        (err, row) => resolve(!!row)
      );
    });

    if (!existsInDict) {
      return { success: false, msg: `单词 "${word}" 不存在于词典` };
    }

    // 2. 插入生词本（忽略重复）
    return new Promise((resolve) => {
      this.db.run(
        'INSERT OR IGNORE INTO vocab (word) VALUES (?)',
        [word.toLowerCase()],
        (err) => {
          if (err) return resolve({ success: false, msg: err.message });
          // 判断是否插入成功（changes 为 1 表示新增，0 表示已存在）
          const isNew = this.db.changes > 0;
          if (isNew) {
            resolve({ success: true, msg: `已记录生词：${word}` });
          } else {
            resolve({ success: false, msg: `生词 "${word}" 已存在` });
          }
        }
      );
    });
  }

  // 随机获取一个生词（用于复习）
  getRandomWord() {
    return new Promise((resolve) => {
      this.db.get(
        'SELECT v.word, s.phonetic, s.translation FROM vocab v ' +
        'LEFT JOIN cdict s ON v.word = s.word ' +
        'ORDER BY RANDOM() LIMIT 1',
        (err, row) => {
          if (err || !row) resolve(null);
          resolve(row);
        }
      );
    });
  }

  // 查看生词列表（支持指定数量，默认 10 个，按记录时间倒序）
  getVocabList(limit = 10) {
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
    this.db.close((err) => {
      if (err) console.warn('生词本数据库关闭失败：', err.message);
    });
  }
}

module.exports = new VocabBook();

