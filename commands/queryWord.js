
async function queryWord(word){
    const {convertTags } = require('../lib/tags')
    const chalk = require('chalk');
    const dictDB = require('../lib/db');
    const vocabBook = require('../lib/vocab');
    try {
 

        // 连接数据库
        await dictDB.connect();
        await vocabBook.connect();
        // 查询单词
        const result = await dictDB.queryWord(word);

        if (result) {
            // 格式化输出结果
            console.log(chalk.green.bold(`【${result.word}】`) + (result.phonetic ? chalk.gray(` ${result.phonetic}`) : ''));

            console.log(chalk.blue(`释义：`));
            // 拆分释义（ECDICT 用 / 分隔多个释义）
            const translations = result.translation.split('/').filter(t => t.trim());
            translations.forEach((t, i) => {
                console.log(`  ${i + 1}. ${t.trim()}`);
            });
            if (result.bnc || result.frq) {
                console.log(chalk.gray(`词频：BNC ${result.bnc || '无'} | FRQ ${result.frq || '无'}`));
            }
            if (result.exchange) {
                console.log(chalk.magenta(`变形：`) + result.exchange);
            }

            if (result.tag){
                 console.log(chalk.cyan(`标签：`) + convertTags(result.tag));
            }
                // 保存上次查询的单词
            vocabBook.saveLastQuery(result.word);
        } else {
              
            console.log(chalk.red(`未找到 "${word}" 的记录`));
        }
    } catch (err) {
        throw err;
        //console.log(chalk.red('查询失败：'), err.message);
    } finally {
        // 关闭连接
        dictDB.close();
        vocabBook.close();
    }
}

module.exports = queryWord;