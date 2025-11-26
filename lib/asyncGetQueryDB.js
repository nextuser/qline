const ProgressBar = require('progress');
const chalk = require('chalk');
const { debug} = require('./log')
const cq = require("cdict_query");
const testByTag = require('./testByTag');

class QueryDB {
  constructor() {
    this.db = null;
  }

  // 连接数据库（首次连接时初始化表和数据）
  async connect() {
    this.db = await cq.asyncGetDB();
  }

//SELECT * FROM cdict WHERE exchange like '%:had/%' limit 1;
  queryExchange(word) {
    const match = `%:${word.toLowerCase()}/%`;
    debug("queryExchange match:",match);
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM cdict WHERE exchange like  ? LIMIT 1';
      debug("queryExchange sql ",sql, "word:", match);
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

  queryByTag(tag , count = 1){
    const getTagQuery = require('./getTagQuery')
    const sqlQuery = getTagQuery(tag,count);
    if(!sqlQuery){
      console.log(chalk.red("error to get sqlQuery for tag:") ,tag);
      return undefined ;
    }

    return new Promise((resolve, reject) => {
      this.db.all(
        sqlQuery,
        [], // 统一转为小写查询（兼容大小写输入）
        (err, row) => {
          if (err) return reject(err);
          if(row){
            resolve(row)
          }else{
            reject(chalk.red(`未找到 "${word}" 的记录`));
          }
      });
    });//end return
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
            debug("queryWord row :",row);
            resolve(row); // 找到返回对象，未找到返回 null
          }else{
             debug("queryWord => queryExchange")
             this.queryExchange(word).then(resolve).catch((err) => reject(err));
          }
        }
      );//end return 
    });
  }//end queryWord

  // 关闭数据库连接
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) console.warn(chalk.yellow('关闭数据库失败：'), err.message);
      });
    }
  }
}

async function asyncGetQueryDB(){
  const queryDB = new QueryDB();
  await queryDB.connect();
  return queryDB;
}
module.exports = asyncGetQueryDB;


async function testQuery(){
   const db = await asyncGetQueryDB();
   let result = await db.queryByTag('gk');
   console.log("query by tag ,result :" , result)
}


//testQuery();