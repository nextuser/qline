
const cq = require('cdict_query');
const chalk = require('chalk');
const {handleError} = require('../lib/log');

async function testQuery(){
    const  wordDB  = await cq.asyncGetDB();

    const selectSql = `select * from ${cq.getTableName()} order by random() limit 5`;
    wordDB.all(selectSql, (err, rows) => {
        if (err) handleError(err);
        if(!rows || rows.length === 0){
            console.log('查询到0条记录');
            return;
        }
        console.log(`查询到${rows.length}条记录`);
        rows.forEach((row)=>{
            console.log(row.word,row.translation);
        })
    });

};

async function testQueryWord(word ){
  const row = await cq.queryWord(word);
  if(row){
    console.log(row.word, row.phonetic, row.translation)
  } else{
      console.log('not found:',word)
  }
}

async function testCountLines(){
    const  wordDB  = await cq.asyncGetDB();

    const selectSql = `select count(1) from ${cq.getTableName()} `;
    wordDB.get(selectSql, (err, row) => {
        if (err) handleError(err);
        if(!row){
            console.log(chalk.blue(`${cq.getTableName()}查询到0条记录`));
            return;
        }
        console.log(chalk.red(`${cq.getTableName()} 查询到${row['count(1)']}条记录`));

    });
}

testQuery();
testQueryWord("circumvent");
testCountLines();

