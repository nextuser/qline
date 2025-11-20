
async function deleteNewWord(word){
    const chalk = require('chalk');
    const vocabBook = require('../lib/vocab');

    try {
        await vocabBook.deleteWord(word);
    } catch (err) {
        console.log(chalk.red('查看生词列表失败：'), err.message);
    } finally {
        vocabBook.close();
    }
    
}

module.exports = deleteNewWord;