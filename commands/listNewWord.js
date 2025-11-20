
async function listNewWord(count){
    const chalk = require('chalk');
    const vocabBook = require('../lib/vocab');
    count = count ? count :  10;
    
    try {
        const limit = parseInt(count, 10) || 10;
        const vocabList = await vocabBook.getVocabList(limit);

        if (vocabList.length === 0) {
            console.log(chalk.yellow('生词本为空'));
            return;
        }

        // 格式化输出列表
        console.log(chalk.cyan(`\n📚 生词列表（共 ${vocabList.length} 个，最近 ${limit} 个）：`));
        vocabList.forEach((item, index) => {
            const time = new Date(item.record_time).toLocaleString();
            console.log(`${index + 1}. ${chalk.bold(item.word)} ${chalk.gray(`(${time})`)}`);
        });
    } catch (err) {
        console.log(chalk.red('查看生词列表失败：'), err.message);
    } finally {
        vocabBook.close();
    }
}

module.exports = listNewWord;