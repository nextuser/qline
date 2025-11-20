
async function recallNewWord(){
    const {convertTags } = require('../lib/tags')
    const chalk = require('chalk');
    const dictDB = require('../lib/db');
    const vocabBook = require('../lib/vocab');
    try {
        await dictDB.connect();
        let randomWord = {};
        await vocabBook.getRandomWord().then(async (w) => { 
          if (!w) {
            console.log(chalk.yellow('生词本为空，先使用 qline -s <word> 记录生词吧！'));
            return;
          }

          randomWord = await dictDB.queryWord(w);
        });

        // 显示单词，等待用户确认
        console.log(chalk.cyan(`\n📖 请回忆单词：`) + chalk.bold(randomWord.word));
        console.log(chalk.gray('按回车查看释义...'));

        // 监听回车事件
        process.stdin.once('data', () => {
          // 格式化输出释义
          console.log('\n' + chalk.green.bold(`【${randomWord.word}】`) + (randomWord.phonetic ? chalk.gray(` ${randomWord.phonetic}`) : ''));
          console.log(chalk.blue(`释义：`));
          const translations = randomWord.translation.split('/').filter(t => t.trim());
          translations.forEach((t, i) => {
            console.log(`  ${i + 1}. ${t.trim()}`);
          });
          process.exit(0);
        });
      } catch (err) {
        console.log(chalk.red('复习失败：'), err.message);
        dictDB.close();
        vocabBook.close();
      }
}

module.exports = recallNewWord;