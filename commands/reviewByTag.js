const debug = require('../lib/log');
const vocab = require('../lib/vocab');
const {readlineAsync} = require('../lib/util');
const {WordData,WordBook} = require('../lib/wordBook');
const chalk = require('chalk');

async function reviewByTag(tag,count){


    const asyncGetQueryDB = require('../lib/asyncGetQueryDB');
    const dictDb = await asyncGetQueryDB();
    const book = new WordBook();
     
    let needBreak = false;
    try {
       //console.log(chalk.cyan("\n 根据中文释义拼写单词，按Ctrl+C退出"))
       let records = await dictDb.queryByTag(tag,count);
       records.forEach(record =>{
        book.addWord(new WordData(record));
       });
       while(!needBreak){ 

           let randomWord = book.getNextWord();
           
            if(!randomWord){
                console.log(chalk.green(`\n\n 完成训练`));
                break;
            }
            console.log(chalk.cyan("\n 根据提示拼写单词，按Ctrl+C退出"))

            console.log(chalk.gray('\n===============================================\n'));
            if(randomWord.phonetic){
                console.log(chalk.cyan("读音："),chalk.bold(randomWord.phonetic));
            }
            console.log(chalk.cyan("释义：\n"),chalk.bold(randomWord.translation.trim()));
            // 显示单词，等待用户确认
            process.stdout.write(chalk.blue(`\n请输入单词：`));
            process.stdin.setEncoding('utf8');
            process.stdin.resume();
            const input = await readlineAsync();
            const userInput = input.trim().toLowerCase();
            let wordShow ;
            if(userInput.toLowerCase() == randomWord.word.toLowerCase()){
                book.studyWord(randomWord,true);
                console.log(chalk.bold(chalk.green('\n恭喜你，回答正确！')));
                wordShow = chalk.green(randomWord.word);
            }else{
                book.studyWord(randomWord,false);
                console.log(chalk.bold(chalk.red('\n很遗憾，回答错误！')));
                wordShow = chalk.red(randomWord.word);
                await vocab.recordWord(randomWord.word);
            }

            // 格式化输出释义
            console.log('\n' + chalk.green.bold(`【${wordShow}】`) + (randomWord.phonetic ? chalk.gray(` ${randomWord.phonetic}`) : ''));
            console.log(chalk.blue(`释义：`));
            const translations = randomWord.translation.split('/').filter(t => t.trim());
            translations.forEach((t, i) => {
                console.log(`  ${i + 1}. ${t.trim()}`);
            });
        }

    }
    catch (err) {
        console.log(chalk.red( err.message));
    }
}

module.exports=reviewByTag;
