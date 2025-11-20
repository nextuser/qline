const sqlite3 = require('sqlite3').verbose();

const createTableSqls =[   `
CREATE TABLE "cdict" (
"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
"word" VARCHAR(64) COLLATE NOCASE NOT NULL UNIQUE,
"phonetic" VARCHAR(64),
"translation" TEXT,
"tag" VARCHAR(64),
"bnc" INTEGER DEFAULT(NULL),
"frq" INTEGER DEFAULT(NULL),
"exchange" TEXT
)`,
`CREATE UNIQUE INDEX "cdict_1" ON cdict (id)`,
`CREATE UNIQUE INDEX "cdict_2" ON cdict (word)`,
`CREATE INDEX "sd_1" ON cdict (word collate nocase)`
];

// /**
//  * 从原数据库提取部分数据生成新数据库
//  * @param {string} oldDbPath - 原数据库路径
//  * @param {string} newDbPath - 新数据库路径
//  * @param {string} tableName - 目标表名
//  * @param {string} filterSql - 筛选条件（如 "WHERE length(word) < 5"）
//  */
// function createNewDb(dbPath) {
//   //1. 打开原数据库
//   const newDb = new sqlite3.Database(dbPath, (err) => {
//     if (err) throw err;
//     console.log('已连接数据库:' + dbPath);
//   });

//   //2. 打开新数据库（不存在则自动创建）
//   createTableSqls.forEach((sql) =>{
//     newDb.run(sql, (err) => {
//           if (err) throw err;
//           console.log(`sql executed success: ${sql}`);
//     })
//   })

  
// }


function createNewDb(dbPath) {
  //1. 打开数据库
  const newDb = new sqlite3.Database(dbPath, (err) => {
    if (err) throw err;
    console.log('已连接数据库:' + dbPath);
  });

  //2. 串行执行创建表和索引语句
  function executeSql(index) {
    if (index >= createTableSqls.length) {
      console.log('所有表和索引创建完成');
      newDb.close();
      return;
    }

    const sql = createTableSqls[index];
    newDb.run(sql, (err) => {
      if (err) {
        console.error(`执行SQL失败: ${sql}`, err);
        throw err;
      }
      console.log(`SQL执行成功: ${sql}`);
      executeSql(index + 1); // 执行下一个SQL语句
    });
  }

  executeSql(0); // 开始执行第一个SQL语句
}
function extractData(oldDbPath,newDbPath){
    //1. 打开原数据库
    const oldDb = new sqlite3.Database(oldDbPath, (err) => {
      if (err) throw err;
      console.log('已连接原数据库');
    });
    const newDb = new sqlite3.Database(newDbPath, (err) => {
      if (err) throw err;
      console.log('已创建新数据库');
    });


    //抽取使用频率在20000 前的单词。
    const LIMIT = 20000;
    const whereClause = ` where (frq !=0 and frq < ${LIMIT}) or (bnc != 0 and bnc < ${LIMIT})`
    const selectSql = ` select id, word,phonetic,translation,tag,bnc,frq, exchange from cdict ${whereClause} ` ;
    
    console.log("selectSql:",selectSql);
    const insertSql = `
    insert into cdict (id, word,phonetic,translation,tag,bnc,frq, exchange) values (?,?,?,?,?,?,?,?);
    `
      // 5. 从原表查询筛选后的数据，插入新表
      //const selectSql = `SELECT * FROM ${tableName} ${filterSql || ''}`;
    oldDb.all(selectSql, (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) {
          console.log('没有符合条件的数据');
          return;
        }

        // 批量插入（使用事务提高效率）
        newDb.run('BEGIN TRANSACTION');
        // const placeholders = rows[0] && Object.keys(rows[0]).map(() => '?').join(',');
        // const insertSql = `INSERT INTO ${tableName} VALUES (${placeholders})`;
        const stmt = newDb.prepare(insertSql);

        rows.forEach(row => {
          stmt.run(Object.values(row));
        });

        stmt.finalize();
        newDb.run('COMMIT', (err) => {
          if (err) throw err;
          console.log(`成功插入 ${rows.length} 条数据到新数据库`);
          // 关闭数据库连接
          oldDb.close();
          newDb.close();
        });
      });
}

const oldDbPath = './stardict.db'
const newDbPath = './cdict2w.db'
createNewDb(newDbPath)

// 示例：从 old.db 提取 words 表中长度 <5 的单词到 new.db
extractData(
  oldDbPath,newDbPath
);
