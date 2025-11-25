const readlineAsync = require('../lib/util').readlineAsync;
async function recallByPronunciation(word){

    const chalk = require('chalk');
    const dictDB = require('../lib/db');
    const vocabBook = require('../lib/vocab');
    let needBreak = false;
    try {
       await dictDB.connect();
       console.log(chalk.cyan("\n 根据读音拼写单词，按Ctrl+C退出"))
       while(!needBreak){ 
           
            let randomWord = {};
            let w = await vocabBook.getRandomWord();
            randomWord = await dictDB.queryWord(w);
            console.log('\n=============================================\n');

            if(randomWord.phonetic){
               
                console.log(chalk.cyan("读音："),chalk.bold(randomWord.phonetic));
            } else{
                console.log(chalk.cyan("释义："),chalk.bold(randomWord.translation));
            }
            // 显示单词，等待用户确认
            process.stdout.write(chalk.blue(`\n请输入单词：`));
            process.stdin.setEncoding('utf8');
            process.stdin.resume();
            const input = await readlineAsync();
            const userInput = input.trim().toLowerCase();
            //process.stdin.pause();
            if(userInput == randomWord.word){
                console.log(chalk.green('恭喜你，猜对了！'));
            }else{
                console.log(chalk.red('很遗憾，猜错了。'));
            }

            // 格式化输出释义
            console.log('\n' + chalk.green.bold(`【${randomWord.word}】`) + (randomWord.phonetic ? chalk.gray(` ${randomWord.phonetic}`) : ''));
            console.log(chalk.blue(`释义：`));
            const translations = randomWord.translation.split('/').filter(t => t.trim());
            translations.forEach((t, i) => {
                console.log(`  ${i + 1}. ${t.trim()}`);
            });
        }

    }
    catch (err) {
        console.log(chalk.red('发生故障：'), err.message);
    }
    vocabBook.close();
    dictDB.close();


}

module.exports=recallByPronunciation