async function queryWord(word){
    const chalk = require('chalk');
    const dictDB = require('cdict_query');
    const vocabBook = require('../lib/vocab');
    const {handleError} = require('../lib/log');
    const {showWord} = require('../lib/showWord');
    try {
        await dictDB.connect();
        await vocabBook.connect();

        // 无参数时，获取上次查询的单词
        if (!word || word.length == 0) {
          word = vocabBook.getLastQuery();
          if (!word) {
            console.log(chalk.red('未找到上一次查询的单词，请指定单词或先查询一个单词'));
            return;
          }
        }

        if (!word) return { success: false, msg: '单词不能为空' };

        // 1. 验证单词是否存在于主词典
       await dictDB.queryWord(word).then(async (value)=>{
          if(!value){
            console.log(chalk.red('单词不存在于词典中'));
            return { success: false, msg: `单词 "${word}" 不存在于词典` };
          }
          
                  // 记录生词
          const { success, msg } = await vocabBook.recordWord(word);
          console.log(chalk.red(msg));
          if(success){
            showWord(value);
          }
       })
       .catch(err => {
          console.log(chalk.red('单词不存在于词典中'));
          return { success: false, msg: `单词 "${word}" 不存在于词典` };
        });


      } catch (err) {
        console.log(chalk.red('记录生词失败：'), err.message);
        handleError(err);
      } finally {
        dictDB.close();
        vocabBook.close();
      }
}

module.exports = queryWord;