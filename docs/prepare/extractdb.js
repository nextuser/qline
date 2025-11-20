// const sqlite3 = require('sqlite3').verbose();

// const createSql = `
// CREATE TABLE IF NOT EXISTS "stardict" (
// "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
// "word" VARCHAR(64) COLLATE NOCASE NOT NULL UNIQUE,
// "phonetic" VARCHAR(64),
// "translation" TEXT,
// "tag" VARCHAR(64),
// "bnc" INTEGER DEFAULT(NULL),
// "frq" INTEGER DEFAULT(NULL),
// "exchange" TEXT,
// );
// `
// const indexSql = `
// CREATE UNIQUE INDEX "stardict_1" ON stardict (id);
// CREATE UNIQUE INDEX "stardict_2" ON stardict (word);
// CREATE INDEX "stardict_3" ON stardict (sw, word collate nocase);
// CREATE INDEX "sd_1" ON stardict (word collate nocase);
// `
// const selectSql = `
// select id, word,phonetic,translation,tag,bnc,frq, exchange  from stardict where (frq !=0 and frq < 9000) or (bnc != 0 and bnc < 9000) and sw <> word;
// `
// const insertSql = `
// insert into stardict (id, word,phonetic,translation,tag,bnc,frq, exchange) values (?,?,?,?,?,?,?,?);
// `
// /**
//  * 从原数据库提取部分数据生成新数据库
//  * @param {string} oldDbPath - 原数据库路径
//  * @param {string} newDbPath - 新数据库路径
//  * @param {string} tableName - 目标表名
//  * @param {string} filterSql - 筛选条件（如 "WHERE length(word) < 5"）
//  */
// function extractToNewDb(oldDbPath, newDbPath, tableName, filterSql) {
//   // 1. 打开原数据库
//   // const oldDb = new sqlite3.Database(oldDbPath, (err) => {
//   //   if (err) throw err;
//   //   console.log('已连接原数据库');
//   // });

//   // 2. 打开新数据库（不存在则自动创建）
//   const newDb = new sqlite3.Database(newDbPath, (err) => {
//     if (err) throw err;
//     console.log('已创建新数据库');
//   });

//   // 3. 复制表结构（获取原表的 CREATE TABLE 语句）
//   // oldDb.get(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
//   //   if (err) throw err;
//   //   if (!row) throw new Error(`原数据库中不存在表 ${tableName}`);

//     const createTableSql = createSql; // 原表创建语句

//     // 4. 在新数据库中创建表
//     newDb.run(createTableSql, (err) => {
//       if (err) throw err;
//       console.log(`已在新数据库创建表 ${tableName}`);

//       // 5. 从原表查询筛选后的数据，插入新表
//       //const selectSql = `SELECT * FROM ${tableName} ${filterSql || ''}`;
//       oldDb.all(selectSql, (err, rows) => {
//         if (err) throw err;
//         if (rows.length === 0) {
//           console.log('没有符合条件的数据');
//           return;
//         }

//         // 批量插入（使用事务提高效率）
//         newDb.run('BEGIN TRANSACTION');
//         // const placeholders = rows[0] && Object.keys(rows[0]).map(() => '?').join(',');
//         // const insertSql = `INSERT INTO ${tableName} VALUES (${placeholders})`;
//         const stmt = newDb.prepare(insertSql);

//         rows.forEach(row => {
//           stmt.run(Object.values(row));
//         });

//         stmt.finalize();
//         newDb.run('COMMIT', (err) => {
//           if (err) throw err;
//           console.log(`成功插入 ${rows.length} 条数据到新数据库`);
//           // 关闭数据库连接
//           oldDb.close();
//           newDb.close();
//         });
//       });
//   });
// }

// // 示例：从 old.db 提取 words 表中长度 <5 的单词到 new.db
// extractToNewDb(
//   './stardict.db',       // 原数据库路径
//   './cdict.db',       // 新数据库路径
//   'words',          // 目标表名
//   'where (frq !=0 and frq < 9000) or (bnc != 0 and bnc < 9000) '  // 筛选条件
// );
