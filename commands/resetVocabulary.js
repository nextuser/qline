
async function resetVocabulary(){
    const chalk = require('chalk');
    const vocabBook = require('../lib/vocab');

    try {
        await vocabBook.reset();
    } catch (err) {
        console.log(chalk.red('清空生词列表失败：'), err.message);
    } finally {
        vocabBook.close();
    }
    
}

module.exports = resetVocabulary;